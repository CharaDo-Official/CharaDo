pub mod task;
pub mod character;

/// ID を扱うためのトレイト
pub trait HasId {
  fn get_id(&self) -> u32;
  fn set_id(&mut self, id: u32);
}