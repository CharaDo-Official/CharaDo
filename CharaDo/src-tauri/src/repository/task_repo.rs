use crate::entities::task::Task;
use crate::error::UserError;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug)]
pub struct TaskRepository {
    path: PathBuf,
    total_tasks: u32,
    tasks: Vec<Task>,
}

impl TaskRepository {
    pub fn connect(path: PathBuf) -> Result<Self, UserError> {
        // ファイルが存在する場合は読み込む
        if path.exists() {
            let content = fs::read_to_string(&path)?;
            match serde_json::from_str::<TaskRepository>(&content) {
                Ok(existing_repo) => return Ok(existing_repo),
                Err(e) => {
                    eprintln!("JSONの読み込みに失敗しました: {e}");
                    // → 壊れている場合はバックアップを取るのも手
                    let backup_path = path.with_extension("bak.json");
                    fs::rename(&path, &backup_path)?;
                    eprintln!("既存ファイルをバックアップしました: {:?}", backup_path);
                }
            }
        }

        // ファイルが存在しないか、読み込み/パースに失敗した場合は新規作成
        let repo = TaskRepository {
            path,
            total_tasks: 0,
            tasks: Vec::new(),
        };
        let json = serde_json::to_string_pretty(&repo)?;
        fs::write(&repo.path, json)?;

        Ok(repo)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let path = PathBuf::from("test_tasks.json");
        let repo = TaskRepository::connect(path);
        assert!(repo.is_ok());
    }
}
