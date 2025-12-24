use dotenvy::dotenv;
use std::env;

fn main() {
  // .env 読み込み
  dotenv().ok();
  // アドオン情報取得
  let data_expansion_addon_id: String = env::var("ADDON_ID_DATA_EXPANSION").unwrap();
  let motion_expansion_addon_id: String = env::var("ADDON_ID_MOTION_EXPANSION").unwrap();
  let custom_frame_add1_addon_id: String = env::var("ADDON_ID_CUSTOM_FRAME_1").unwrap();
  let custom_frame_add2_addon_id: String = env::var("ADDON_ID_CUSTOM_FRAME_2").unwrap();
  let custom_frame_add4_addon_id: String = env::var("ADDON_ID_CUSTOM_FRAME_4").unwrap();
  // アドオン情報を環境変数に設定
  println!(
    "cargo:rustc-env=ADDON_ID_DATA_EXPANSION={}",
    data_expansion_addon_id
  );
  println!(
    "cargo:rustc-env=ADDON_ID_MOTION_EXPANSION={}",
    motion_expansion_addon_id
  );
  println!(
    "cargo:rustc-env=ADDON_ID_CUSTOM_FRAME_1={}",
    custom_frame_add1_addon_id
  );
  println!(
    "cargo:rustc-env=ADDON_ID_CUSTOM_FRAME_2={}",
    custom_frame_add2_addon_id
  );
  println!(
    "cargo:rustc-env=ADDON_ID_CUSTOM_FRAME_4={}",
    custom_frame_add4_addon_id
  );

  tauri_build::build()
}
