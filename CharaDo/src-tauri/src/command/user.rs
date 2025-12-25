use crate::entities::user::*;
use crate::error::UserError;
use crate::state::AppState;
use tauri::State;
use crate::services::user_service;


#[tauri::command]
pub fn get_user_config(state: State<AppState>) -> Result<User, UserError> {
  user_service::get_user_config(state)
}

#[tauri::command]
pub fn set_using_character_id(state: State<AppState>, character_id: u32, is_standard: bool) -> Result<(), UserError> {
  user_service::set_using_character_id(state, character_id, is_standard)
}

#[tauri::command]
pub fn set_user_language(state: State<AppState>, language: Language) -> Result<(), UserError> {
  user_service::set_user_language(state, language)
}
