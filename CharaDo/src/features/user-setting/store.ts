import { create } from "zustand";
import type { User, Language } from "./types";
import * as api from "./api";

// 全体の状態を管理するための型
interface UserSettingState {
	user: User;
	loading: boolean;
	// Actions
	fetchUserConfig: () => Promise<void>;
	setUsingCharacterId: (characterId: number, isStandard: boolean) => Promise<void>;
	setUserLanguage: (language: Language) => Promise<void>;
}

// 初期値（ローディング完了までのプレースホルダー）
const DEFAULT_USER: User = {
	id: 0,
	current_character_id: 0,
	language: "ja", 
};

/**
 * Reactからストアを使うためのフック
 * @param set 状態を更新するための関数
 * @param get 状態を取得するための関数
 * @returns タスクのストア
 */
export const useUserSettingStore = create<UserSettingState>((set, get) => ({
	user: DEFAULT_USER,
	loading: false,

	fetchUserConfig: async () => {
		set({ loading: true });
		try {
			const user = await api.getUserConfig();
			set({ user });
		} finally {
			set({ loading: false });
		}
	},
	setUsingCharacterId: async (characterId: number, isStandard: boolean) => {
		set({ loading: true });
		try {
			await api.setUsingCharacterId(characterId, isStandard);
			await get().fetchUserConfig();
		} finally {
			set({ loading: false });
		}
	},
	setUserLanguage: async (language: Language) => {
		set({ loading: true });
		try {
			await api.setUserLanguage(language);
			await get().fetchUserConfig();
		} finally {
			set({ loading: false });
		}
	},
}));