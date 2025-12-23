use crate::datas::preset_characters::get_preset_characters;
use crate::entities::character::*;
use crate::entities::HasId;
use crate::error::UserError;
use crate::state::AppState;
use crate::services::store_service::is_addon_owned;
use crate::entities::store::AddonType;
use tauri::State;

/**
 * 全てのキャラクターを取得
 * アプリ標準キャラクターと、ユーザー作成キャラクターを合成し返却
 */
pub fn get_all_characters(state: State<AppState>) -> Result<Vec<Character>, UserError> {
  match state.character_repo.read() {
    Ok(repo) => {
      let mut characters = get_preset_characters();
      characters.extend(repo.get_all().iter().cloned());
      Ok(characters)
    }
    Err(e) => Err(e.into()),
  }
}

/**
 * キャラクターを取得
 * is_standard: true アプリ標準キャラクターを取得
 * is_standard: false ユーザー作成キャラクターを取得
 */
pub fn get_character(state: State<AppState>, id: u32, is_standard: bool) -> Option<Character> {
  if is_standard {
    return get_preset_characters()
      .iter()
      .find(|c| c.get_id() == id)
      .cloned();
  } else {
    match state.character_repo.read() {
      Ok(repo) => repo.get(id).cloned(),
      Err(_) => return None,
    }
  }
}

/**
 * キャラクターを追加
 */
pub fn add_character(state: State<AppState>, character: Character) -> Result<u32, UserError> {
	// アドオンを購入していた場合のみ追加可能
	// 追加可能枠
	let mut frame_num = 0b0000;
	if is_addon_owned(AddonType::CustomFrameAdd1)? {
		frame_num |= 0b0001;
	}
	if is_addon_owned(AddonType::CustomFrameAdd2)? {
		frame_num |= 0b0010;
	}
	if is_addon_owned(AddonType::CustomFrameAdd4)? {
		frame_num |= 0b0100;
	}

	// 追加可能枠が0の場合は追加不可
	if frame_num == 0 {
		return Err(UserError::StoreError("キャラカスタム枠のご購入が必要です".to_string()));
	}
	// 追加可能数が足りない場合は追加不可
	match state.character_repo.read() {
		Ok(repo) => {
			if repo.get_all().len() >= frame_num {
				return Err(UserError::StoreError("キャラカスタム枠の追加が必要です".to_string()));
			}
		},
		Err(e) => return Err(e.into()),
	}

  // 空の名前は受け付けない
  if character.is_name_empty() {
    return Err(UserError::ValidationError("Name is empty".to_string()));
  }

	// キャラクター追加
  match state.character_repo.write() {
    Ok(mut repo) => {
			let id = repo.add(character)?;
			Ok(id)
		},
		Err(e) => Err(e.into()),
	}
}


/**
 * キャラクターを削除
 */
pub fn delete_character(state: State<AppState>, id: u32) -> Result<(), UserError> {
	match state.character_repo.write() {
		Ok(mut repo) => repo.remove(id),
		Err(e) => Err(e.into()),
	}
}

/**
 * キャラクターを更新
 */
pub fn update_character(state: State<AppState>, character: Character) -> Result<(), UserError> {
	// 更新キャラクター情報取得
	let is_standard = character.is_standard();
	let id = character.get_id();
	
	// 更新対象のキャラクター取得
	let mut target_character = match get_character(state.clone(), id, is_standard) {
		Some(target_character) => target_character,
		None => return Err(UserError::NotFoundError("Update target character not found".to_string())),
	};

	// 本当は更新対象と比較した方がいいのだろうが、面倒なので無視
	// ちゃんと比較をすると、モーション拡張パックを購入してないのにセリフを変更しようとした際にエラーを返せる

	// モーション拡張パックを購入していた場合、セリフを変更可能
	let is_motion_expansion_owned: bool = is_addon_owned(AddonType::MotionExpansion)?;
	if is_motion_expansion_owned {
		target_character.set_dialogue(character.get_dialogue());
	};

	// モーション拡張パックを購入している かつ ユーザ作成キャラクターの場合、モーションを変更可能
	if is_motion_expansion_owned && !is_standard {
		target_character.set_medias(character.get_medias());
	};

	// キャラクター更新
	match state.character_repo.write() {
		Ok(mut repo) => repo.update(target_character),
		Err(e) => Err(e.into()),
	}
}