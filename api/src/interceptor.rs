use secrecy::ExposeSecret;
use sqlx::PgPool;
use tonic::codegen::http::{HeaderValue, Request};
use tonic::transport::Body;
use tonic::{async_trait, Status};
use tonic_middleware::RequestInterceptor;

use crate::{configuration::ApplicationSettings, domain::SessionToken};

#[derive(Clone)]
pub struct AuthInterceptor {
    pub config: ApplicationSettings,
    pub pg_pool: PgPool,
}

#[async_trait]
impl RequestInterceptor for AuthInterceptor {
    async fn intercept(&self, mut req: Request<Body>) -> Result<Request<Body>, Status> {
        match req.headers().get("authorization").map(|v| v.to_str()) {
            Some(Ok(token)) => {
                let token = token.replace("Bearer ", "");
                let session_token =
                    SessionToken::decode(&token, self.config.jwt_secret.expose_secret())
                        .map_err(|_| Status::unauthenticated("Invalid token"))?;

                let session = sqlx::query!(
                    "SELECT * FROM sessions WHERE id = $1",
                    session_token.session_id
                )
                .fetch_one(&self.pg_pool)
                .await
                .map_err(|_| Status::unauthenticated("Invalid session"))?;

                if session.expires_at < chrono::Utc::now() {
                    return Err(Status::unauthenticated("Session expired"));
                }

                let user_id_header_value = HeaderValue::from_str(&session.user_id.to_string())
                    .map_err(|_e| Status::internal("Failed to convert user_id to header value"))?;
                req.headers_mut().insert("user_id", user_id_header_value);

                Ok(req)
            }
            _ => Err(Status::unauthenticated("Missing authorization header")),
        }
    }
}
