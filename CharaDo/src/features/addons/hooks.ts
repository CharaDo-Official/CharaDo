import { useEffect } from "react";
import { useAddonStore } from "./store";

/**
 * 所持しているアドオンを取得
 * @returns 所持しているアドオンの配列とローディング状態
 */
export function useAddons() {
	const { addons, loading, fetchAddons } = useAddonStore();

	useEffect(() => {
		fetchAddons();
	}, [fetchAddons]);

	return { addons, loading };
}