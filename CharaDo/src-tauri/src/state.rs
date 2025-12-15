use crate::entities::{character::Character, task::Task, user::User};
use crate::repository::json_repository::JsonRepository;
use std::sync::RwLock;

pub struct AppState {
  pub task_repo: RwLock<JsonRepository<Task>>,
  pub character_repo: RwLock<JsonRepository<Character>>,
  pub user_repo: RwLock<JsonRepository<User>>,
}

impl AppState {
  pub fn new() -> Self {
    AppState {
      task_repo: RwLock::new(
        JsonRepository::connect(&crate::config::task_repository_file())
          .expect("タスクリポジトリの初期化に失敗しました"),
      ),
      character_repo: RwLock::new(
        JsonRepository::connect(&crate::config::character_repository_file())
          .expect("キャラクタリポジトリの初期化に失敗しました"),
      ),
      user_repo: RwLock::new(
        JsonRepository::connect(&crate::config::user_config_file())
          .expect("ユーザリポジトリの初期化に失敗しました"),
      ),
    }
  }
}
