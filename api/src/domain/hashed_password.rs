use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
    Argon2, PasswordHash, PasswordVerifier,
};

#[derive(Debug)]
pub struct HashedPassword(String);

impl HashedPassword {
    pub fn hash(password: String) -> Result<Self, String> {
        let salt = SaltString::generate(&mut OsRng);

        let argon2 = Argon2::default();

        let password_hash = argon2
            .hash_password(password.as_bytes(), &salt)
            .map_err(|e| e.to_string())?
            .to_string();

        Ok(HashedPassword(password_hash))
    }

    pub fn parse(hashed_password: String) -> Self {
        HashedPassword(hashed_password)
    }

    pub fn verify(&self, password: String) -> Result<bool, String> {
        let parsed_hash = PasswordHash::new(&self.0)
            .map_err(|e| e.to_string())
            .map_err(|e| e.to_string())?;

        Ok(Argon2::default()
            .verify_password(password.as_bytes(), &parsed_hash)
            .is_ok())
    }
}

impl AsRef<str> for HashedPassword {
    fn as_ref(&self) -> &str {
        &self.0
    }
}
