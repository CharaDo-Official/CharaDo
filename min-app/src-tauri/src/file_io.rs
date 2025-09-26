use std::fs::File;
use std::io::prelude::*;

#[tauri::command]
pub fn my_custom_command() -> Result<(), String> {
  println!("I was invoked from JavaScript!");
	main().map_err(|e| e.to_string())?;
	Ok(())
}

fn main() -> std::io::Result<()> {
	let mut file = File::create("foo.txt")?;
	file.write_all(b"Hello, world!")?;
	Ok(())
}