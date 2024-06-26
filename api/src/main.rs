use api::{
    configuration::{get_configuration, DatabaseSettings},
    startup::Application,
    tasks::fetch_movies,
};
use sqlx::{postgres::PgPoolOptions, PgPool};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let configuration = get_configuration().expect("Failed to read configuration.");

    // Seed the database
    fetch_movies(configuration.clone(), 200).await;

    let app = Application::build(configuration).await?;

    app.run_until_stopped()
        .await
        .expect("Failed to run application.");

    Ok(())
}
pub fn get_connection_pool(configuration: &DatabaseSettings) -> PgPool {
    PgPoolOptions::new().connect_lazy_with(configuration.with_db())
}
