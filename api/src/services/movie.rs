use sqlx::PgPool;

use crate::configuration::ApplicationSettings;
use crate::proto::movie_service_server::MovieService as MovieTrait;

pub struct MovieService {
    configuration: ApplicationSettings,
    connection: PgPool,
}

impl MovieService {
    pub fn new(connection: PgPool, configuration: ApplicationSettings) -> Self {
        Self {
            connection,
            configuration,
        }
    }
}

//#[tonic::async_trait]
//impl MovieTrait for MovieService {}
