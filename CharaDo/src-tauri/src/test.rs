use log::info;
use obfstr::obfstr;

const VIDEO_DATA: &[u8] = include_bytes!("../assets/sample.webm");

pub fn test() {
  // コンパイル時の環境変数を取得 難読化もしておく
  info!(
    "lib_main: ToDo: remove this log after development: ADDON_ID_DATA_EXPANSION={}",
    obfstr!(env!("ADDON_ID_DATA_EXPANSION"))
  );

  info!("VIDEO_DATA length: {}", VIDEO_DATA.len());
}


#[cfg(test)]
mod tests {
	use crate::datas::preset_setting::get_default_setting;

  #[test]
  fn get_user_language_works() {

    println!("default setting: {:?}", get_default_setting());

  }
}
