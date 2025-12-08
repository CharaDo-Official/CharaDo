use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StoreAddOn {
    pub id: String,
    pub title: String,
    pub is_owned: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StoreAppInfo {
    pub id: String,
    pub title: String,
    pub add_ons: Vec<StoreAddOn>,
}