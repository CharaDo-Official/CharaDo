import { useEffect } from "react";
import { useUserSettingStore } from "./store";

/**
 * 所持しているアドオンを取得
 * @returns 所持しているアドオンの配列とローディング状態
 */
export function useUserSetting() {
	const { user, loading, fetchUserConfig } = useUserSettingStore();

	useEffect(() => {
		fetchUserConfig();
	}, [fetchUserConfig]);

	return { user, loading };
}

/**
 * タスクのアクションを使用
 * @returns タスクのアクション
 */
export function useUserSettingActions() {
	// stateはTaskState型のオブジェクト
	// アクションはuseTaskStoreの中で定義
	const fetchUserConfig = useUserSettingStore((state) => state.fetchUserConfig);
	const setUsingCharacterId = useUserSettingStore((state) => state.setUsingCharacterId);
	const setUserLanguage = useUserSettingStore((state) => state.setUserLanguage);

	return { fetchUserConfig, setUsingCharacterId, setUserLanguage };
}