pub mod configuration;
pub mod domain;
pub mod services;

pub mod proto {
    tonic::include_proto!("user");
}
