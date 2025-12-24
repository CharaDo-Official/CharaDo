// フロントとの窓口

import { useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
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

/**
 * ファイル選択フック
 */
export function useFileSelect() {
	const selectMediaFile = async (): Promise<string | null> => {
		try {
			const selected = await open({
				multiple: false,
				filters: [{
					name: "Image or Video",
					extensions: ["png", "jpg", "jpeg", "gif", "webm", "mp4"]
				}]
			});
			
			if (selected === null) return null;
			return selected as string;
		} catch (error) {
			console.error("File selection failed:", error);
			return null;
		}
	};

	return { selectMediaFile };
}
