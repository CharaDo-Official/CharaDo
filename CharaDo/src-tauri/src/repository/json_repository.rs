
use crate::error::UserError;
use serde::{de::DeserializeOwned, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use crate::entities::HasId;

use log::{info, warn};

/// 汎用 JSON リポジトリ
#[derive(Debug)]
pub struct JsonRepository<T>
where
  T: Serialize + DeserializeOwned,
{
  path: PathBuf,
  items: Vec<T>,
}

impl<T> JsonRepository<T>
where
  T: Serialize + DeserializeOwned + HasId + Clone,
{
	/// 指定リポジトリに接続
  /// path: 任意の Path 型を受け取れるようにする AsRef<Path>: Pathに変換可能なあらゆる型
  pub fn connect(path: impl AsRef<Path>) -> Result<Self, UserError> {
    let path = path.as_ref().to_path_buf();

    if path.exists() {
      let content = fs::read_to_string(&path)?;
      match serde_json::from_str::<Vec<T>>(&content) {
        Ok(items) => return Ok(JsonRepository { path, items }),
        Err(e) => {
          // 壊れている場合はバックアップして新規作成へ落とす
					warn!("JSONの読み込みに失敗しました: {e}");
          let backup = path.with_extension("bak.json");
          fs::rename(&path, &backup)?;
        }
      }
    }

    // 存在しない、または壊れていたため初期化
    Self::initialize(path)
  }

	/// 新規作成
  pub fn initialize(path: PathBuf) -> Result<Self, UserError> {
    if let Some(parent) = path.parent() {
      if !parent.exists() {
        info!("ディレクトリを作成します: {}", parent.display());
        fs::create_dir_all(parent)?;
      }
    }
    let repo = JsonRepository {
      path: path.clone(),
      items: Vec::new(),
    };
    repo.save()?; // 初期ファイルを書き出す
    Ok(repo)
  }

	/// 追加
  pub fn add(&mut self, mut entity: T) -> Result<u32, UserError> {
    let new_id = self.next_id();
    entity.set_id(new_id);
    self.items.push(entity);
    self.save()?;
    Ok(new_id)
  }

	/// 全件取得
  pub fn get_all(&self) -> &Vec<T> {
    &self.items
  }

	/// 取得
  pub fn get(&self, id: u32) -> Option<&T> {
    self.items.iter().find(|item| item.get_id() == id)
  }

	/// 削除
  pub fn remove(&mut self, id: u32) -> Result<(), UserError> {
    if let Some(pos) = self.items.iter().position(|item| item.get_id() == id) {
      self.items.remove(pos);
      self.save()?;
      Ok(())
    } else {
      warn!("id {} not found", id);
      Err(UserError::NotFoundError(format!("id {} not found", id)))
    }
  }

	/// 更新
  pub fn update(&mut self, updated: T) -> Result<(), UserError> {
    let id = updated.get_id();
    if let Some(pos) = self.items.iter().position(|item| item.get_id() == id) {
      self.items[pos] = updated;
      self.save()?;
      Ok(())
    } else {
			warn!("id {} not found", id);
      Err(UserError::NotFoundError(format!("id {} not found", id)))
    }
  }

	/// 次の利用可能なIDを取得
  pub fn next_id(&self) -> u32 {
		match self.items.last() {
			Some(last_item) => last_item.get_id() + 1,
			None => 1,
		}
  }

	/// 保存
  fn save(&self) -> Result<(), UserError> {
    let json = serde_json::to_string_pretty(&self.items)?;
    fs::write(&self.path, json)?;
    Ok(())
  }
}
