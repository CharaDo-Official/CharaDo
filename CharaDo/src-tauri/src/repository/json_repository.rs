use std::fs;
use crate::entities::record::Record;
use crate::error::AppError;

pub fn load_from_file(path: &str) -> Result<Vec<Record>, AppError> {
	let data = fs::read_to_string(path).map_err(AppError::Io)?;
	let records: Vec<Record> = serde_json::from_str(&data).map_err(AppError::Parse)?;
	Ok(records)
}

pub fn save_to_file(path: &str, records: &Vec<Record>) -> Result<(), AppError> {
	let json = serde_json::to_string_pretty(records).map_err(AppError::Serialize)?;
	fs::write(path, json).map_err(AppError::Io)?;
	Ok(())
}