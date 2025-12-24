// アプリ標準キャラクターのデータ
use crate::entities::character::*;
use url::Url;

pub fn get_preset_characters() -> Vec<Character> {
  vec![create_tumugi()]
}

fn create_tumugi() -> Character {
  Character::new(
    1,
    "紬(つむぎ)".to_string(),
    "あなたのタスク管理をサポートする、猫耳の少女。日々のタスクと人を、紡いでいってほしいという願いから「つむぎ」と名付けられた。".to_string(),
    NecessaryMedia::new(
      Url::parse("http://assets.localhost/tumugi/usual.png").expect("Failed to parse preset character URL"),
      Url::parse("http://assets.localhost/tumugi/addition.png").expect("Failed to parse preset character URL"),
      Url::parse("http://assets.localhost/tumugi/achievement.png").expect("Failed to parse preset character URL"),
      Url::parse("http://assets.localhost/tumugi/on_stage.png").expect("Failed to parse preset character URL")),
    OptionalMedia::new(
      Url::parse("http://assets.localhost/tumugi/off_stage.png").expect("Failed to parse preset character URL"),
      Url::parse("http://assets.localhost/tumugi/touch.png").expect("Failed to parse preset character URL")),
    Url::parse("http://assets.localhost/tumugi/thumbnail.png").expect("Failed to parse preset character URL"),
    Dialogue::new(
      "お仕事、おつかれさまです".to_string(),
      "がんばるぞ～".to_string(),
      "やった～！".to_string(),
      "こんにちは～".to_string(),
      "応援してるね".to_string(),
      "んなっ！".to_string(),
    ),
    "破戒いむ".to_string(),
  )
}
