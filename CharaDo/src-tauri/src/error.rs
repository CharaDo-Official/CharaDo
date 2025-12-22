use std::io;
use std::sync::PoisonError;
use std::sync::RwLockReadGuard;
use std::sync::RwLockWriteGuard;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum UserError {
	/// JSONパースエラー
  #[error("JSON parse error: {0}")]
  ParseError(serde_json::Error),
	/// バリデーションエラー
  #[error("Validation error: {0}")]
  ValidationError(String),
	/// ファイル操作エラー
  #[error("I/O error: {0}")]
  IoError(io::Error),
	/// データが見つからないエラー
  #[error("Data not found: {0}")]
  NotFoundError(String),
	/// RwLockのPoisonエラー
  #[error("PoisonError: {0}")]
  PoisonError(io::Error),
	/// ストアエラー
  #[error("Store error: {0}")]
  StoreError(String),
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

// PoisonErrorからUserErrorへの変換を実装 Read
impl<T> From<PoisonError<RwLockReadGuard<'_, T>>> for UserError {
  fn from(err: PoisonError<RwLockReadGuard<'_, T>>) -> Self {
    UserError::PoisonError(io::Error::new(
      io::ErrorKind::Other,
      format!("lock poisoned: {:?}", err),
    ))
  }
}

// PoisonErrorからUserErrorへの変換を実装 Write
impl<T> From<PoisonError<RwLockWriteGuard<'_, T>>> for UserError {
  fn from(err: PoisonError<RwLockWriteGuard<'_, T>>) -> Self {
    UserError::PoisonError(io::Error::new(
      io::ErrorKind::Other,
      format!("lock poisoned: {:?}", err),
    ))
  }
}

// UserErrorをシリアライズ可能にする実装(invokeで返すため)
impl serde::Serialize for UserError {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}
