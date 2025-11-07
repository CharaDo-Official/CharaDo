use crate::entities::HasId;
use crate::entities::user::User;
use crate::error::UserError;
use crate::repository::json_repository::JsonRepository;
use crate::config;

#[tauri::command]
pub fn get_user_config() -> Result<User, UserError> {
	let repo: JsonRepository<User> = JsonRepository::connect(&config::user_config_file())?;
	
	match repo.get_all().get(0) {
		Some(first) => Ok(first.clone()),
		None => Err(UserError::NotFoundError("User not found".to_string())),
	}
}

#[tauri::command]
pub fn get_using_character_id() -> Result<u32, UserError> {
	let repo: JsonRepository<User> = JsonRepository::connect(&config::user_config_file())?;
	
	match repo.get_all().get(0) {
		Some(first) => Ok(first.get_id()),
		None => Err(UserError::NotFoundError("User not found".to_string())),
	}
}

#[tauri::command]
pub fn set_using_character_id(character_id: u32) -> Result<(), UserError> {
	let mut user_repo: JsonRepository<User> = JsonRepository::connect(&config::user_config_file())?;
	
	let mut user = match user_repo.get_all().get(0) {
		Some(first) => first.clone(),
		None => return Err(UserError::NotFoundError("User not found".to_string())),
	};

	user.set_id(character_id);
	user_repo.update(user)
}
