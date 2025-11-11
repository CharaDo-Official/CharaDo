use windows::{core::HSTRING, Services::Store::StoreContext};
use windows_futures::FutureExt;
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
    let kinds: [HSTRING; 1] = [HSTRING::from("Durable")];
        let assoc = ctx
        .GetAssociatedStoreProductsAsync(&kinds)
        .map_err(|e| format!("{e:?}"))?
        .into_future()              // ← 追加
        .await
        .map_err(|e| format!("{e:?}"))?;
    let mut add_ons = Vec::new();
    let map = assoc.Products().map_err(|e| format!("{e:?}"))?;
    let mut it = map.First().map_err(|e| format!("{e:?}"))?;
    while it.HasCurrent().map_err(|e| format!("{e:?}"))? {
        let pair = it.Current().map_err(|e| format!("{e:?}"))?;
        let p = pair.Value().map_err(|e| format!("{e:?}"))?;
        add_ons.push(StoreAddOn {
            id: p.StoreId().map_err(|e| format!("{e:?}"))?.to_string(),
            title: p.Title().map_err(|e| format!("{e:?}"))?.to_string(),
            is_owned: p.IsInUserCollection().map_err(|e| format!("{e:?}"))?,
        });
        it.MoveNext().map_err(|e| format!("{e:?}"))?;
    }

    Ok(StoreAppInfo { id, title, add_ons })
}
