// バックエンドとの通信を担当

import { invoke } from "@tauri-apps/api/core";
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
	const rawCharacters: CharacterRaw[] = await invoke("get_all_characters");
	return rawCharacters.map(normalize);
}

/**
 * 特定のキャラクターを取得
 * @param id キャラクターID
 * @returns キャラクター
 */
export async function getCharacter(id: number): Promise<Character | null> {
	const rawCharacter: CharacterRaw | null = await invoke("get_character", { id });
	return rawCharacter ? normalize(rawCharacter) : null;
}

/**
 * キャラクターを追加
 * @param character キャラクター
 * @returns 追加されたキャラクターID
 */
export async function addCharacter(character: Character): Promise<number> {
	return await invoke("add_character", { character: denormalize(character) });
}

/**
 * キャラクターを更新
 * @param character キャラクター
 */
export async function updateCharacter(character: Character): Promise<void> {
	await invoke("update_character", { character: denormalize(character) });
}

/**
 * 複数のキャラクターを更新
 * @param characters キャラクターの配列
 */
export async function updateCharacters(characters: Character[]): Promise<void> {
	const rawCharacters = characters.map(denormalize);
	await invoke("update_characters", { characters: rawCharacters });
}

/**
 * キャラクターを削除
 * @param id キャラクターID
 */
export async function deleteCharacter(id: number): Promise<void> {
	await invoke("delete_character", { id });
}

