use crate::entities::store::AddonType;
use crate::repository::store::get_store_info_dev;
use crate::error::UserError;

pub fn is_addon_owned(target_addon_type: AddonType) -> Result<bool, UserError> {
	// アドオン取得
	let addons = get_store_info_dev()?.add_ons;
	// アドオン検索
	for addon in addons {
		match AddonType::from_id(&addon.id) {
			Some(addon_type) => {
				if addon_type == target_addon_type {
					return Ok(true);
				}
			}
			None => continue,
		}
	}
	// 指定されたAddonTypeが見つからなかった場合はfalse
	Ok(false)
}