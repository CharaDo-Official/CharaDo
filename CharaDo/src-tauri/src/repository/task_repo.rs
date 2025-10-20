use crate::entities::task::Task;
use crate::error::UserError;
use serde::{Deserialize, Serialize};
use log::{info, warn};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug)]
pub struct TaskRepository {
  path: PathBuf,
  tasks: Vec<Task>,
}

impl TaskRepository {
	/// 指定されたパスに接続
  pub fn connect(path: &PathBuf) -> Result<Self, UserError> {
    // ファイルが存在する場合は読み込む
    if path.exists() {
      let content = fs::read_to_string(&path)?;
      match serde_json::from_str::<TaskRepository>(&content) {
        Ok(existing_repo) => return Ok(existing_repo),
        Err(e) => {
          warn!("JSONの読み込みに失敗しました: {e}");
          // → 壊れている場合はバックアップを取るのも手
          let backup_path = path.with_extension("bak.json");
          fs::rename(&path, &backup_path)?;
          info!("既存ファイルをバックアップしました: {:?}", backup_path);
        }
      }
    }

    // ファイルが存在しないか、読み込み/パースに失敗した場合は新規作成
    Self::initialize(&path)
  }

	/// 新規作成
	pub fn initialize(path: &PathBuf) -> Result<Self, UserError> {
		info!("新規タスクリポジトリを作成します: {:?}", path);
		// ディレクトリが存在しない場合
		if let Some(parent) = path.parent() {
			if !parent.exists() {
				fs::create_dir_all(parent)?;
				info!("保存ディレクトリを作成しました: {:?}", parent);
			}
		}
		// 初期データ
		let repo = TaskRepository {
			path: path.clone(),
			tasks: Vec::new(),
		};
		// 保存
		let json = serde_json::to_string_pretty(&repo)?;
		fs::write(&repo.path, json)?;

		Ok(repo)
	}

	/// タスクを追加して保存
	pub fn add_task(&mut self, task: Task) -> Result<(), UserError> {
		self.tasks.push(task);
		self.save()
	}

	/// タスク全権取得
	pub fn get_all_tasks(&self) -> &Vec<Task> {
		&self.tasks
	}

	/// タスク取得
	pub fn get_task_by_id(&self, id: u32) -> Option<&Task> {
		self.tasks.iter().find(|task: &&Task| task.get_id() == id)
	}

	/// タスクを削除
	pub fn remove_task(&mut self, id: u32) -> Result<(), UserError> {
		if let Some(pos) = self.tasks.iter().position(|task| task.get_id() == id) {
			self.tasks.remove(pos);
			self.save()
		} else {
			Err(UserError::NotFoundError(format!("削除対象タスクが見つかりませんでした: id {}", id)))
		}
	}

	/// タスク更新
	pub fn update_task(&mut self, updated_task: Task) -> Result<(), UserError> {
		if let Some(pos) = self.tasks.iter().position(|task| task.get_id() == updated_task.get_id()) {
			self.tasks[pos] = updated_task;
			self.save()
		} else {
			Err(UserError::NotFoundError(format!("更新対象タスクが見つかりませんでした: id {}", updated_task.get_id())))
		}
	}

	/// 次の利用可能なタスクIDを取得
	/// 登録順に並んでいるものとし、末尾タスクID + 1 を返す
	pub fn get_next_task_id(&self) -> u32 {
		match self.tasks.last() {
			Some(last_task) => last_task.get_id() + 1,
			None => 1,
		}
	}

	/// 保存
	fn save(&self) -> Result<(), UserError> {
		let json = serde_json::to_string_pretty(&self)?;
		fs::write(&self.path, json)?;
		Ok(())
	}
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn it_works() {
    let path = PathBuf::from("test_tasks.json");
    let repo = TaskRepository::connect(&path);
    assert!(repo.is_ok());
  }
}
