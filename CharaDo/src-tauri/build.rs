use dotenvy::dotenv;
use std::env;

fn main() {
	// .env 読み込み
	dotenv().ok();
	// アドオン情報取得
	let addon_id: String = env::var("ADDON_ID").unwrap();
	// アドオン情報を環境変数に設定
	println!("cargo:rustc-env=ADDON_ID={}", addon_id);

	tauri_build::build()
}
