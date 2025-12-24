use crate::repository::store::fetch_store_info;
use crate::entities::store::StoreAppInfo;

#[tauri::command]
pub async fn get_store_info() -> Result<StoreAppInfo, String> {
    tauri::async_runtime::spawn_blocking(|| fetch_store_info()).await
        .map_err(|e| format!("spawn_blocking join error: {:?}", e))?
}