use crate::datas::preset_setting::get_default_setting;
use crate::entities::user::*;
use crate::error::UserError;
use crate::state::AppState;
use tauri::State;
use crate::repository::json_repository::JsonRepository;
use crate::services::character_service::get_character;

/// ヘルパー: ユーザー設定を取得し、存在しない場合はデフォルト設定で初期化する
fn get_or_initialize_user(repo: &mut JsonRepository<User>,) -> Result<User, UserError> {
  if let Some(user) = repo.get(0) {
    return Ok(user.clone());
  } else {
		let default_user_setting = get_default_setting();
		repo.replace(vec![default_user_setting.clone()])?;
		Ok(default_user_setting)
	}
}

/**
 * ユーザー設定を取得
 */
pub fn get_user_config(state: State<AppState>) -> Result<User, UserError> {
  let mut repo = state.user_repo.write()?;
  get_or_initialize_user(&mut repo)
}

/**
 * 使用中キャラクターIDを設定
 */
pub fn set_using_character_id(state: State<AppState>, character_id: u32, is_standard: bool) -> Result<(), UserError> {
	// 存在しないキャラクターIDを弾く
	if let None = get_character(state.clone(), character_id, is_standard) {
		return Err(UserError::NotFoundError("存在しないキャラクターIDです".to_string()));
	}
	
  let mut repo = state.user_repo.write()?;
  let mut user = get_or_initialize_user(&mut repo)?;

  user.set_current_character_id(character_id);
  repo.update(user)?;

  Ok(())
}

/**
 * 言語を設定
 */
pub fn set_user_language(state: State<AppState>, language: Language) -> Result<(), UserError> {
  let mut repo = state.user_repo.write()?;
  let mut user = get_or_initialize_user(&mut repo)?;

  user.set_language(language);
  repo.update(user)?;

  Ok(())
}
