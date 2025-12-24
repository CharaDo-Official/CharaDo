// バックエンドとの通信を担当

import { safeInvoke } from "@lib/api-client";
import type { Character, CharacterRaw } from "./types";

// 生データ -> 整形データ
// 現状はパススルーだが、必要に応じて変換ロジックを入れる
function normalize(data: CharacterRaw): Character {
	return {
		...data
	};
}

// 整形データ -> 生データ(Rust)
function denormalize(data: Character): CharacterRaw {
	return {
		...data
	};
}

/**
 * 全てのキャラクターを取得
 * @returns キャラクターの配列
 */
export async function getAllCharacters(): Promise<Character[]> {
	const rawCharacters = await safeInvoke<CharacterRaw[]>("get_all_characters");
	return rawCharacters.map(normalize);
}

/**
 * 特定のキャラクターを取得
 * @param id キャラクターID
 * @param isStandard アプリ標準キャラクターかどうか
 * @returns キャラクター
 */
export async function getCharacter(id: number, isStandard: boolean): Promise<Character | null> {
	// Rust側の引数名は snake_case (id, is_standard)
	const rawCharacter = await safeInvoke<CharacterRaw | null>("get_character", { id, is_standard: isStandard });
	if (rawCharacter === null) {
		return null;
	}
	return normalize(rawCharacter);
}

/**
 * キャラクターを追加
 * @param character キャラクター
 * @returns 追加されたキャラクターID
 */
export async function addCharacter(character: Character): Promise<number> {
	return await safeInvoke<number>("add_character", { character: denormalize(character) });
}

/**
 * キャラクターを更新
 * @param character キャラクター
 */
export async function updateCharacter(character: Character): Promise<void> {
	await safeInvoke<void>("update_character", { character: denormalize(character) });
}

/**
 * キャラクターを削除
 * @param id キャラクターID
 */
export async function deleteCharacter(id: number): Promise<void> {
	await safeInvoke<void>("delete_character", { id });
}
