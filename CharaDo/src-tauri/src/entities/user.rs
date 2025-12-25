use serde::{Deserialize, Serialize};

use crate::entities::HasId;
use ts_rs::TS;

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "user.ts")]
/// ユーザーを表す構造体
pub struct User {
  /// ユーザーID
  id: u32,
  /// 使用中キャラクターID
  current_character_id: u32,
}

// impl User {
// 	const DEFAULT_CHARACTER_ID: u32 = 0;
// }

impl HasId for User {
  fn get_id(&self) -> u32 {
    self.id
  }

  fn set_id(&mut self, id: u32) {
    self.id = id;
  }
}
