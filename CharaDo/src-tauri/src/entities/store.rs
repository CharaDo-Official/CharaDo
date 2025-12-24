use log::warn;
use obfstr::obfstr;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

/// アドオンの種類
#[derive(TS, Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq)]
#[ts(export, export_to = "store.ts")]
pub enum AddonType {
  /// データ拡張パック
  DataExpansion,
  /// モーション拡張パック
  MotionExpansion,
  /// カスタム枠+1
  CustomFrameAdd1,
  /// カスタム枠+2
  CustomFrameAdd2,
  /// カスタム枠+4
  CustomFrameAdd4,
}

impl AddonType {
  /// IDからAddonTypeを取得
  pub fn from_id(id: &str) -> Option<AddonType> {
    if id == obfstr!(env!("ADDON_ID_DATA_EXPANSION")) {
      Some(AddonType::DataExpansion)
    } else if id == obfstr!(env!("ADDON_ID_MOTION_EXPANSION")) {
      Some(AddonType::MotionExpansion)
    } else if id == obfstr!(env!("ADDON_ID_CUSTOM_FRAME_1")) {
      Some(AddonType::CustomFrameAdd1)
    } else if id == obfstr!(env!("ADDON_ID_CUSTOM_FRAME_2")) {
      Some(AddonType::CustomFrameAdd2)
    } else if id == obfstr!(env!("ADDON_ID_CUSTOM_FRAME_4")) {
      Some(AddonType::CustomFrameAdd4)
    } else {
      warn!("AddonType::from_id: unknown id={:?}", id);
      None
    }
  }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StoreAddOn {
  pub id: String,
  pub title: String,
  pub is_owned: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StoreAppInfo {
  pub id: String,
  pub title: String,
  pub add_ons: Vec<StoreAddOn>,
}
