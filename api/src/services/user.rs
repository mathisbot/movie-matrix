use chrono::{Duration, Utc};
use secrecy::ExposeSecret;
use sqlx::PgPool;

use crate::{
    configuration::ApplicationSettings,
    domain::{HashedPassword, SessionToken},
    proto::{
        user_service_server::UserService as UserTrait, GetUserRequest, GetUserResponse,
        LoginRequest, LoginResponse, LogoutRequest, LogoutResponse, SignUpRequest, SignUpResponse,
    },
};

pub struct UserService {
    configuration: ApplicationSettings,
    connection: PgPool,
}

impl UserService {
    pub fn new(connection: PgPool, configuration: ApplicationSettings) -> Self {
        Self {
            connection,
            configuration,
        }
    }
    async fn create_session(&self, user_id: i32) -> Result<String, String> {
        let expires_at = Utc::now() + Duration::days(7);

        let record = sqlx::query!(
            r#"INSERT INTO sessions (user_id, expires_at) VALUES ($1, $2) RETURNING id"#,
            user_id,
            expires_at
        )
        .fetch_one(&self.connection)
        .await
        .map_err(|e| {
            println!("Error: {:?}", e);
            "Failed to insert session"
        })?;

        let token = SessionToken {
            session_id: record.id,
            exp: expires_at.timestamp(),
        };

        Ok(token.encode(self.configuration.jwt_secret.expose_secret())?)
    }
}

#[tonic::async_trait]
impl UserTrait for UserService {
    async fn sign_up(
        &self,
        request: tonic::Request<SignUpRequest>,
    ) -> Result<tonic::Response<SignUpResponse>, tonic::Status> {
        println!("Got a request: {:?}", request);

        let body: SignUpRequest = request.into_inner();

        let hashed_password = HashedPassword::hash(body.password).map_err(|e| {
            println!("Error: {:?}", e);
            tonic::Status::internal("Failed to hash password")
        })?;

        let record = sqlx::query!(
            r#"INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id"#,
            body.username,
            hashed_password.as_ref(),
        )
        .fetch_one(&self.connection)
        .await
        .map_err(|e| {
            println!("Error: {:?}", e);
            tonic::Status::internal("Failed to insert user")
        })?;

        let response = SignUpResponse {
            session_token: self.create_session(record.id).await.map_err(|e| {
                println!("Error: {:?}", e);
                tonic::Status::internal("Failed to create session")
            })?,
        };

        Ok(tonic::Response::new(response))
    }

    async fn login(
        &self,
        request: tonic::Request<LoginRequest>,
    ) -> Result<tonic::Response<LoginResponse>, tonic::Status> {
        println!("Got a request: {:?}", request);

        let body = request.into_inner();

        let record = sqlx::query!(
            r#"SELECT id, password FROM users WHERE username = $1"#,
            body.username,
        )
        .fetch_one(&self.connection)
        .await
        .map_err(|e| {
            println!("Error: {:?}", e);
            tonic::Status::internal("Failed to fetch user")
        })?;

        let hashed_password = HashedPassword::parse(record.password);

        if !hashed_password
            .verify(body.password)
            .map_err(|e| tonic::Status::internal(e))?
        {
            return Err(tonic::Status::unauthenticated("Invalid password"));
        }

        let response = LoginResponse {
            session_token: self.create_session(record.id).await.map_err(|e| {
                println!("Error: {:?}", e);
                tonic::Status::internal("Failed to create session")
            })?,
        };

        Ok(tonic::Response::new(response))
    }

    async fn logout(
        &self,
        request: tonic::Request<LogoutRequest>,
    ) -> Result<tonic::Response<LogoutResponse>, tonic::Status> {
        println!("Got a request: {:?}", request);

        let body = request.into_inner();

        let session_token = SessionToken::decode(
            &body.session_token,
            self.configuration.jwt_secret.expose_secret(),
        )
        .map_err(|e| {
            println!("Error: {:?}", e);
            tonic::Status::internal("Failed to decode token")
        })?;

        sqlx::query!(
            r#"DELETE FROM sessions WHERE id = $1"#,
            session_token.session_id
        )
        .execute(&self.connection)
        .await
        .map_err(|e| {
            println!("Error: {:?}", e);
            tonic::Status::internal("Failed to delete session")
        })?;

        Ok(tonic::Response::new(LogoutResponse {}))
    }

    async fn get_user(
        &self,
        request: tonic::Request<GetUserRequest>,
    ) -> Result<tonic::Response<GetUserResponse>, tonic::Status> {
        println!("Got a request: {:?}", request);

        let body = request.into_inner();

        let session_token = SessionToken::decode(
            &body.session_token,
            self.configuration.jwt_secret.expose_secret(),
        )
        .map_err(|e| {
            println!("Error: {:?}", e);
            tonic::Status::internal("Failed to decode token")
        })?;

        let record = sqlx::query!(
            r#"SELECT username FROM users JOIN sessions ON sessions.user_id = users.id WHERE sessions.id = $1"#,
            session_token.session_id
        ).fetch_one(&self.connection).await.map_err(|e| {
            println!("Error: {:?}", e);
            tonic::Status::internal("Failed to fetch user")
        })?;

        Ok(tonic::Response::new(GetUserResponse {
            username: record.username,
        }))
    }
}
