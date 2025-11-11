pub mod task;
pub mod character;
pub mod user;
pub mod store;

/// ID を扱うためのトレイト
pub trait HasId {
  fn get_id(&self) -> u32;
  fn set_id(&mut self, id: u32);
}