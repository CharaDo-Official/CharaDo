use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
	#[error("I/O error: {0}")]
	Io(std::io::Error),
	#[error("JSON parse error: {0}")]
	Parse(serde_json::Error),
	#[error("Serialization error: {0}")]
	Serialize(serde_json::Error),
}
