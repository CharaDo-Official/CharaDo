use crate::datas::preset_characters::get_preset_characters;
use crate::entities::character::*;
use crate::entities::store::AddonType;
use crate::entities::HasId;
use crate::error::UserError;
use crate::services::store_service::is_addon_owned;
use crate::state::AppState;
use tauri::State;

/**
 * 全てのキャラクターを取得
 * アプリ標準キャラクターと、ユーザー作成キャラクターを合成し返却
 */
pub fn get_all_characters(state: State<AppState>) -> Result<Vec<Character>, UserError> {
  // キャラクターデータを取得
  let characters_data = state.character_repo.read()?.get_all().clone(); // ロックは文末で解除されている

  // 標準キャラクターとユーザー作成キャラクターに分離
  let (std_repo_chars, user_repo_chars): (Vec<Character>, Vec<Character>) =
    characters_data.into_iter().partition(|c| c.is_standard());

  // 標準キャラクターのデフォルトデータ取得
  let preset_characters = get_preset_characters();

  // 標準キャラクターのデータ修正・マージ処理
  let is_motion_expansion_owned = is_addon_owned(AddonType::MotionExpansion).unwrap_or(false);
  let merged_std_characters: Vec<Character> = preset_characters
    .into_iter()
    .map(|mut preset| {
      // アドオンを持っていないなら、無条件でプリセット（デフォルト）を使う
      if !is_motion_expansion_owned {
        return preset;
      }

      // アドオンを持っている場合、保存されたデータ（セリフ変更等）があれば適用する
      // 改ざん対策: IDが一致するデータを探すが、複数あっても最初の一つだけ採用し、他は無視する
      if let Some(saved) = std_repo_chars
        .iter()
        .find(|c| c.get_id() == preset.get_id())
      {
        // セリフだけを適用
        preset.set_dialogue(saved.get_dialogue());
      }

      preset
    })
    .collect();

  // 整合性のとれたデータ作成
  let mut result_characters: Vec<Character> = merged_std_characters;
  result_characters.extend(user_repo_chars);

  // 自己修復
  state
    .character_repo
    .write()?
    .replace(result_characters.clone())?;

  Ok(result_characters)
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

/// カスタム枠の追加可能数を計算
fn calculate_custom_frame_count() -> Result<usize, UserError> {
  let mut allowed_frame_count = 0;
  if is_addon_owned(AddonType::CustomFrameAdd1)? {
    allowed_frame_count += 1;
  }
  if is_addon_owned(AddonType::CustomFrameAdd2)? {
    allowed_frame_count += 2;
  }
  if is_addon_owned(AddonType::CustomFrameAdd4)? {
    allowed_frame_count += 4;
  }

  Ok(allowed_frame_count)
}

/**
 * キャラクターを追加
 */
pub fn add_character(state: State<AppState>, character: Character) -> Result<u32, UserError> {
  // 空の名前は受け付けない
  if character.is_name_empty() {
    return Err(UserError::ValidationError("Name is empty".to_string()));
  }

  // アドオンを購入していた場合のみ追加可能
  let allowed_frame_count = calculate_custom_frame_count()?;
  // 追加可能枠が0の場合は追加不可
  if allowed_frame_count == 0 {
    return Err(UserError::StoreError(
      "キャラカスタム枠のご購入が必要です".to_string(),
    ));
  }

  // ロックを取得 本来スコープは不要だが、見やすさ
  {
    // 追加可能数が足りない場合は追加不可
    let mut repo = state.character_repo.write()?;
    let current_frame_count = repo.get_all().iter().filter(|c| !c.is_standard()).count();
    if current_frame_count >= allowed_frame_count {
      return Err(UserError::StoreError(
        "キャラカスタム枠の追加が必要です".to_string(),
      ));
    }

    // キャラクター追加
    let id = repo.add(character)?;
    Ok(id)
  }
}

/**
 * キャラクターを削除
 */
pub fn delete_character(state: State<AppState>, id: u32) -> Result<(), UserError> {
  state.character_repo.write()?.remove(id)
}

/**
 * キャラクターを更新
 */
pub fn update_character(state: State<AppState>, character: Character) -> Result<(), UserError> {
  // 更新キャラクター情報取得
  let is_standard = character.is_standard();
  let id = character.get_id();

  // 標準キャラクターかつアドオン未所持なら更新不可
  let is_motion_expansion_owned: bool = is_addon_owned(AddonType::MotionExpansion)?;
  if is_standard && !is_motion_expansion_owned {
    return Err(UserError::StoreError(
      "標準キャラクターかつアドオン未所持により更新不可能です".to_string(),
    ));
  }

  {
    let mut repo = state.character_repo.write()?;

    // 更新対象のキャラクター取得
    let mut target_character = repo.get(id).cloned().ok_or_else(|| {
      UserError::NotFoundError("更新対象のキャラクターが見つかりません".to_string())
    })?;

    // データ加工
    // モーション拡張パックを購入していた場合、セリフを変更可能
		if is_standard {	
			if is_motion_expansion_owned {
				// 標準キャラクター かつ モーション拡張パックを購入していた場合、セリフを変更可能
				target_character.set_dialogue(character.get_dialogue());
			} else {
				// 標準キャラクター かつ モーション拡張パックを購入していない場合、変更不可
				return Err(UserError::StoreError("標準キャラクターかつアドオン未所持により更新不可能です".to_string()));
			}
		} else {
			if is_motion_expansion_owned {
				// ユーザ作成キャラクター かつ モーション拡張パックを購入していた場合、全て変更可能
				target_character = character;
			} else {
				// ユーザ作成キャラクター かつ モーション拡張パックを購入していない場合、(セリフ・タッチモーション)以外を変更可能
				target_character.set_permission_free_param(character.get_permission_free_param());
			}
		}
		
    // キャラクター更新
    repo.update(target_character)?;
    Ok(())
  }
}
