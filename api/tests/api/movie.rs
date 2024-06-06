use api::proto::{
    movie_service_client::MovieServiceClient, user_service_client::UserServiceClient,
    GetPopularMoviesRequest, SearchMovieRequest, SignUpRequest,
};
use tonic::{metadata::MetadataValue, Request};

use crate::helpers::spawn_app;

#[tokio::test]
async fn get_popular_movies_returns_movies() {
    let app = spawn_app().await;

    let mut client = MovieServiceClient::connect(app.address.clone())
        .await
        .unwrap();

    let mut request = Request::new(GetPopularMoviesRequest {
        limit: 10,
        offset: 0,
    });

    let token: MetadataValue<_> = get_valid_token(app.address.clone()).await.into();

    request.metadata_mut().insert("authorization", token);

    let res = client.get_popular_movies(request).await.unwrap();

    assert_eq!(res.into_inner().movies.len(), 10);
}

#[tokio::test]
async fn search_movie_returns_no_movies() {
    let app = spawn_app().await;

    let mut client = MovieServiceClient::connect(app.address.clone())
        .await
        .unwrap();

    let mut request = Request::new(SearchMovieRequest {
        query: "ThisIsNotAMovie".to_string(),
        limit: 10,
    });

    let token: MetadataValue<_> = get_valid_token(app.address.clone()).await.into();

    request.metadata_mut().insert("authorization", token);

    let res = client.search_movie(request).await.unwrap();

    let body = res.into_inner();

    assert_eq!(body.movies.len(), 0);
}

#[tokio::test]
async fn get_movie_returns_movie() {
    let app = spawn_app().await;

    let mut client = MovieServiceClient::connect(app.address.clone())
        .await
        .unwrap();

    let mut request = Request::new(GetPopularMoviesRequest {
        limit: 1,
        offset: 0,
    });

    let token: MetadataValue<_> = get_valid_token(app.address.clone()).await.into();

    request
        .metadata_mut()
        .insert("authorization", token.clone());

    let res = client.get_popular_movies(request).await.unwrap();

    let movie = &res.into_inner().movies[0];

    let mut request = Request::new(api::proto::GetMovieRequest { id: movie.id });

    request.metadata_mut().insert("authorization", token);

    let res = client.get_movie(request).await.unwrap();

    let body = res.into_inner();

    assert_eq!(body.movie.unwrap().id, movie.id);
}

#[tokio::test]
async fn vote_movie_works() {
    let app = spawn_app().await;

    let mut client = MovieServiceClient::connect(app.address.clone())
        .await
        .unwrap();

    let mut request = Request::new(GetPopularMoviesRequest {
        limit: 1,
        offset: 0,
    });

    let token: MetadataValue<_> = get_valid_token(app.address.clone()).await.into();

    request
        .metadata_mut()
        .insert("authorization", token.clone());

    let res = client.get_popular_movies(request).await.unwrap();

    let movie = &res.into_inner().movies[0];

    let mut request = Request::new(api::proto::VoteMovieRequest {
        movie_id: movie.id,
        vote: 5.0,
    });

    request
        .metadata_mut()
        .insert("authorization", token.clone());

    let _ = client.vote_movie(request).await.unwrap();

    let mut request = Request::new(api::proto::GetMovieRequest { id: movie.id });
    request.metadata_mut().insert("authorization", token);

    let res = client.get_movie(request).await.unwrap();

    let body = res.into_inner().movie.unwrap();

    assert_eq!(body.user_vote.unwrap(), 5.0);
}

pub async fn get_valid_token(address: String) -> MetadataValue<tonic::metadata::Ascii> {
    let mut client = UserServiceClient::connect(address).await.unwrap();

    let req = SignUpRequest {
        username: "zola".to_string(),
        password: "poney".to_string(),
    };

    let res = client.sign_up(req).await.unwrap();

    res.into_inner().session_token.parse().unwrap()
}
