use crate::entities::record::Record;
use crate::repository::json_repository;

pub fn load_records(path: &str) -> Result<Vec<Record>, String> {
	json_repository::load_from_file(path).map_err(|e| e.to_string())
}

pub fn save_records(path: &str, records: &Vec<Record>) -> Result<(), String> {
	json_repository::save_to_file(path, records).map_err(|e| e.to_string())
}
