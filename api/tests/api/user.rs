use api::{
    domain::SessionToken,
    proto::{user_service_client::UserServiceClient, LoginRequest, SignUpRequest},
};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};

use crate::helpers::spawn_app;

#[tokio::test]
async fn signup_success_for_valid_data() {
    let app = spawn_app().await;

    let mut client = UserServiceClient::connect(app.address).await.unwrap();

    let username = "zola".to_string();

    let req = SignUpRequest {
        username: username.clone(),
        password: "poney".to_string(),
    };

    let res = client.sign_up(req).await.unwrap();

    let saved = sqlx::query!("SELECT username FROM users")
        .fetch_one(&app.db_pool)
        .await
        .unwrap();

    assert_eq!(saved.username, username);

    let session_token = decode_token_without_validation(&res.into_inner().session_token).unwrap();

    let saved = sqlx::query!("SELECT users.username FROM users JOIN sessions ON users.id = sessions.user_id WHERE sessions.id = $1", session_token.session_id)
        .fetch_one(&app.db_pool)
        .await.unwrap();

    assert_eq!(saved.username, username);
}

#[tokio::test]
async fn signup_fails_for_existing_username() {
    let app = spawn_app().await;

    let mut client = UserServiceClient::connect(app.address).await.unwrap();

    let req = SignUpRequest {
        username: "zola".to_string(),
        password: "poney".to_string(),
    };

    let _ = client.sign_up(req.clone()).await;

    let res = client.sign_up(req).await;

    assert!(res.is_err());
}

#[tokio::test]
async fn login_success_for_valid_data() {
    let app = spawn_app().await;

    let mut client = UserServiceClient::connect(app.address).await.unwrap();

    let username = "zola".to_string();
    let password = "poney".to_string();

    let req = SignUpRequest {
        username: username.clone(),
        password: password.clone(),
    };

    let _ = client.sign_up(req).await.unwrap();

    let res = client
        .login(LoginRequest {
            username: username.clone(),
            password: password.clone(),
        })
        .await
        .unwrap();

    let session_token = decode_token_without_validation(&res.into_inner().session_token).unwrap();

    let saved = sqlx::query!("SELECT users.username FROM users JOIN sessions ON users.id = sessions.user_id WHERE sessions.id = $1", session_token.session_id)
        .fetch_one(&app.db_pool)
        .await.unwrap();

    assert_eq!(saved.username, username);
}

#[tokio::test]
async fn login_fails_for_invalid_password() {
    let app = spawn_app().await;

    let mut client = UserServiceClient::connect(app.address).await.unwrap();

    let username = "zola".to_string();

    let req = SignUpRequest {
        username: username.clone(),
        password: "poney".to_string(),
    };

    let _ = client.sign_up(req).await.unwrap();

    let res = client
        .login(LoginRequest {
            username: username.clone(),
            password: "wrong".to_string(),
        })
        .await;

    assert!(res.is_err());
}

#[tokio::test]
async fn login_fails_for_unknown_username() {
    let app = spawn_app().await;

    let mut client = UserServiceClient::connect(app.address).await.unwrap();

    let res = client
        .login(LoginRequest {
            username: "unknown".to_string(),
            password: "poney".to_string(),
        })
        .await;

    assert!(res.is_err());
}

#[tokio::test]
async fn logout_success_for_valid_data() {
    let app = spawn_app().await;

    let mut client = UserServiceClient::connect(app.address).await.unwrap();

    let username = "zola".to_string();
    let password = "poney".to_string();

    let req = SignUpRequest {
        username: username.clone(),
        password: password.clone(),
    };

    let res = client.sign_up(req).await.unwrap();

    let _ = client
        .logout(api::proto::LogoutRequest {
            session_token: res.into_inner().session_token,
        })
        .await
        .unwrap();

    let saved = sqlx::query!("SELECT sessions.id FROM sessions JOIN users ON users.id = sessions.user_id WHERE users.username = $1", username)
        .fetch_optional(&app.db_pool)
        .await.unwrap();

    assert!(saved.is_none());
}

#[tokio::test]
async fn logout_fails_for_invalid_session_token() {
    let app = spawn_app().await;

    let mut client = UserServiceClient::connect(app.address).await.unwrap();

    let res = client
        .logout(api::proto::LogoutRequest {
            session_token: "invalid".to_string(),
        })
        .await;

    assert!(res.is_err());
}

fn decode_token_without_validation(
    token: &str,
) -> Result<SessionToken, Box<dyn std::error::Error>> {
    let key = DecodingKey::from_secret(&[]);
    let mut validation = Validation::new(Algorithm::HS256);
    validation.insecure_disable_signature_validation();

    let data = decode(&token, &key, &validation)?;
    Ok(data.claims)
}
