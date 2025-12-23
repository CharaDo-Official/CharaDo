use crate::entities::HasId;
use crate::error::UserError;
use chrono::Local;
use serde::{de::DeserializeOwned, Serialize};
use std::fs;
use std::io::{BufReader, BufWriter, Write};
use std::path::{Path, PathBuf};

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
  pub fn connect(path: &PathBuf) -> Result<Self, UserError> {
		// ファイルが存在しない場合は初期化
    if !path.exists() {
      return Self::initialize(path);
    }

    // ファイル読み込み
		let file = fs::File::open(path)?;
		let reader = BufReader::new(file);

    let content = match serde_json::from_reader(reader) {
      Ok(items) => items,
      Err(e) => {
        warn!("JSONの読み込みに失敗しました（構文エラー）: {e}");
        let _ = Self::backup_with_timestamp(&path);
        return Self::initialize(path);
      }
    };

    return Ok(JsonRepository {
      path: path.clone(),
      items: content,
    });
  }

  fn backup_with_timestamp(path: &Path) -> Result<PathBuf, UserError> {
    let timestamp = Local::now().format("%Y%m%d%H%M%S");
    let backup_path = path.with_file_name(format!(
      "{}_{}.bak.json",
      path.file_stem().unwrap_or_default().to_string_lossy(),
      timestamp
    ));
    if let Err(e) = fs::rename(path, &backup_path) {
      warn!("バックアップに失敗しました: {e}");
      return Err(UserError::IoError(e));
    }
		
    Ok(backup_path)
  }

  /// 新規作成
  pub fn initialize(path: &PathBuf) -> Result<Self, UserError> {
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
    self
      .items
      .iter()
      .map(|item| item.get_id())
      .max()
      .unwrap_or(0)
      + 1
  }

  /// 保存 アトミック
  fn save(&self) -> Result<(), UserError> {
    // 一時ファイルに書き込み
    let temp_path = self.path.with_extension("tmp");
    {
      let mut writer = BufWriter::new(fs::File::create(&temp_path)?);
      serde_json::to_writer_pretty(&mut writer, &self.items)?;
      writer.flush()?;
    }

    // リネームで上書き
    fs::rename(&temp_path, &self.path)?;
    Ok(())
  }
}
