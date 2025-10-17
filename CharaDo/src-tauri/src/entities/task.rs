//! Taskに関するモジュール

use chrono::{NaiveDate, Local};

/// タスクを表す構造体
pub struct Task {
	/// タスクID
	id : u32,
	/// タイトル
	title : String,
	/// 説明
	description : String,
	/// 締め切り日
	due_date : Option<NaiveDate>,
	/// 作成日
	created_date : NaiveDate,
	/// 提案から外れた日
	out_cast_date : Option<NaiveDate>,
	/// 重要度
	importance : Importance,
	/// ステータス
	status : Status,
}

impl Task {
	pub fn new(id: u32, title: String, description: String, due_date: Option<NaiveDate>, created_date: NaiveDate, out_cast_date: Option<NaiveDate>, importance: Importance, status: Status) -> Task {
		Task {
			id,
			title,
			description,
			due_date,
			created_date,
			out_cast_date,
			importance,
			status,
		}
	}

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

pub enum Importance {
	Unimportant,
	Normal,
	Important,
	Crucial,
}

pub enum Status {
	ToDo,
	Waiting,
	WantDo,
	Doing
}
