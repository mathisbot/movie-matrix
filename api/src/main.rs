use proto::user_service_server::{UserService as UserTrait, UserServiceServer};
use tonic::transport::Server;

mod proto {
    tonic::include_proto!("user");
}

#[derive(Debug, Default)]
struct UserService {}

#[tonic::async_trait]
impl UserTrait for UserService {
    async fn sign_up(
        &self,
        request: tonic::Request<proto::SignUpRequest>,
    ) -> Result<tonic::Response<proto::SignUpResponse>, tonic::Status> {
        println!("Got a request: {:?}", request);

        let response = proto::SignUpResponse {
            session_token: "123456".to_string(),
        };

        Ok(tonic::Response::new(response))
    }

    async fn login(
        &self,
        request: tonic::Request<proto::LoginRequest>,
    ) -> Result<tonic::Response<proto::LoginResponse>, tonic::Status> {
        println!("Got a request: {:?}", request);

        let response = proto::LoginResponse {
            session_token: "123456".to_string(),
        };

        Ok(tonic::Response::new(response))
    }

    async fn logout(
        &self,
        request: tonic::Request<proto::LogoutRequest>,
    ) -> Result<tonic::Response<proto::LogoutResponse>, tonic::Status> {
        println!("Got a request: {:?}", request);

        let response = proto::LogoutResponse {};

        Ok(tonic::Response::new(response))
    }

    async fn check_session(
        &self,
        request: tonic::Request<proto::CheckSessionRequest>,
    ) -> Result<tonic::Response<proto::CheckSessionResponse>, tonic::Status> {
        println!("Got a request: {:?}", request);

        let response = proto::CheckSessionResponse {
            message: format!("Hello!"),
            username: "test".to_string(),
            success: true,
        };

        Ok(tonic::Response::new(response))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "127.0.0.1:4000".parse()?;

    let user_service = UserService::default();

    Server::builder()
        .accept_http1(true)
        .add_service(UserServiceServer::new(user_service))
        .serve(addr)
        .await?;

    Ok(())
}
