// フロントとの窓口

import { useEffect } from "react";
import { useCharacterStore } from "./store";

/**
 * コンポーネントがマウントされた時にデータを取得
 * @returns キャラクターの配列とローディング状態
 */
export function useCharacters() {
	const { characters, loading, fetchCharacters } = useCharacterStore();

	useEffect(() => {
		fetchCharacters();
	}, [fetchCharacters]);

	return { characters, loading };
}

/**
 * キャラクターのアクションを使用
 * @returns キャラクターのアクション
 */
export function useCharacterActions() {
	const fetchCharacters = useCharacterStore((state) => state.fetchCharacters);
	const getCharacter = useCharacterStore((state) => state.getCharacter);
	const addCharacter = useCharacterStore((state) => state.addCharacter);
	const updateCharacter = useCharacterStore((state) => state.updateCharacter);
	const deleteCharacter = useCharacterStore((state) => state.deleteCharacter);

	return { 
		fetchCharacters, getCharacter, addCharacter, updateCharacter, deleteCharacter };
}