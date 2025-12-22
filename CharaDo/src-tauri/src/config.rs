// アプリ内部の設定
use std::path::PathBuf;

const APP_DATA_DIR: &str = "com.cfeel.charado";
const CHARACTER_REPOSITORY_FILE: &str = "characters.json";
const TASK_REPOSITORY_FILE: &str = "tasks.json";
const USER_CONFIG_FILE: &str = "user_config.json";

/**
 * アプリケーションのデータディレクトリを取得する
 */
fn data_local_dir() -> PathBuf {
	let mut path: PathBuf =
		dirs_next::data_local_dir().expect("AppLocalData ディレクトリが取得できませんでした");
	path.push(APP_DATA_DIR);
	path
}

/**
 * タスクリポジトリのファイルを取得する
 */
pub fn task_repository_file() -> PathBuf {
	let mut path = data_local_dir();
	path.push(TASK_REPOSITORY_FILE);
	path
}

/**
 * キャラクタリポジトリのファイルを取得する
 */
pub fn character_repository_file() -> PathBuf {
	let mut path = data_local_dir();
	path.push(CHARACTER_REPOSITORY_FILE);
	path
}

/**
 * ユーザ設定ファイルを取得する
 */
pub fn user_config_file() -> PathBuf {
	let mut path = data_local_dir();
	path.push(USER_CONFIG_FILE);
	path
}
