use crate::{configuration::Settings, startup::get_connection_pool};

#[derive(serde::Deserialize)]
struct Genre {
    id: i32,
    name: String,
}

#[derive(serde::Deserialize)]
struct GenresResponse {
    genres: Vec<Genre>,
}

#[derive(serde::Deserialize)]
struct Movie {
    id: i32,
    adult: bool,
    original_language: String,
    original_title: String,
    popularity: f32,
    poster_path: Option<String>,
    backdrop_path: Option<String>,
    release_date: String,
    title: String,
    video: bool,
    genre_ids: Vec<i32>,
    vote_average: f32,
    vote_count: i32,
    overview: String,
}

#[derive(serde::Deserialize)]
struct MovieResponse {
    results: Vec<Movie>,
}

pub async fn fetch_movies(configuration: Settings, pages_to_fetch: i32) {
    // if we already have the data, we don't need to fetch it again
    let count = sqlx::query!("SELECT COUNT(*) FROM movies")
        .fetch_one(&get_connection_pool(&configuration.database))
        .await
        .expect("Failed to fetch movie count.")
        .count
        .unwrap_or(0);
    if count > 0 {
        println!("Movies already fetched.");
        return;
    }

    let db_pool = get_connection_pool(&configuration.database);

    let client = reqwest::Client::new();

    // Import genres
    let genres_url = format!("{}/genre/movie/list", configuration.the_movie_db.base_url);
    let response = client
        .get(&genres_url)
        .bearer_auth(configuration.the_movie_db.api_key.clone())
        .send()
        .await
        .expect("Failed to fetch genres.");

    let genres = response
        .json::<GenresResponse>()
        .await
        .expect("Failed to parse genres.");

    for genre in genres.genres {
        sqlx::query!(
            r#"
            INSERT INTO genres (id, name)
            VALUES ($1, $2)
            ON CONFLICT (id) DO UPDATE
            SET name = $2
            "#,
            genre.id,
            genre.name
        )
        .execute(&db_pool)
        .await
        .expect("Failed to insert genre.");
    }

    for page in 1..=pages_to_fetch {
        println!("Fetching page {} of {}", page, pages_to_fetch);

        let url = format!(
            "{}/movie/popular?page={}",
            configuration.the_movie_db.base_url, page
        );
        let response = client
            .get(&url)
            .bearer_auth(configuration.the_movie_db.api_key.clone())
            .send()
            .await
            .expect("Failed to fetch movies.");

        let response = response
            .json::<MovieResponse>()
            .await
            .expect("Failed to parse movies.");

        for movie in response.results {
            sqlx::query!(
                r#"INSERT INTO movies (id, adult, original_language, original_title, popularity, poster_path, backdrop_path, release_date, title, video, vote_average, vote_count, overview)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (id) DO UPDATE
                SET adult = $2, original_language = $3, original_title = $4, popularity = $5, poster_path = $6, backdrop_path = $7, release_date = $8, title = $9, video = $10, vote_average = $11, vote_count = $12, overview = $13
                "#,
                movie.id,
                movie.adult,
                movie.original_language,
                movie.original_title,
                movie.popularity,
                movie.poster_path,
                movie.backdrop_path,
                movie.release_date,
                movie.title,
                movie.video,
                movie.vote_average,
                movie.vote_count,
                movie.overview
            ).execute(&db_pool).await.expect("Failed to insert movie.");

            for genre_id in movie.genre_ids {
                sqlx::query!(
                    r#"INSERT INTO movie_genres (movie_id, genre_id)
                    VALUES ($1, $2)
                    ON CONFLICT (movie_id, genre_id) DO NOTHING
                    "#,
                    movie.id,
                    genre_id
                )
                .execute(&db_pool)
                .await
                .expect("Failed to insert movie genre.");
            }
        }
    }
}
