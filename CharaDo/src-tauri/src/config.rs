use std::path::PathBuf;

pub const TASK_REPOSITORY_FILE: &str = "tasks.json";

fn data_local_dir() -> PathBuf {
	let mut path: PathBuf =
		dirs_next::data_local_dir().expect("AppLocalData ディレクトリが取得できませんでした");
	path.push("com.cfeel.charado");
	path
}

pub fn task_repository_file() -> PathBuf {
	let mut path = data_local_dir();
	path.push(TASK_REPOSITORY_FILE);
	path
}
