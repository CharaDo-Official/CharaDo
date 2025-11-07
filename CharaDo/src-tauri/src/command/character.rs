
use crate::entities::character::Character;
use crate::error::UserError;
use crate::repository::json_repository::JsonRepository;
use crate::config;

#[tauri::command]
pub fn get_all_characters() -> Result<Vec<Character>, UserError> {

  match JsonRepository::connect(&config::character_repository_file()) {
		Ok(repo) => return Ok(repo.get_all().clone()),
		Err(e) => return Err(e),
	}
}

#[tauri::command]
pub fn add_character(character: Character) -> Result<u32, UserError> {

	let mut character_repo: JsonRepository<Character> = JsonRepository::connect(&config::character_repository_file())?;
	character_repo.add(character)
}

#[tauri::command]
pub fn delete_character(id: u32) -> Result<(), UserError> {

	let mut character_repo: JsonRepository<Character> = JsonRepository::connect(&config::character_repository_file())?;
	character_repo.remove(id)
}

#[tauri::command]
pub fn update_character(character: Character) -> Result<(), UserError> {

	let mut character_repo: JsonRepository<Character> = JsonRepository::connect(&config::character_repository_file())?;
	character_repo.update(character)
}
#[tauri::command]
pub fn update_characters(characters: Vec<Character>) -> Result<(), UserError> {

	let mut character_repo: JsonRepository<Character> = JsonRepository::connect(&config::character_repository_file())?;
	for character in characters {
		character_repo.update(character)?;
	}
	Ok(())
}


#[tauri::command]
pub fn get_character(id: u32) -> Option<Character> {

	match JsonRepository::connect(&config::character_repository_file()) {
		Ok(repo) => repo.get(id).cloned(),
		Err(_) => return None,
	}
}






