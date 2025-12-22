//! Taskに関するモジュール
use serde::{Deserialize, Serialize};
use chrono::NaiveDate;
use crate::entities::HasId;
use ts_rs::TS;

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "task.ts")]
/// タスクを表す構造体
pub struct Task {
  /// タスクID
  id: u32,
  /// タイトル
  title: String,
  /// 説明
  description: String,
  /// 締め切り日
	#[ts(type = "string | null")]
  due_date: Option<NaiveDate>,
  /// 作成日
	#[ts(type = "string")]
  created_date: NaiveDate,
  /// 提案から外れた日
	#[ts(type = "string | null")]
  out_cast_date: Option<NaiveDate>,
  /// 重要度
  importance: Importance,
  /// ステータス
  status: Status,
	/// 表示順
	display_order: u32,
}

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "task.ts")]
pub enum Importance {
  Unimportant,
  Normal,
  Important,
  Crucial,
}

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "task.ts")]
pub enum Status {
  ToDo,
  Waiting,
  WantDo,
  Doing,
}

impl Task {
	pub fn is_title_empty(&self) -> bool {
		self.title.is_empty()
	}
}

impl HasId for Task {
	fn get_id(&self) -> u32 {
		self.id
	}

	fn set_id(&mut self, id: u32) {
		self.id = id;
	}
}