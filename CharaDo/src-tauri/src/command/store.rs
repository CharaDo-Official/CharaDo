use crate::repository::store::fetch_store_info;
use crate::entities::store::StoreAppInfo;

#[tauri::command]
pub async fn get_store_info() -> Result<StoreAppInfo, String> {
    fetch_store_info().await
}
