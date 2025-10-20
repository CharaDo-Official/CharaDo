// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


use tauri_plugin_log::{Builder as LogBuilder, Target, TargetKind};
use log::{trace, debug, info, warn, error};

mod entities;
mod error;
mod repository;

use repository::task_repo::TaskRepository;

fn lib_main() {
	TaskRepository::connect(std::path::PathBuf::from("tasks.json")).unwrap();
	info!("greet called");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

	tauri::Builder::default()
			// Loggerプラグインの初期化
			.plugin(LogBuilder::new()
			// .target(Target::new(TargetKind::Stdout)) // 何故か二重出力になる
			.target(Target::new(TargetKind::Webview))
			.target(Target::new(TargetKind::LogDir { file_name: Some("logs".to_string()) }))
			.build())
			.plugin(tauri_plugin_opener::init())
			.invoke_handler(tauri::generate_handler![greet])
			.setup(|_app| {
				debug!("This is a debug message.");
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

