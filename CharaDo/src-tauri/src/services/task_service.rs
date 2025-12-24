use crate::entities::task::Task;
use crate::error::UserError;
use crate::state::AppState;
use tauri::State;

/**
 * 全てのタスクを取得
 */
pub fn get_all_tasks(state: State<AppState>) -> Result<Vec<Task>, UserError> {
  match state.task_repo.read() {
    Ok(repo) => Ok(repo.get_all().clone()),
    Err(e) => Err(e.into()),
  }
}

/**
 * タスクを取得
 */
pub fn get_task(state: State<AppState>, id: u32) -> Result<Option<Task>, UserError> {
  match state.task_repo.read() {
    Ok(repo) => Ok(repo.get(id).cloned()),
    Err(e) => Err(e.into()),
  }
}

/**
 * タスクを追加
 */
pub fn add_task(state: State<AppState>, task: Task) -> Result<u32, UserError> {
  match state.task_repo.write() {
    Ok(mut repo) => {
      // 空のタイトルは受け付けない
      if task.is_title_empty() {
        return Err(UserError::ValidationError("Title is empty".to_string()));
      }
      repo.add(task)
    }
    Err(e) => Err(e.into()),
  }
}

/**
 * タスクを削除
 */
pub fn delete_task(state: State<AppState>, id: u32) -> Result<(), UserError> {
  match state.task_repo.write() {
    Ok(mut repo) => repo.remove(id),
    Err(e) => Err(e.into()),
  }
}

/**
 * タスクを更新
 */
pub fn update_task(state: State<AppState>, task: Task) -> Result<(), UserError> {
  match state.task_repo.write() {
    Ok(mut repo) => repo.update(task),
    Err(e) => Err(e.into()),
  }
}
