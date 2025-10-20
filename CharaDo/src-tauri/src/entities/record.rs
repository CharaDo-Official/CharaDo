use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Record {
    pub id: u32,
    pub term: String,
    pub meaning: String,
    pub tags: Vec<String>,
    pub importance: Option<u8>,
}
