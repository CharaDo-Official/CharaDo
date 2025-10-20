// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


use tauri_plugin_log::{Builder as LogBuilder, Target, TargetKind};
use log::{trace, debug, info, warn, error};
use core::task;
use std::path::PathBuf;

mod entities;
mod error;
mod repository;

use repository::task_repo::TaskRepository;
use entities::task::Task;

fn lib_main() {
	// 保存ディレクトリ
	let mut path: PathBuf = dirs_next::data_local_dir().expect("AppLocalData ディレクトリが取得できませんでした");
	path.push("com.cfeel.charado");

	info!("lib_main");
	let mut task_repo = TaskRepository::connect(&(path.join("tasks.json"))).unwrap();

	// テスト用タスク追加
	let task = Task::create(task_repo.get_next_task_id(), "test2".to_string());
	task_repo.add_task(task).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

	tauri::Builder::default()
			// Loggerプラグインの初期化
			.plugin(LogBuilder::new()
			// .target(Target::new(TargetKind::Stdout)) // 何故か二重出力になる
			.target(Target::new(TargetKind::Webview))
			// .target(Target::new(TargetKind::LogDir { file_name: Some("logs".to_string()) }))	// わざわざやらなくても自動で出てた
			.build())
			.plugin(tauri_plugin_opener::init())
			.invoke_handler(tauri::generate_handler![greet])
			.setup(|_app| {
				lib_main();
				Ok(())
			})
			.run(tauri::generate_context!())
			.expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        lib_main();
        assert!(true);
    }
}

