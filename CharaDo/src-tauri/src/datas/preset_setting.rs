use crate::entities::user::*;

/**
 * デフォルト設定を取得
 */
pub fn get_default_setting() -> User {
  User::new(0, 0, Language::detect())
}