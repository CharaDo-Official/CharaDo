use futures::executor::block_on;
use std::future::IntoFuture;
use windows::Win32::System::Com::{CoInitializeEx, CoUninitialize, COINIT_APARTMENTTHREADED};
use windows::{core::HSTRING, Services::Store::StoreContext};
use windows_collections::IIterable;

use crate::error::UserError;
use crate::entities::store::{StoreAppInfo, StoreAddOn};
use log::{warn};

/**
 * アプリ情報を取得
 */
pub(crate) fn fetch_store_info() -> Result<StoreAppInfo, UserError> {
    // WindowsRT API対応：COM STA初期化と自動解放（ComGuard）
    unsafe { let _ = CoInitializeEx(None, COINIT_APARTMENTTHREADED);}
    struct ComGuard;
    impl Drop for ComGuard { fn drop(&mut self) { unsafe { CoUninitialize();}}}
    let _com_guard = ComGuard;

    // StoreContextの取得
    let ctx = match StoreContext::GetDefault() {
        Ok(ctx) => ctx,
        Err(e) => {
            warn!("StoreContextの取得に失敗しました (Error: {e})");
            return Err(UserError::WinApiError(format!("{:?}", e)));
        }
    };

    // アプリ情報の取得操作の生成
    let app_op = match ctx.GetStoreProductForCurrentAppAsync() {
        Ok(op) => op,
        Err(e) => {
            warn!("アプリ情報の取得操作の生成に失敗しました (Error: {e})");
            return Err(UserError::WinApiError(format!("{:?}", e)));
        }
    };
    // 非同期操作を実行し、アプリ情報の取得を待機
    let app_res = match block_on(app_op.into_future()) {
        Ok(res) => res,
        Err(e) => {
            warn!("アプリ情報の取得に失敗しました (Error: {e})");
            return Err(UserError::WinApiError(format!("{:?}", e)));
        }
    };
    // 取得結果からアプリの詳細情報を抽出
    let app = match app_res.Product() {
        Ok(app) => app,
        Err(e) => {
            warn!("アプリの詳細情報の取得に失敗しました (Error: {e})");
            return Err(UserError::WinApiError(format!("{:?}", e)));
        }
    };
    // Microsoft Store ID
    let id = match app.StoreId() {
        Ok(id) => id.to_string(),
        Err(e) => {
            warn!("Microsoft Store IDの取得に失敗しました (Error: {e})");
            return Err(UserError::WinApiError(format!("{:?}", e)));
        }
    };
    // アプリタイトル
    let title = match app.Title() {
        Ok(title) => title.to_string(),
        Err(e) => {
            warn!("アプリタイトルの取得に失敗しました (Error: {e})");
            return Err(UserError::WinApiError(format!("{:?}", e)));
        }
    };

    Ok(StoreAppInfo { id, title })
}

/**
 * アドオン情報を取得
 */
pub(crate) fn fetch_store_addons() -> Result<Vec<StoreAddOn>, UserError> {
    // WindowsRT API対応：COM STA初期化と自動解放（ComGuard）
    unsafe { let _ = CoInitializeEx(None, COINIT_APARTMENTTHREADED);}
    struct ComGuard;
    impl Drop for ComGuard { fn drop(&mut self) { unsafe { CoUninitialize();}}}
    let _com_guard = ComGuard;

    // StoreContextの取得
    let ctx = match StoreContext::GetDefault() {
        Ok(ctx) => ctx,
        Err(e) => {
            warn!("StoreContextの取得に失敗しました (Error: {e})");
            return Err(UserError::WinApiError(format!("{:?}", e)));
        }
    };

    // アドオン情報取得操作の生成
    let mut add_ons: Vec<StoreAddOn> = Vec::new();
    let kinds: IIterable<HSTRING> = IIterable::from(Vec::<HSTRING>::new());
    let addon_op = match ctx.GetUserCollectionAsync(&kinds) {
        Ok(op) => op,
        Err(e) => {
            warn!("アドオン情報の取得操作の生成に失敗しました (Error: {e})");
            return Err(UserError::WinApiError(format!("{:?}", e)));
        }
    };

    // 非同期操作を実行し、アドオン情報の取得を待機
    let addon_res = match block_on(addon_op.into_future()) {
        Ok(res) => res,
        Err(e) => {
            warn!("アドオン情報の取得に失敗しました (Error: {e})");
            return Err(UserError::WinApiError(format!("{:?}", e)));
        }
    };

    // アドオンのマップ(Products)とイテレータを取得
    let Ok(products) = addon_res.Products() else {
        return Ok( add_ons ) 
    };
    let Ok(it) = products.First() else {
        return Ok( add_ons )
    };

    // イテレータを使ってアドオン情報を収集
    while it.HasCurrent().unwrap_or(false) {
        if let Ok(pair) = it.Current() {
            if let Some(addon) = extract_addon_info(pair) {
                add_ons.push(addon);
            }
          }
        it.MoveNext().ok();
    }

    Ok( add_ons )
}

// アドオン情報を抽出するヘルパー関数
fn extract_addon_info(pair: windows_collections::IKeyValuePair<HSTRING, windows::Services::Store::StoreProduct>) -> Option<StoreAddOn> {
    let addon_id = pair.Key().ok()?.to_string(); // アドオンIDの取得
    let product = pair.Value().ok()?; // StoreProductオブジェクトの取得
    let title = product.Title().ok()?.to_string(); // アドオンタイトルの取得

    Some(StoreAddOn {
        id: addon_id,
        title,
        is_owned: true,
    })
}

use obfstr::obfstr;
// 開発用
pub fn get_store_info_dev() -> Result<Vec<StoreAddOn>, UserError> {
  Ok(vec![
		StoreAddOn {
      id: obfstr!(env!("ADDON_ID_MOTION_EXPANSION")).to_string(),
      title: "ADDON_ID_MOTION_EXPANSION".to_string(),
      is_owned: true,
    },
		StoreAddOn {
      id: obfstr!(env!("ADDON_ID_CUSTOM_FRAME_1")).to_string(),
      title: "ADDON_ID_CUSTOM_FRAME_1".to_string(),
      is_owned: true,
    },
	])
}
