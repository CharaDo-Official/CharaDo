use tauri::State;
use crate::state::AppState;
use crate::entities::character::Character;
use crate::error::UserError;

#[tauri::command]
pub fn get_all_characters(state: State<AppState>) -> Result<Vec<Character>, UserError> {

  match state.character_repo.read() {
		Ok(repo) => return Ok(repo.get_all().clone()),
		Err(e) => return Err(e.into()),
	}
}

#[tauri::command]
pub fn get_character(state: State<AppState>, id: u32) -> Option<Character> {

	match state.character_repo.read() {
		Ok(repo) => repo.get(id).cloned(),
		Err(_) => return None,
	}
}

#[tauri::command]
pub fn add_character(state: State<AppState>, character: Character) -> Result<u32, UserError> {

	match state.character_repo.write() {
		Ok(mut repo) => {
			if character.is_name_empty() {
				return Err(UserError::ValidationError("Name is empty".to_string()));
			}
			let id = repo.add(character)?;
			Ok(id)
		},
		Err(e) => Err(e.into()),
	}
}
#[tauri::command]
pub fn delete_character(state: State<AppState>, id: u32) -> Result<(), UserError> {

	match state.character_repo.write() {
		Ok(mut repo) => repo.remove(id),
		Err(e) => Err(e.into()),
	}
}

#[tauri::command]
pub fn update_character(state: State<AppState>, character: Character) -> Result<(), UserError> {
	match state.character_repo.write() {
		Ok(mut repo) => repo.update(character),
		Err(e) => Err(e.into()),
	}
}






