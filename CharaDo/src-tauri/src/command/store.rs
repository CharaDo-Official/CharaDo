use crate::repository::store::fetch_store_info;
use crate::entities::store::StoreAppInfo;
use crate::repository::store::fetch_store_addons;
use crate::entities::store::StoreAddOns;
use crate::error::UserError;

#[tauri::command]
pub async fn get_store_info() -> Result<StoreAppInfo, UserError> {
    tauri::async_runtime::spawn_blocking(|| fetch_store_info())
        .await
        .map_err(|e| UserError::ValidationError(format!("spawn_blocking error: {:?}", e)))?
}

#[tauri::command]
pub async fn get_store_addons() -> Result<StoreAddOns, UserError> {
    tauri::async_runtime::spawn_blocking(|| fetch_store_addons())
        .await
        .map_err(|e| UserError::ValidationError(format!("spawn_blocking error: {:?}", e)))?
}