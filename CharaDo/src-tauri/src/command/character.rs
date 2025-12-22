use tauri::State;
use crate::state::AppState;
use crate::entities::character::Character;
use crate::error::UserError;

/**
 * 全てのキャラクターを取得
 */
#[tauri::command]
pub fn get_all_characters(state: State<AppState>) -> Result<Vec<Character>, UserError> {

  match state.character_repo.read() {
		Ok(repo) => return Ok(repo.get_all().clone()),
		Err(e) => return Err(e.into()),
	}
}

/**
 * キャラクターを取得
 */
#[tauri::command]
pub fn get_character(state: State<AppState>, id: u32) -> Option<Character> {

	match state.character_repo.read() {
		Ok(repo) => repo.get(id).cloned(),
		Err(_) => return None,
	}
}

/**
 * キャラクターを追加
 */
#[tauri::command]
pub fn add_character(state: State<AppState>, character: Character) -> Result<u32, UserError> {

	match state.character_repo.write() {
		Ok(mut repo) => {
			// TODO: アドオンを購入していた場合のみ追加可能
			// if (ストア情報) {
			// 	return Err(UserError::StoreError("アドオンを購入していた場合のみ追加可能".to_string()));
			// }

			// 空の名前は受け付けない
			if character.is_name_empty() {
				return Err(UserError::ValidationError("Name is empty".to_string()));
			}
			let id = repo.add(character)?;
			Ok(id)
		},
		Err(e) => Err(e.into()),
	}
}

/**
 * キャラクターを削除
 */
#[tauri::command]
pub fn delete_character(state: State<AppState>, id: u32) -> Result<(), UserError> {

	match state.character_repo.write() {
		Ok(mut repo) => repo.remove(id),
		Err(e) => Err(e.into()),
	}
}

/**
 * キャラクターを更新
 */
#[tauri::command]
pub fn update_character(state: State<AppState>, character: Character) -> Result<(), UserError> {
	match state.character_repo.write() {
		Ok(mut repo) => repo.update(character),
		Err(e) => Err(e.into()),
	}
}






