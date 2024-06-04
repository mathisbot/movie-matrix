use api::proto::{movie_service_client::MovieServiceClient, GetMoviesRequest, SearchMovieRequest};

use crate::helpers::spawn_app;

#[tokio::test]
async fn get_movies_returns_movies() {
    let app = spawn_app().await;

    let mut client = MovieServiceClient::connect(app.address).await.unwrap();

    let res = client
        .get_movies(GetMoviesRequest {
            limit: 10,
            offset: 0,
        })
        .await
        .unwrap();

    assert_eq!(res.into_inner().movies.len(), 10);
}

#[tokio::test]
async fn search_movie_returns_no_movies() {
    let app = spawn_app().await;

    let mut client = MovieServiceClient::connect(app.address).await.unwrap();

    let res = client
        .search_movie(SearchMovieRequest {
            query: "ThisIsNotAMovie".to_string(),
            limit: 10,
        })
        .await
        .unwrap();

    let body = res.into_inner();

    assert_eq!(body.movies.len(), 0);
}

#[tokio::test]
async fn get_movie_returns_movie() {
    let app = spawn_app().await;

    let mut client = MovieServiceClient::connect(app.address).await.unwrap();

    let res = client
        .get_movies(GetMoviesRequest {
            limit: 1,
            offset: 0,
        })
        .await
        .unwrap();

    let movie = &res.into_inner().movies[0];

    let res = client
        .get_movie(api::proto::GetMovieRequest { id: movie.id })
        .await
        .unwrap();

    let body = res.into_inner();

    assert_eq!(body.movie.unwrap().id, movie.id);
}
