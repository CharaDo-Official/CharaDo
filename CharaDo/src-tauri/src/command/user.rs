use tauri::State;
use crate::state::{self, AppState};
use crate::entities::HasId;
use crate::entities::user::User;
use crate::error::UserError;

#[tauri::command]
pub fn get_user_config(state: State<AppState>) -> Result<User, UserError> {
	match state.user_repo.read() {
		Ok(repo) => match repo.get(0) {
			Some(first) => Ok(first.clone()),
			None => Err(UserError::NotFoundError("User not found".to_string())),
		},
		Err(e) => Err(e.into()),
	}
}

#[tauri::command]
pub fn get_using_character_id(state: State<AppState>) -> Result<u32, UserError> {	
	match state.user_repo.read() {
		Ok(repo) => match repo.get(0) {
			Some(first) => Ok(first.get_id()),
			None => Err(UserError::NotFoundError("User not found".to_string())),
		},
		Err(e) => Err(e.into()),
	}
}

#[tauri::command]
pub fn set_using_character_id(state: State<AppState>, character_id: u32) -> Result<(), UserError> {
	match state.user_repo.write() {
		Ok(mut repo) => {
			let mut user = match repo.get(0) {
				Some(first) => first.clone(),
				None => return Err(UserError::NotFoundError("User not found".to_string())),
			};
	
			user.set_id(character_id);
			repo.update(user)
		}
		Err(e) => Err(e.into()),
	}
}
