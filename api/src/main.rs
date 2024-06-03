use std::sync::Arc;

use api::{
    configuration::{get_configuration, DatabaseSettings},
    proto::user_service_server::UserServiceServer,
    services::UserService,
};
use sqlx::{postgres::PgPoolOptions, PgPool};
use tonic::transport::Server;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let configuration = get_configuration().expect("Failed to read configuration.");

    let db_pool = get_connection_pool(&configuration.database);
    let connection = Arc::new(db_pool);

    let address = format!(
        "{}:{}",
        configuration.application.host, configuration.application.port
    );

    let user_service = UserService::new(connection.clone(), configuration.application);

    Server::builder()
        .add_service(UserServiceServer::new(user_service))
        .serve(address.parse().unwrap())
        .await?;

    Ok(())
}
pub fn get_connection_pool(configuration: &DatabaseSettings) -> PgPool {
    PgPoolOptions::new().connect_lazy_with(configuration.with_db())
}
