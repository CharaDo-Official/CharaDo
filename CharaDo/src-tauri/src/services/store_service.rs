use crate::entities::store::AddonType;
use crate::error::UserError;
use crate::repository::store::get_store_info_dev;

/**
 * アドオンが所持されているかを取得
 */
pub fn is_addon_owned(target_addon_type: AddonType) -> Result<bool, UserError> {
  // アドオン取得 (開発用)
  let addons = get_store_info_dev()?;
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

/**
 * 所持しているアドオンを取得
 */
pub fn get_owned_addons() -> Result<Vec<AddonType>, UserError> {
  let mut owned_addons = Vec::new();
  // アドオン取得 (開発用)
  let addons = get_store_info_dev()?;
  for addon in addons {
    if addon.is_owned {
      if let Some(addon_type) = AddonType::from_id(&addon.id) {
        owned_addons.push(addon_type);
      }
    }
  }
  Ok(owned_addons)
}