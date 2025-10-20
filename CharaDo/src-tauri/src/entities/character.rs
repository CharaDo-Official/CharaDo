use std::path::PathBuf;

use serde::{Deserialize, Serialize};

use crate::entities::HasId;

#[derive(Serialize, Deserialize, Clone, Debug)]
/// タスクを表す構造体
pub struct Character {
	/// キャラクターID
	id: u32,
	/// 名前
	name: String,
	/// 説明
	description: String,
	/// 必須アニメーション
	necessary_animation: NecessaryAnimation,
	/// 追加アニメーション
	optional_animations: OptionalAnimation,
	/// セリフ
	dialogues: Dialogue,
	/// 作者
	author: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum AnimationKind {
	Image,
	Movie,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Animation {
	/// アニメーションファイルのパス
	path: PathBuf,
	/// アニメーションの種類
	kind: AnimationKind,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NecessaryAnimation {
	/// 通常時アニメーション
	usual: Animation,
	/// 追加時アニメーション
	addition: Animation,
	/// 達成時アニメーション
	achievement: Animation,
	/// 登場時アニメーション
	on_stage: Animation,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct OptionalAnimation {
	/// 退場時アニメーション
	off_stage: Option<Animation>,
	/// タッチ時アニメーション
	touch: Option<Animation>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Dialogue {
	usual: Option<String>,
	addition: Option<String>,
	achievement: Option<String>,
	on_stage: Option<String>,
	off_stage: Option<String>,
	touch: Option<String>,
}


impl Character {
	pub fn new(id: u32,
					name: String,
					description: String,
					necessary_animation: NecessaryAnimation,
					optional_animations: OptionalAnimation,
					dialogues: Dialogue,
					author: Option<String>) -> Self {
		Character {
			id,
			name,
			description,
			necessary_animation,
			optional_animations,
			dialogues,
			author,
		}
	}
}

impl HasId for Character {
	fn get_id(&self) -> u32 {
		self.id
	}

	fn set_id(&mut self, id: u32) {
		self.id = id;
	}
}