use sqlx::PgPool;

use crate::configuration::Settings;
use crate::proto::movie_service_server::MovieService as MovieTrait;
use crate::proto::{
    GetMovieRequest, GetMovieResponse, GetMoviesRequest, GetMoviesResponse, SearchMovieRequest,
    SearchMovieResponse,
};

#[derive(serde::Deserialize)]
struct Genre {
    name: String,
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
}

impl MovieService {
    pub fn new(connection: PgPool, configuration: Settings) -> Self {
        Self {
            connection,
            configuration,
        }
    }
}

#[tonic::async_trait]
impl MovieTrait for MovieService {
    async fn get_movie(
        &self,
        request: tonic::Request<GetMovieRequest>,
    ) -> Result<tonic::Response<GetMovieResponse>, tonic::Status> {
        let user_id = request
            .metadata()
            .get("user_id")
            .unwrap()
            .to_str()
            .unwrap()
            .parse::<i32>()
            .unwrap();

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
            casting: vec![],
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
        let body = request.into_inner();

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
        let user_id = request
            .metadata()
            .get("user_id")
            .unwrap()
            .to_str()
            .unwrap()
            .parse::<i32>()
            .unwrap();

        let body = request.into_inner();

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
