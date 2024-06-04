use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    tonic_build::compile_protos("../proto/user.proto")?;
    tonic_build::compile_protos("../proto/movie.proto")?;

    Ok(())
}
