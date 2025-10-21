
use crate::entities::task::Task;
use crate::error::UserError;
use crate::repository::json_repository::JsonRepository;
use crate::config;

#[tauri::command]
pub fn get_all_tasks() -> Vec<Task> {

  let task_repo: JsonRepository<Task> = JsonRepository::connect(&config::task_repository_file()).unwrap();
  task_repo.get_all().clone()
}

#[tauri::command]
pub fn add_task_by_title(title: String) -> Result<u32, UserError> {

	let mut task_repo: JsonRepository<Task> = JsonRepository::connect(&config::task_repository_file()).unwrap();
	task_repo.add(Task::new(0, title))
}

#[tauri::command]
pub fn add_task(task: Task) -> Result<u32, UserError> {

	let mut task_repo: JsonRepository<Task> = JsonRepository::connect(&config::task_repository_file())?;
	task_repo.add(task)
}

#[tauri::command]
pub fn delete_task(id: u32) -> Result<(), UserError> {

	let mut task_repo: JsonRepository<Task> = JsonRepository::connect(&config::task_repository_file())?;
	task_repo.remove(id)
}

#[tauri::command]
pub fn update_task(task: Task) -> Result<(), UserError> {

	let mut task_repo: JsonRepository<Task> = JsonRepository::connect(&config::task_repository_file())?;
	task_repo.update(task)
}
#[tauri::command]
pub fn update_tasks(tasks: Vec<Task>) -> Result<(), UserError> {

	let mut task_repo: JsonRepository<Task> = JsonRepository::connect(&config::task_repository_file())?;
	for task in tasks {
		task_repo.update(task)?;
	}
	Ok(())
}


#[tauri::command]
pub fn get_task(id: u32) -> Option<Task> {

	match JsonRepository::connect(&config::task_repository_file()) {
		Ok(repo) => repo.get(id).cloned(),
		Err(_) => return None,
	}
}






