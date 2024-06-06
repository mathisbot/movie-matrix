pub mod configuration;
pub mod domain;
pub mod interceptor;
pub mod recommander;
pub mod services;
pub mod startup;
pub mod tasks;

pub mod proto {
    tonic::include_proto!("user");
    tonic::include_proto!("movie");
}
