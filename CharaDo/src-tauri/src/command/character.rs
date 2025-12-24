use crate::entities::character::Character;
use crate::error::UserError;
use crate::services::character_service;
use crate::state::AppState;
use tauri::State;

/**
 * 全てのキャラクターを取得
 */
#[tauri::command]
pub fn get_all_characters(state: State<AppState>) -> Result<Vec<Character>, UserError> {
  character_service::get_all_characters(state)
}

/**
 * キャラクターを取得
 * is_standard: true アプリ標準キャラクターを取得
 * is_standard: false ユーザー作成キャラクターを取得
 */
#[tauri::command]
pub fn get_character(state: State<AppState>, id: u32, is_standard: bool) -> Option<Character> {
  character_service::get_character(state, id, is_standard)
}

/**
 * キャラクターを追加
 */
#[tauri::command]
pub fn add_character(state: State<AppState>, character: Character) -> Result<u32, UserError> {
  character_service::add_character(state, character)
}

/**
 * キャラクターを削除
 */
#[tauri::command]
pub fn delete_character(state: State<AppState>, id: u32) -> Result<(), UserError> {
  character_service::delete_character(state, id)
}

/**
 * キャラクターを更新
 */
#[tauri::command]
pub fn update_character(state: State<AppState>, character: Character) -> Result<(), UserError> {
  character_service::update_character(state, character)
}
