use std::path::PathBuf;
use url::Url;

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
  /// 必須メディア
  necessary_media: NecessaryMedia,
  /// 追加メディア
  optional_media: OptionalMedia,
  /// サムネイル画像のパス
  thumbnail_source: MediaSource,
  /// セリフ
  dialogues: Dialogue,
  /// アプリ標準かユーザー作成か
  is_standard: bool,
  /// 作者
  author: Option<String>,
}

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "character.ts")]
pub enum MediaSource {
  Embedded(#[ts(type = "string")] Url),
  External(PathBuf),
}

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "character.ts")]
pub struct NecessaryMedia {
  /// 通常時メディア
  usual: MediaSource,
  /// 追加時メディア
  addition: MediaSource,
  /// 達成時メディア
  achievement: MediaSource,
  /// 登場時メディア
  on_stage: MediaSource,
}

#[derive(TS, Serialize, Deserialize, Clone, Debug)]
#[ts(export, export_to = "character.ts")]
pub struct OptionalMedia {
  /// 退場時メディア
  off_stage: Option<MediaSource>,
  /// タッチ時メディア
  touch: Option<MediaSource>,
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

// 以下 標準キャラクター用(埋め込み)
// is_standard: true
// MediaSourceはUrlのみ許可
// Option項目は全て必須
// 		auther必須
// 		OptionalMedia必須
// 		Dialogue必須

impl Character {
  pub fn new(
    id: u32,
    name: String,
    description: String,
    necessary_media: NecessaryMedia,
    optional_media: OptionalMedia,
    thumbnail_source: Url,
    dialogues: Dialogue,
    author: String,
  ) -> Self {
    Self {
      id,
      name,
      description,
      necessary_media,
      optional_media,
      thumbnail_source: MediaSource::Embedded(thumbnail_source),
      dialogues,
      is_standard: true,
      author: Some(author),
    }
  }
}

impl NecessaryMedia {
  pub fn new(usual: Url, addition: Url, achievement: Url, on_stage: Url) -> Self {
    Self {
      usual: MediaSource::Embedded(usual),
      addition: MediaSource::Embedded(addition),
      achievement: MediaSource::Embedded(achievement),
      on_stage: MediaSource::Embedded(on_stage),
    }
  }
}

impl OptionalMedia {
  pub fn new(off_stage: Url, touch: Url) -> Self {
    Self { off_stage: Some(MediaSource::Embedded(off_stage)), touch: Some(MediaSource::Embedded(touch)) }
  }
}

impl Dialogue {
  pub fn new(
    usual: String,
    addition: String,
    achievement: String,
    on_stage: String,
    off_stage: String,
    touch: String,
  ) -> Self {
    Self {
      usual: Some(usual),
      addition: Some(addition),
      achievement: Some(achievement),
      on_stage: Some(on_stage),
      off_stage: Some(off_stage),
      touch: Some(touch),
    }
  }
}
