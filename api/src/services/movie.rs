use hora::index::hnsw_idx::HNSWIndex;
use sqlx::PgPool;

use crate::configuration::Settings;
use crate::proto::movie_service_server::MovieService as MovieTrait;
use crate::proto::{
    GetMovieRequest, GetMovieResponse, GetMoviesRequest, GetMoviesResponse, SearchMovieRequest,
    SearchMovieResponse, Cast
};
use crate::recommander::{build_index, predict};

const MAX_CAST_SIZE: usize = 7;

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

        let casting = credits.cast.into_iter().take(MAX_CAST_SIZE).map(|cast| Cast {
            id: cast.id,
            name: cast.name,
            role: cast.character,
            profile_url: match cast.profile_path {
                Some(text) => format!("https://image.tmdb.org/t/p/w500/{}", text),
                None => "".to_string(),
            },
        }).collect();

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

    async fn get_movies(
        &self,
        request: tonic::Request<GetMoviesRequest>,
    ) -> Result<tonic::Response<GetMoviesResponse>, tonic::Status> {
        let user_id = extract_user_id(&request);

        let body = request.into_inner();

        let has_user_rated_movies = sqlx::query!(
            r#"
            SELECT EXISTS (
                SELECT 1 FROM ratings
                WHERE user_id = $1
            ) as "exists!"
            "#,
            user_id
        )
        .fetch_one(&self.connection)
        .await
        .map_err(|_| tonic::Status::internal("Failed to check if user has rated movies"))?
        .exists;

        if has_user_rated_movies == true {
            let recommended_movies = predict(&self.index, &self.connection, user_id, 10).await;
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

            return Ok(tonic::Response::new(GetMoviesResponse { movies }));
        };

        let movies = sqlx::query!(
            r#"
                SELECT * FROM movies
                ORDER BY popularity DESC
                LIMIT $1
                OFFSET $2
                "#,
            body.limit as i64,
            body.offset as i64
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

        Ok(tonic::Response::new(GetMoviesResponse { movies }))
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
