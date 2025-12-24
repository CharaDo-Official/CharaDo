// ...existing code...
use futures::executor::block_on;
use std::future::IntoFuture;
use windows::Win32::System::Com::{CoInitializeEx, CoUninitialize, COINIT_APARTMENTTHREADED};
use windows::{core::HSTRING, Services::Store::StoreContext};
use windows_collections::IIterable;

use crate::entities::store::{StoreAddOn, StoreAppInfo};

pub(crate) fn fetch_store_info() -> Result<StoreAppInfo, String> {
  unsafe {
    let _ = CoInitializeEx(None, COINIT_APARTMENTTHREADED);
  }
  struct ComGuard;
  impl Drop for ComGuard {
    fn drop(&mut self) {
      unsafe {
        CoUninitialize();
      }
    }
  }
  let _com_guard = ComGuard;

  let ctx = StoreContext::GetDefault().map_err(|e| format!("{:?}", e))?;

  let op = ctx
    .GetStoreProductForCurrentAppAsync()
    .map_err(|e| format!("{:?}", e))?;
  let app_res = block_on(op.into_future()).map_err(|e| format!("{:?}", e))?;
  let app = app_res.Product().map_err(|e| format!("{:?}", e))?;
  let id = app.StoreId().map_err(|e| format!("{:?}", e))?.to_string();
  let title = app.Title().map_err(|e| format!("{:?}", e))?.to_string();

  let mut add_ons: Vec<StoreAddOn> = Vec::new();
  let kinds: IIterable<HSTRING> = IIterable::from(vec![HSTRING::from("Durable")]);
  let addon_op = ctx
    .GetUserCollectionAsync(&kinds)
    .map_err(|e| format!("{:?}", e))?;
  let addon_res = block_on(addon_op.into_future()).map_err(|e| format!("{:?}", e))?;

  if let Ok(products) = addon_res.Products() {
    if let Ok(it) = products.First() {
      while it.HasCurrent().unwrap_or(false) {
        if let Ok(pair) = it.Current() {
          if let Ok(addon_id) = pair.Key() {
            if let Ok(addon_product) = pair.Value() {
              if let Ok(addon_title) = addon_product.Title() {
                add_ons.push(StoreAddOn {
                  id: addon_id.to_string(),
                  title: addon_title.to_string(),
                  is_owned: true,
                });
              }
            }
          }
        }
        it.MoveNext().ok();
      }
    }
  }

  Ok(StoreAppInfo { id, title, add_ons })
}

use crate::error::UserError;
use obfstr::obfstr;
// 開発用
pub fn get_store_info_dev() -> Result<StoreAppInfo, UserError> {
  Ok(StoreAppInfo {
    id: "1234567890".to_string(),
    title: "Test App".to_string(),
    add_ons: vec![StoreAddOn {
      id: obfstr!(env!("ADDON_ID_MOTION_EXPANSION")).to_string(),
      title: "ADDON_ID_MOTION_EXPANSION".to_string(),
      is_owned: true,
    }],
  })
}
