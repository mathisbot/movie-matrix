use std::collections::HashMap;

use hora::{
    core::{ann_index::ANNIndex, metrics::Metric},
    index::{hnsw_idx::HNSWIndex, hnsw_params::HNSWParams},
};
use sqlx::PgPool;

struct PredictionMovie {
    id: i32,
    popularity: f32,
    genres: Option<Vec<i32>>,
}

async fn build_genres_map(pg_pool: PgPool) -> HashMap<i32, usize> {
    let mut genres_map = HashMap::new();

    let genres = sqlx::query!("SELECT id FROM genres")
        .fetch_all(&pg_pool)
        .await
        .expect("Failed to fetch genres");

    for (index, genre) in genres.iter().enumerate() {
        genres_map.insert(genre.id, index);
    }

    genres_map
}

fn vectorize_movie(movie: &PredictionMovie, genres_map: &HashMap<i32, usize>) -> Vec<f32> {
    let mut vector = vec![0.0; genres_map.len() + 1];
    vector[0] = movie.popularity;

    if movie.genres.is_some() {
        for genre in movie.genres.as_ref().unwrap() {
            if let Some(index) = genres_map.get(genre) {
                vector[*index] = 1.0;
            } else {
                panic!("Genre not found in genres map")
            }
        }
    }

    vector
}

pub async fn build_index(pg_pool: &PgPool) -> HNSWIndex<f32, i32> {
    println!("Building index...");

    let genres_map = build_genres_map(pg_pool.clone()).await;

    let dimension = genres_map.len() + 1;

    let movies = sqlx::query_as!(
        PredictionMovie,
        r#"
        SELECT movies.id, movies.popularity, ARRAY_AGG(movie_genres.genre_id) as "genres: Vec<i32>"
        FROM movies
        JOIN movie_genres ON movies.id = movie_genres.movie_id
        GROUP BY movies.id
        "#,
    )
    .fetch_all(pg_pool)
    .await
    .expect("Failed to fetch movies");

    let mut index = HNSWIndex::<f32, i32>::new(dimension, &HNSWParams::<f32>::default());

    movies.iter().for_each(|movie| {
        let vector = vectorize_movie(movie, &genres_map);
        index
            .add(&vector, movie.id)
            .expect("Failed to add movie to index");
    });

    index.build(Metric::DotProduct).unwrap();

    println!("Index built!");

    index
}

pub async fn predict(
    index: &HNSWIndex<f32, i32>,
    pg_pool: &PgPool,
    user_id: i32,
    k: usize,
) -> Vec<i32> {
    let genres_map = build_genres_map(pg_pool.clone()).await;

    let dimension = genres_map.len() + 1;

    let user_rated_movies = sqlx::query!(
        r#"
        SELECT movies.id, movies.popularity, ARRAY_AGG(movie_genres.genre_id) as "genres: Vec<i32>", ratings.rating, movies.vote_average
        FROM movies
        JOIN movie_genres ON movies.id = movie_genres.movie_id
        JOIN ratings ON movies.id = ratings.movie_id
        WHERE ratings.user_id = $1
        GROUP BY movies.id, ratings.rating
        "#,
        user_id
    ).fetch_all(pg_pool)
    .await.expect("Failed to fetch user rated movies");

    let user_vector = user_rated_movies
        .iter()
        .fold(vec![0.0; dimension], |mut acc, movie| {
            let vector = vectorize_movie(
                &PredictionMovie {
                    id: movie.id,
                    popularity: movie.popularity,
                    genres: movie.genres.clone(),
                },
                &genres_map,
            );

            for (index, value) in vector.iter().enumerate() {
                acc[index] += value * (movie.rating - movie.vote_average);
            }

            acc
        });

    println!("User vector: {:?}", user_vector);

    let results = index.search(&user_vector, k);

    results
}
