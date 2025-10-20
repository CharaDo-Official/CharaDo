//! Taskに関するモジュール
use serde::{Deserialize, Serialize};
use chrono::{Local, NaiveDate};
use crate::entities::HasId;

#[derive(Serialize, Deserialize, Clone, Debug)]
/// タスクを表す構造体
pub struct Task {
  /// タスクID
  id: u32,
  /// タイトル
  title: String,
  /// 説明
  description: String,
  /// 締め切り日
  due_date: Option<NaiveDate>,
  /// 作成日
  created_date: NaiveDate,
  /// 提案から外れた日
  out_cast_date: Option<NaiveDate>,
  /// 重要度
  importance: Importance,
  /// ステータス
  status: Status,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Importance {
  Unimportant,
  Normal,
  Important,
  Crucial,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Status {
  ToDo,
  Waiting,
  WantDo,
  Doing,
}

impl Task {
  pub fn create(id: u32, title: String) -> Task {
    Task {
      id,
      title,
      description: String::new(),
      due_date: None,
      created_date: Local::now().naive_local().date(),
      out_cast_date: None,
      importance: Importance::Normal,
      status: Status::ToDo,
    }
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