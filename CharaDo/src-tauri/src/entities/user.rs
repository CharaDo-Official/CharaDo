use serde::{Deserialize, Serialize};
use sys_locale::get_locale;

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

impl Language {
  /**
   * ユーザーの言語を検出
   * @return ユーザーの言語
   */
  pub fn detect() -> Self {
    // OSのロケールを取得
    let locale = match get_locale() {
      Some(locale) => locale,
      // ロケールが取得できない場合は英語
      None => return Language::English,
    };

		// ロケールから言語を検出
    match locale.as_str() {
      l if l.starts_with("ja") => Language::Japanese,
      l if l.starts_with("en") => Language::English,
      _ => Language::Other,
    }
  }
}
