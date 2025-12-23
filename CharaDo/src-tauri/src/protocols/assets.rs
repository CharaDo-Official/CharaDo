use rust_embed::RustEmbed;
use log::info;
use tauri::http::{header, Request, Response};

#[derive(RustEmbed)]
#[folder = "assets/"]
struct EmbeddedAssets;

pub fn media_protocol_handler(request: &Request<Vec<u8>>) -> Response<Vec<u8>> {
  // パス解決
  let path = request.uri().path();
  let path = path.trim_start_matches('/');

  // URLデコード
  let decoded_path = percent_encoding::percent_decode_str(path).decode_utf8_lossy();

	info!("decoded_path: {}", decoded_path);

  match EmbeddedAssets::get(decoded_path.as_ref()) {
    Some(content) => {
      let mime = mime_guess::from_path(path).first_or_octet_stream();

      Response::builder()
        .status(200)
        .header(header::CONTENT_TYPE, mime.as_ref()) // Content-Typeを設定
        .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*") // CORSを設定
        .header(header::ACCEPT_RANGES, "bytes") // Rangeリクエストに対応
        .body(content.data.into_owned()) // データをそのまま返す
        .unwrap()
    }
    None => Response::builder().status(404).body(vec![]).unwrap(),
  }
}
