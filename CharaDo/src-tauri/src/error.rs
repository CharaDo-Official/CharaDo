use std::io;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum UserError {
  #[error("JSON parse error: {0}")]
  ParseError(serde_json::Error), // JSONパースエラー
  #[error("Validation error: {0}")]
  ValidationError(String), // バリデーションエラー
  #[error("Database error: {0}")]
  DatabaseError(String), // DB操作エラー
  #[error("I/O error: {0}")]
  IoError(io::Error), // ファイル操作エラー
	#[error("Data not found: {0}")]
	NotFoundError(String), // データが見つからないエラー
}

// エラー体系に参加させるために std::error::Error を実装 [derive(Error)] で自動実装
// impl std::error::Error for UserError {}

// serde_json::ErrorからUserErrorへの変換を実装
impl From<serde_json::Error> for UserError {
  fn from(err: serde_json::Error) -> UserError {
    UserError::ParseError(err)
  }
}

// io::ErrorからUserErrorへの変換を実装
impl From<io::Error> for UserError {
  fn from(err: io::Error) -> UserError {
    UserError::IoError(err)
  }
}
