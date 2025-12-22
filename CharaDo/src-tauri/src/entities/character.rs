use std::path::PathBuf;

use serde::{Deserialize, Serialize};

use crate::entities::HasId;
use ts_rs::TS;

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "character.ts")]
/// キャラクタを表す構造体
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
	/// アプリ標準かユーザー作成か
	is_standard: bool,
	/// 作者
	author: Option<String>,
}

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "character.ts")]
pub enum AnimationKind {
	Image,
	Movie,
}

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "character.ts")]
struct Animation {
	/// アニメーションファイルのパス
	path: PathBuf,
	/// アニメーションの種類
	kind: AnimationKind,
}

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "character.ts")]
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

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "character.ts")]
pub struct OptionalAnimation {
	/// 退場時アニメーション
	off_stage: Option<Animation>,
	/// タッチ時アニメーション
	touch: Option<Animation>,
}

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "character.ts")]
pub struct Dialogue {
	usual: Option<String>,
	addition: Option<String>,
	achievement: Option<String>,
	on_stage: Option<String>,
	off_stage: Option<String>,
	touch: Option<String>,
}


impl Character {
	pub fn is_name_empty(&self) -> bool {
		self.name.is_empty()
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