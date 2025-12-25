use crate::entities::task::Task;
use crate::error::UserError;
use crate::services::task_service;
use crate::state::AppState;
use tauri::State;

/**
 * 全てのタスクを取得
 */
#[tauri::command]
pub fn get_all_tasks(state: State<AppState>) -> Result<Vec<Task>, UserError> {
  task_service::get_all_tasks(state)
}

/**
 * タスクを取得
 */
#[tauri::command]
pub fn get_task(state: State<AppState>, id: u32) -> Result<Option<Task>, UserError> {
  task_service::get_task(state, id)
}

/**
 * タスクを追加
 */
#[tauri::command]
pub fn add_task(state: State<AppState>, task: Task) -> Result<u32, UserError> {
  task_service::add_task(state, task)
}

/**
 * タスクを削除
 */
#[tauri::command]
pub fn delete_task(state: State<AppState>, id: u32) -> Result<(), UserError> {
  task_service::delete_task(state, id)
}

/**
 * タスクを更新
 */
#[tauri::command]
pub fn update_task(state: State<AppState>, task: Task) -> Result<(), UserError> {
  task_service::update_task(state, task)
}
