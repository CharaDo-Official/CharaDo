use serde::{Deserialize, Serialize};

use crate::entities::HasId;
use ts_rs::TS;

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "user.ts")]
/// ユーザーを表す構造体
pub struct User {
  /// 管理番号、ユーザが複数人いる場合、拡張性要件より
  id: u32,
  /// 使用中キャラクターID
  current_character_id: u32,
	/// 言語
	language: Language,
}

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "user.ts")]
pub enum Language {
  #[serde(rename = "ja")]
  Japanese,

  #[serde(rename = "en")]
  English,

  #[serde(other)]
  Other,
}

impl User {
	pub fn new(id: u32, current_character_id: u32, language: Language) -> Self {
		Self {
			id,
			current_character_id,
			language,
		}
	}

	pub fn set_current_character_id(&mut self, current_character_id: u32) {
		self.current_character_id = current_character_id;
	}

	pub fn set_language(&mut self, language: Language) {
		self.language = language;
	}
}

impl HasId for User {
  fn get_id(&self) -> u32 {
    self.id
  }

  fn set_id(&mut self, id: u32) {
    self.id = id;
  }
}
