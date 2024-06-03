use jsonwebtoken::{encode, DecodingKey, EncodingKey, Header};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SessionToken {
    pub session_id: i32,
}

impl SessionToken {
    pub fn encode(&self, encode_key: &str) -> Result<String, String> {
        let token = encode(
            &Header::default(),
            &self,
            &EncodingKey::from_secret(encode_key.as_ref()),
        )
        .map_err(|_| "Failed to generate token")?;

        Ok(token)
    }

    pub fn decode(token: &str, encode_key: &str) -> Result<Self, String> {
        let token_data = jsonwebtoken::decode::<Self>(
            token,
            &DecodingKey::from_secret(encode_key.as_ref()),
            &jsonwebtoken::Validation::default(),
        )
        .map_err(|_| "Failed to decode token")?;

        Ok(token_data.claims)
    }
}
