use crate::datas::preset_setting::get_default_setting;
use crate::entities::user::*;
use crate::error::UserError;
use crate::state::AppState;
use tauri::State;

/**
 * ユーザー設定を取得
 */
pub fn get_user_config(state: State<AppState>) -> Result<User, UserError> {
  {
    // 情報整合性確保
    let mut repo = state.user_repo.write()?;

    // ユーザ設定取得
    let user = match repo.get(0) {
      Some(user) => user.clone(),
      None => {
        // ユーザ設定が存在しない場合、破損と見なしデフォルト設定保存
        let default_user_setting = get_default_setting();
        // デフォルト設定保存
        repo.replace(vec![default_user_setting.clone()])?;
        default_user_setting
      }
    };

    Ok(user)
  }
}

/**
 * 使用中キャラクターIDを設定
 */
pub fn set_using_character_id(state: State<AppState>, character_id: u32) -> Result<(), UserError> {
  {
    // 情報整合性確保
    let mut repo = state.user_repo.write()?;

    match repo.get(0) {
      Some(user) => {
        let mut user = user.clone();
        user.set_current_character_id(character_id);
        repo.update(user)?;
      }
      None => {
        // ユーザ設定が存在しない場合、破損と見なしデフォルト設定にキャラクターID追加
        let mut default_user_setting = get_default_setting();
        default_user_setting.set_current_character_id(character_id);
        // デフォルト設定保存
        repo.replace(vec![default_user_setting])?;
      }
    }

    Ok(())
  }
}

/**
 * 言語を設定
 */
pub fn set_user_language(state: State<AppState>, language: Language) -> Result<(), UserError> {
  // 情報整合性確保
  let mut repo = state.user_repo.write()?;

  match repo.get(0) {
    Some(user) => {
      let mut user = user.clone();
      user.set_language(language);
      repo.update(user)?;
    }
    None => {
      // ユーザ設定が存在しない場合、破損と見なしデフォルト設定に言語追加
      let mut default_user_setting = get_default_setting();
      default_user_setting.set_language(language);
      // デフォルト設定保存
      repo.replace(vec![default_user_setting])?;
    }
  }

  Ok(())
}
