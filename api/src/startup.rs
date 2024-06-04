use sqlx::{postgres::PgPoolOptions, PgPool};
use tokio::net::TcpListener;
use tonic::transport::{
    server::{Router, TcpIncoming},
    Error, Server,
};

use crate::{
    configuration::{DatabaseSettings, Settings},
    proto::movie_service_server::MovieServiceServer,
    proto::user_service_server::UserServiceServer,
    services::{MovieService, UserService},
};

pub struct Application {
    pub port: u16,
    server: Router,
    tcp_incoming: TcpIncoming,
}

impl Application {
    pub async fn build(configuration: Settings) -> Result<Self, Box<dyn std::error::Error>> {
        let connection = get_connection_pool(&configuration.database);

        let address = format!(
            "{}:{}",
            configuration.application.host, configuration.application.port
        );

        let user_service = UserService::new(connection.clone(), configuration.application.clone());
        let movie_service = MovieService::new(connection.clone(), configuration.clone());

        let listener = TcpListener::bind(address).await?;

        let assigned_port = listener.local_addr().unwrap().port();

        let incoming = TcpIncoming::from_listener(listener, true, None).unwrap();

        let server = Server::builder()
            .add_service(UserServiceServer::new(user_service))
            .add_service(MovieServiceServer::new(movie_service));

        Ok(Self {
            port: assigned_port,
            server: server,
            tcp_incoming: incoming,
        })
    }

    pub async fn run_until_stopped(self) -> Result<(), Error> {
        self.server.serve_with_incoming(self.tcp_incoming).await
    }
}

pub fn get_connection_pool(configuration: &DatabaseSettings) -> PgPool {
    PgPoolOptions::new().connect_lazy_with(configuration.with_db())
}
