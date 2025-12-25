use serde::Serialize;
use std::io;
use std::sync::PoisonError;
use std::sync::RwLockReadGuard;
use std::sync::RwLockWriteGuard;
use thiserror::Error;
use ts_rs::TS;

#[derive(Debug, Error, Serialize, TS)]
#[serde(tag = "type", content = "message")] // タグ付きユニオンにする
#[ts(export, export_to = "user_error.ts")] // TS出力設定
pub enum UserError {
  /// JSONパースエラー
  #[error("JSON parse error: {0}")]
  ParseError(
    #[serde(serialize_with = "serialize_error_message")]
    #[ts(type = "string")]
    serde_json::Error,
  ),
  /// バリデーションエラー
  #[error("Validation error: {0}")]
  ValidationError(String),
  /// ファイル操作エラー
  #[error("I/O error: {0}")]
  IoError(
    #[serde(serialize_with = "serialize_error_message")]
    #[ts(type = "string")]
    io::Error,
  ),
  /// データが見つからないエラー
  #[error("Not found error: {0}")]
  NotFoundError(String),
  /// RwLockのPoisonエラー
  #[error("PoisonError: {0}")]
  PoisonError(
    #[serde(serialize_with = "serialize_error_message")]
    #[ts(type = "string")]
    io::Error,
  ),
  /// ストアエラー
  #[error("Store error: {0}")]
  StoreError(String),
  /// WinRT API関連のエラー
  #[error("Windows API error: {0}")]
  WinApiError(String),
}

fn serialize_error_message<T, S>(_value: &T, serializer: S) -> Result<S::Ok, S::Error>
where
  S: serde::Serializer,
{
  // 種類を問わず、詳細を隠して汎用メッセージを返す
  serializer.serialize_str("Internal System Error")
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
