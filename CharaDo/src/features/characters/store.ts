import { create } from "zustand";
import type { Character } from "./types";
import * as api from "./api";

// 全体の状態を管理するための型
interface CharacterState {
	characters: Character[];
	loading: boolean;
	// Actions
	fetchCharacters: () => Promise<void>;
	getCharacter: (id: number) => Promise<Character | null>;
	addCharacter: (character: Character) => Promise<number>;
	updateCharacter: (character: Character) => Promise<void>;
	deleteCharacter: (id: number) => Promise<void>;
}

/**
 * Reactからストアを使うためのフック
 */
export const useCharacterStore = create<CharacterState>((set, get) => ({
	characters: [],
	loading: false,

	fetchCharacters: async () => {
		set({ loading: true });
		try {
			const characters = await api.getAllCharacters();
			set({ characters });
		} finally {
			set({ loading: false });
		}
	},

	getCharacter: async (id: number) => {
		set({ loading: true });
		try {
			const character = await api.getCharacter(id);
			return character;
		} finally {
			set({ loading: false });
		}
	},

	addCharacter: async (character: Character) => {
		set({ loading: true });
		try {
			const id = await api.addCharacter(character);
			await get().fetchCharacters();
			return id;
		} finally {
			set({ loading: false });
		}
	},

	updateCharacter: async (character: Character) => {
		set({ loading: true });
		try {
			await api.updateCharacter(character);
			await get().fetchCharacters();
		} finally {
			set({ loading: false });
		}
	},

	deleteCharacter: async (id: number) => {
		set({ loading: true });
		try {
			await api.deleteCharacter(id);
			await get().fetchCharacters();
		} finally {
			set({ loading: false });
		}
	},
}));

