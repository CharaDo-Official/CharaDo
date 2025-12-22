use obfstr::obfstr;
use log::warn;
use serde::{Deserialize, Serialize};

/// アドオンの種類
#[derive(PartialEq, Eq, Clone, Copy, Debug)]
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
	fn from_id(id: &str) -> Option<AddonType> {
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

	/// 指定AddonTypeと一致するかを返す
	pub fn is_match(self, id: &str) -> bool {
		match Self::from_id(id) {
			Some(addon_type) => self == addon_type,
			None => false,
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
