// ...existing code...
use crate::entities::store::StoreAppInfo;
use crate::repository::store::fetch_store_info;
use crate::entities::store::AddonType;
use crate::error::UserError;
use crate::services::store_service;

#[tauri::command]
pub async fn get_store_info() -> Result<StoreAppInfo, String> {
  // Simplified: run the repository call on a blocking thread and return its Result.
  // Any join error is converted to a simple string.
  tauri::async_runtime::spawn_blocking(|| fetch_store_info())
    .await
    .map_err(|e| format!("spawn_blocking join error: {:?}", e))?
}

/**
 * 所持しているアドオンを取得
 * アドオンの種類を返却(AddonType)
 */
#[tauri::command]
pub fn get_owned_addons() -> Result<Vec<AddonType>, UserError> {
	store_service::get_owned_addons()
}
