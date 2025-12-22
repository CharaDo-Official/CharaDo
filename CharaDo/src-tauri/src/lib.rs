use log::info;
use tauri_plugin_log::{Builder as LogBuilder, Target, TargetKind};
use obfstr::obfstr;

mod command;
mod config;
mod entities;
mod error;
mod repository;
mod state;

use command::character;
use command::task;
use command::user;
use state::AppState;

use command::store;

fn lib_main() {
	// コンパイル時の環境変数を取得 難読化もしておく
  info!("lib_main: ToDo: remove this log after development: ADDON_ID_DATA_EXPANSION={}", obfstr!(env!("ADDON_ID_DATA_EXPANSION")));
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    // Loggerプラグインの初期化
    .plugin(
      LogBuilder::new()
        .target(Target::new(TargetKind::Stdout)) // 何故か二重出力になる
        .target(Target::new(TargetKind::Webview))
        .target(Target::new(TargetKind::LogDir { file_name: Some("logs".to_string()) }))	// わざわざやらなくても自動で出てた
        .build(),
    )
    .plugin(tauri_plugin_opener::init())
    .manage(AppState::new())	// アプリケーション状態の管理
    .invoke_handler(tauri::generate_handler![
      task::get_all_tasks,
      task::add_task,
      task::update_task,
      task::delete_task,
      task::get_task,
      character::get_all_characters,
      character::add_character,
      character::delete_character,
      character::update_character,
      character::get_character,
      user::get_user_config,
      user::get_using_character_id,
      user::set_using_character_id,
      store::get_store_info,
    ])
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
