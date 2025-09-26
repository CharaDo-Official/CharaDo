// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tauri::Builder;

// fn main() {
// 	// コマンド登録
// 	Builder::default()
// 			.invoke_handler(tauri::generate_handler![
// 					file::save_data,
// 					file::load_data
// 			])
// 			.run(tauri::generate_context!())
// 			.expect("error while running tauri application");
// }


fn main() {
    min_app_lib::run()
}
