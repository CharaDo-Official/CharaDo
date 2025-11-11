use windows::{core::HSTRING, Services::Store::StoreContext};
use std::future::IntoFuture;
use crate::entities::store::{StoreAppInfo, StoreAddOn};

pub async fn fetch_store_info() -> Result<StoreAppInfo, String> {
    let ctx = StoreContext::GetDefault().map_err(|e| format!("{e:?}"))?;

    // アプリ情報
    let app_res = ctx
        .GetStoreProductForCurrentAppAsync()
        .map_err(|e| format!("{e:?}"))?
        .into_future()              // ← 追加
        .await
        .map_err(|e| format!("{e:?}"))?;
    let app = app_res.Product().map_err(|e| format!("{e:?}"))?;
    let id = app.StoreId().map_err(|e| format!("{e:?}"))?.to_string();
    let title = app.Title().map_err(|e| format!("{e:?}"))?.to_string();

    // アドオン（Durable）
    // create a WinRT Array of HSTRING which implements IIterable<HSTRING>
    // pass a slice of HSTRING which the bindings may accept as an IIterable
    let kinds = [HSTRING::from("Durable")];
        // TODO: get associated store products (Durable add-ons).
        // The WinRT collection conversion to IIterable<HSTRING> is platform-specific
        // and currently causes trait-bound errors in our build; return an empty list
        // for now and implement the WinRT collection conversion later.
        let mut add_ons = Vec::new();
    Ok(StoreAppInfo { id, title, add_ons })
}
