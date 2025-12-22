use tauri::State;
use crate::state::AppState;
use crate::entities::task::Task;
use crate::error::UserError;

#[tauri::command]
pub fn get_all_tasks(state: State<AppState>) -> Result<Vec<Task>, UserError> {

  match state.task_repo.read() {
		Ok(repo) => return Ok(repo.get_all().clone()),
		Err(e) => return Err(e.into()),
	}
}

#[tauri::command]
pub fn get_task(state: State<AppState>, id: u32) -> Option<Task> {

	match state.task_repo.read() {
		Ok(repo) => repo.get(id).cloned(),
		Err(_) => return None,
	}
}

#[tauri::command]
pub fn add_task(state: State<AppState>, task: Task) -> Result<u32, UserError> {

	match state.task_repo.write() {
		Ok(mut repo) => {
			if task.is_title_empty() {
				return Err(UserError::ValidationError("Title is empty".to_string()));
			}
			let id = repo.add(task)?;
			Ok(id)
		}
		Err(e) => Err(e.into()),
	}
}

#[tauri::command]
pub fn delete_task(state: State<AppState>, id: u32) -> Result<(), UserError> {

	match state.task_repo.write() {
		Ok(mut repo) => repo.remove(id),
		Err(e) => Err(e.into()),
	}
}

#[tauri::command]
pub fn update_task(state: State<AppState>, task: Task) -> Result<(), UserError> {

	match state.task_repo.write() {
		Ok(mut repo) => repo.update(task),
		Err(e) => Err(e.into()),
	}
}








