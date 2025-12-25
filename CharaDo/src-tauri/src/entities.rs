// エンティティを管理するモジュール

pub mod character;
pub mod store;
pub mod task;
pub mod user;

/// ID を扱うためのトレイト
pub trait HasId {
  fn get_id(&self) -> u32;
  fn set_id(&mut self, id: u32);
}
