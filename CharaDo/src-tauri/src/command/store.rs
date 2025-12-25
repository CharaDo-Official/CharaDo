
use crate::repository::store::fetch_store_info;
use crate::entities::store::StoreAppInfo;
use crate::repository::store::fetch_store_addons;
use crate::error::UserError;
use crate::services::store_service;
use crate::entities::store::AddonType;
use crate::entities::store::StoreAddOn;


#[tauri::command]
pub async fn get_store_info() -> Result<StoreAppInfo, UserError> {
    tauri::async_runtime::spawn_blocking(|| fetch_store_info())
        .await
        .map_err(|e| UserError::ValidationError(format!("spawn_blocking error: {:?}", e)))?
}

#[tauri::command]
pub async fn get_store_addons() -> Result<Vec<StoreAddOn>, UserError> {
    tauri::async_runtime::spawn_blocking(|| fetch_store_addons())
        .await
        .map_err(|e| UserError::ValidationError(format!("spawn_blocking error: {:?}", e)))?
}

/**
 * 所持しているアドオンを取得
 * アドオンの種類を返却(AddonType)
 */
#[tauri::command]
pub fn get_owned_addons() -> Result<Vec<AddonType>, UserError> {
	store_service::get_owned_addons()
}