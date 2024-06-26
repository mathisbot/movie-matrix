use hora::core::ann_index::ANNIndex;
use hora::index::hnsw_idx::HNSWIndex;
use sqlx::PgPool;

use crate::configuration::Settings;
use crate::proto::movie_service_server::MovieService as MovieTrait;
use crate::proto::{
    Cast, GetMovieRequest, GetMovieResponse, GetPopularMoviesRequest, GetPopularMoviesResponse,
    GetRecommandedMoviesRequest, GetRecommandedMoviesResponse, GetSimilarMoviesResponse,
    SearchMovieRequest, SearchMovieResponse,
};
use crate::recommander::{build_index, predict};

#[derive(serde::Deserialize)]
struct Genre {
    name: String,
}

#[allow(dead_code)]
#[derive(serde::Deserialize)]
struct CastResponse {
    adult: bool,
    gender: i32,
    id: i32,
    known_for_department: String,
    name: String,
    original_name: String,
    popularity: f32,
    profile_path: Option<String>,
    cast_id: i32,
    character: String,
    credit_id: String,
    order: i32,
}

#[allow(dead_code)]
#[derive(serde::Deserialize)]
struct Credits {
    id: i32,
    cast: Vec<CastResponse>,
}

#[derive(serde::Deserialize)]
struct Movie {
    id: i32,
    title: String,
    overview: String,
    poster_path: Option<String>,
    backdrop_path: Option<String>,
    vote_average: f32,
    release_date: String,
    runtime: i32,
    genres: Vec<Genre>,
}

pub struct MovieService {
    configuration: Settings,
    connection: PgPool,
    index: HNSWIndex<f32, i32>,
}

impl MovieService {
    pub async fn new(connection: PgPool, configuration: Settings) -> Self {
        let index = build_index(&connection).await;

        Self {
            connection,
            configuration,
            index,
        }
    }
}

#[tonic::async_trait]
impl MovieTrait for MovieService {
    async fn get_movie(
        &self,
        request: tonic::Request<GetMovieRequest>,
    ) -> Result<tonic::Response<GetMovieResponse>, tonic::Status> {
        let user_id = extract_user_id(&request);

        let body = request.into_inner();

        let response = reqwest::Client::new()
            .get(&format!(
                "{}/movie/{}",
                self.configuration.the_movie_db.base_url, body.id
            ))
            .bearer_auth(&self.configuration.the_movie_db.api_key)
            .send()
            .await
            .map_err(|_| tonic::Status::internal("Failed to fetch movie"))?;

        let movie: Movie = response
            .json()
            .await
            .map_err(|_| tonic::Status::internal("Failed to parse movie"))?;

        let credits: Credits = reqwest::Client::new()
            .get(&format!(
                "{}/movie/{}/credits",
                self.configuration.the_movie_db.base_url, body.id
            ))
            .bearer_auth(&self.configuration.the_movie_db.api_key)
            .send()
            .await
            .map_err(|_| tonic::Status::internal("Failed to fetch movie credits"))?
            .json()
            .await
            .map_err(|_| tonic::Status::internal("Failed to parse movie credits"))?;

        let casting = credits
            .cast
            .into_iter()
            .map(|cast| Cast {
                id: cast.id,
                name: cast.name,
                role: cast.character,
                profile_url: match cast.profile_path {
                    Some(text) => format!("https://image.tmdb.org/t/p/w500/{}", text),
                    None => "".to_string(),
                },
            })
            .collect();

        let user_rating = sqlx::query!(
            r#"
            SELECT rating FROM ratings
            WHERE user_id = $1 AND movie_id = $2
            "#,
            user_id,
            movie.id
        )
        .fetch_optional(&self.connection)
        .await
        .map_err(|_| tonic::Status::internal("Failed to fetch user rating"))
        .map(|rating| rating.map(|rating| rating.rating))?;

        let movie = crate::proto::Movie {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster_url: movie
                .poster_path
                .map(|text| format!("https://image.tmdb.org/t/p/w500/{}", text)),
            backdrop_url: movie
                .backdrop_path
                .map(|text| format!("https://image.tmdb.org/t/p/w1280/{}", text)),
            release_date: movie.release_date,
            runtime: movie.runtime,
            vote_average: movie.vote_average,
            casting: casting,
            genres: movie.genres.into_iter().map(|genre| genre.name).collect(),
            user_vote: user_rating,
        };

        Ok(tonic::Response::new(GetMovieResponse {
            movie: Some(movie),
        }))
    }

    async fn get_popular_movies(
        &self,
        request: tonic::Request<GetPopularMoviesRequest>,
    ) -> Result<tonic::Response<GetPopularMoviesResponse>, tonic::Status> {
        let body = request.into_inner();

        let movies = sqlx::query!(
            r#"
                SELECT DISTINCT movies.*
                FROM movies
                JOIN movie_genres ON movies.id = movie_genres.movie_id
                JOIN genres ON movie_genres.genre_id = genres.id
                WHERE $3 = '*' OR genres.name = $3
                ORDER BY movies.popularity DESC
                LIMIT $1
                OFFSET $2
            "#,
            body.limit as i64,
            body.offset as i64,
            body.genre.as_str(),
        )
        .fetch_all(&self.connection)
        .await
        .map_err(|_| tonic::Status::internal("Failed to fetch movies"))?;

        let poster_base_url = "https://image.tmdb.org/t/p/w500/";

        let movies: Vec<crate::proto::MoviePreview> = movies
            .into_iter()
            .map(|movie| crate::proto::MoviePreview {
                id: movie.id,
                title: movie.title,
                poster_url: movie
                    .poster_path
                    .map(|text| format!("{}{}", poster_base_url, text)),
                vote_average: movie.vote_average,
            })
            .collect();

        Ok(tonic::Response::new(GetPopularMoviesResponse { movies }))
    }

    async fn get_recommanded_movies(
        &self,
        request: tonic::Request<GetRecommandedMoviesRequest>,
    ) -> Result<tonic::Response<GetRecommandedMoviesResponse>, tonic::Status> {
        let user_id = extract_user_id(&request);

        let body = request.into_inner();

        let recommended_movies = predict(
            &self.index,
            &self.connection,
            user_id,
            body.limit.try_into().unwrap(),
        )
        .await;
        let mut movies = sqlx::query!(
            r#"
                SELECT * FROM movies
                WHERE id = ANY($1)
                "#,
            recommended_movies.as_slice()
        )
        .fetch_all(&self.connection)
        .await
        .map_err(|_| tonic::Status::internal("Failed to fetch movies"))?;

        // sort movies by the order of the recommended_movies
        movies.sort_by_key(|movie| recommended_movies.iter().position(|id| *id == movie.id));

        let poster_base_url = "https://image.tmdb.org/t/p/w500/";

        let movies: Vec<crate::proto::MoviePreview> = movies
            .into_iter()
            .map(|movie| crate::proto::MoviePreview {
                id: movie.id,
                title: movie.title,
                poster_url: movie
                    .poster_path
                    .map(|text| format!("{}{}", poster_base_url, text)),
                vote_average: movie.vote_average,
            })
            .collect();

        return Ok(tonic::Response::new(GetRecommandedMoviesResponse {
            movies,
        }));
    }

    async fn search_movie(
        &self,
        request: tonic::Request<SearchMovieRequest>,
    ) -> Result<tonic::Response<SearchMovieResponse>, tonic::Status> {
        let body = request.into_inner();

        let movies = sqlx::query!(
            r#"
            SELECT * FROM movies
            WHERE title ILIKE $1
            ORDER BY popularity DESC
            LIMIT $2
            "#,
            format!("%{}%", body.query),
            body.limit as i64,
        )
        .fetch_all(&self.connection)
        .await
        .map_err(|_| tonic::Status::internal("Failed to fetch movies"))?;

        let movies = movies
            .into_iter()
            .map(|movie| crate::proto::MoviePreview {
                id: movie.id,
                title: movie.title,
                poster_url: movie
                    .poster_path
                    .map(|text| format!("https://image.tmdb.org/t/p/w500/{}", text)),
                vote_average: movie.vote_average,
            })
            .collect();

        Ok(tonic::Response::new(SearchMovieResponse { movies }))
    }

    async fn vote_movie(
        &self,
        request: tonic::Request<crate::proto::VoteMovieRequest>,
    ) -> Result<tonic::Response<crate::proto::VoteMovieResponse>, tonic::Status> {
        let user_id = extract_user_id(&request);

        let body = request.into_inner();

        println!("{:?}", body);

        sqlx::query!(
            r#"
            INSERT INTO ratings (user_id, movie_id, rating)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, movie_id) DO UPDATE
            SET rating = $3
            "#,
            user_id,
            body.movie_id,
            body.vote,
        )
        .execute(&self.connection)
        .await
        .map_err(|e| {
            println!("{:?}", e.to_string());
            tonic::Status::internal("Failed to vote movie")
        })?;

        Ok(tonic::Response::new(crate::proto::VoteMovieResponse {}))
    }

    async fn get_similar_movies(
        &self,
        request: tonic::Request<crate::proto::GetSimilarMoviesRequest>,
    ) -> Result<tonic::Response<crate::proto::GetSimilarMoviesResponse>, tonic::Status> {
        let body = request.into_inner();

        let movie_embedding = sqlx::query!(
            r#"
            SELECT embedding FROM movies
            WHERE id = $1
            "#,
            body.movie_id
        )
        .fetch_one(&self.connection)
        .await
        .map_err(|_| tonic::Status::internal("Failed to fetch movie vector"))?
        .embedding;

        let movie_vector: Vec<f32> =
            serde_json::from_str(&movie_embedding.clone().unwrap()).unwrap();

        let mut similar_movies = self
            .index
            .search(&movie_vector, (body.limit+1).try_into().unwrap());

        similar_movies.retain(|id| *id != body.movie_id);

        let similar_movies: Vec<_> = similar_movies.into_iter().take(body.limit as usize).collect();

        let mut movies = sqlx::query!(
            r#"
                    SELECT * FROM movies
                    WHERE id = ANY($1) AND id != $2
                    "#,
            similar_movies.as_slice(),
            body.movie_id
        )
        .fetch_all(&self.connection)
        .await
        .map_err(|_| tonic::Status::internal("Failed to fetch movies"))?;

        // sort movies by the order of the recommended_movies
        movies.sort_by_key(|movie| similar_movies.iter().position(|id| *id == movie.id));

        let poster_base_url = "https://image.tmdb.org/t/p/w500/";

        let movies: Vec<crate::proto::MoviePreview> = movies
            .into_iter()
            .map(|movie| crate::proto::MoviePreview {
                id: movie.id,
                title: movie.title,
                poster_url: movie
                    .poster_path
                    .map(|text| format!("{}{}", poster_base_url, text)),
                vote_average: movie.vote_average,
            })
            .collect();

        return Ok(tonic::Response::new(GetSimilarMoviesResponse { movies }));
    }
}

fn extract_user_id<T>(request: &tonic::Request<T>) -> i32 {
    request
        .metadata()
        .get("user_id")
        .unwrap()
        .to_str()
        .unwrap()
        .parse::<i32>()
        .unwrap()
}
