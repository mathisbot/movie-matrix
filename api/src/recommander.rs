use std::{collections::HashMap, fs};

use hora::{
    core::{
        ann_index::{ANNIndex, SerializableIndex},
        metrics::Metric,
    },
    index::{hnsw_idx::HNSWIndex, hnsw_params::HNSWParams},
};
use rust_bert::pipelines::sentence_embeddings::{
    SentenceEmbeddingsBuilder, SentenceEmbeddingsModel, SentenceEmbeddingsModelType,
};
use serde_json;
use sqlx::PgPool;
use tokio::task;

struct VectorizedMovie {
    id: i32,
    vector: Vec<f32>,
}

struct RecommandationMovie {
    id: i32,
    popularity: f32,
    genres: Option<Vec<i32>>,
    overview: String,
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

fn vectorize_movie(
    movie: &RecommandationMovie,
    genres_map: &HashMap<i32, usize>,
    model: &SentenceEmbeddingsModel,
) -> Vec<f32> {
    let mut vector = vec![0.0; genres_map.len() + 1];

    vector[0] = movie.popularity;

    if movie.genres.is_some() {
        for genre in movie.genres.as_ref().unwrap() {
            if let Some(index) = genres_map.get(genre) {
                vector[*index + 1] = 1.0;
            } else {
                panic!("Genre not found in genres map")
            }
        }
    }

    let embedding = model.encode(&[movie.overview.clone()]).unwrap();

    vector.extend(embedding[0].to_vec());

    vector
}

pub async fn build_index(pg_pool: &PgPool) -> HNSWIndex<f32, i32> {
    if fs::metadata("index.bin").is_ok() {
        println!("Index found");
        return HNSWIndex::load("index.bin").unwrap();
    }

    let genres_map = build_genres_map(pg_pool.clone()).await;

    let dimension = 1 + genres_map.len() + 384;

    let movies = sqlx::query_as!(
        RecommandationMovie,
        r#"
        SELECT movies.id, movies.popularity, movies.overview, ARRAY_AGG(movie_genres.genre_id) as "genres: Vec<i32>"
        FROM movies
        JOIN movie_genres ON movies.id = movie_genres.movie_id
        GROUP BY movies.id
        "#,
    )
    .fetch_all(pg_pool)
    .await
    .expect("Failed to fetch movies");

    println!("Vectorizing movies...");

    let vectorizer_thread = task::spawn_blocking(move || {
        let model = SentenceEmbeddingsBuilder::remote(SentenceEmbeddingsModelType::AllMiniLmL12V2)
            .create_model()
            .unwrap();

        movies
            .iter()
            .map(|movie| VectorizedMovie {
                id: movie.id,
                vector: vectorize_movie(movie, &genres_map, &model),
            })
            .collect::<Vec<VectorizedMovie>>()
    });

    let vectorized_movies = vectorizer_thread.await.unwrap();

    println!("Building index...");

    let mut index = HNSWIndex::<f32, i32>::new(dimension, &HNSWParams::<f32>::default());

    for vectorize_movie in vectorized_movies.iter() {
        index
            .add(&vectorize_movie.vector, vectorize_movie.id)
            .expect("Failed to add movie to index");

        let vector_json = serde_json::to_string(&vectorize_movie.vector).unwrap();

        sqlx::query!(
            r#"
            UPDATE movies SET embedding = $2
            WHERE id = $1
            "#,
            vectorize_movie.id,
            vector_json
        )
        .execute(pg_pool)
        .await
        .expect("Failed to insert movie vector");
    }

    index.build(Metric::Euclidean).unwrap();

    println!("Index built!");

    index.dump("index.bin").unwrap();

    index
}

pub async fn predict(
    index: &HNSWIndex<f32, i32>,
    pg_pool: &PgPool,
    user_id: i32,
    k: usize,
) -> Vec<i32> {
    let genres_map = build_genres_map(pg_pool.clone()).await;

    let dimension = 1 + genres_map.len() + 384;

    let user_rated_movies = sqlx::query!(
        r#"
        SELECT movies.id, movies.embedding, ratings.rating
        FROM movies
        JOIN ratings ON movies.id = ratings.movie_id
        WHERE ratings.user_id = $1
        GROUP BY movies.id, ratings.rating
        "#,
        user_id
    )
    .fetch_all(pg_pool)
    .await
    .expect("Failed to fetch user rated movies");

    let user_vector = user_rated_movies
        .iter()
        .fold(vec![0.0; dimension], |mut acc, movie| {
            if movie.embedding.is_none() {
                panic!("Movie {} has no embedding", movie.id);
            }

            let vector: Vec<f32> = serde_json::from_str(&movie.embedding.clone().unwrap()).unwrap();

            for (index, value) in vector.iter().enumerate() {
                acc[index] += value * (movie.rating - 5.0) / 5.0
            }

            acc
        });

    let results = index.search(&user_vector, k);

    results
}
