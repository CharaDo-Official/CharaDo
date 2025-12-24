import { safeInvoke } from "@lib/api-client";
import type { AddonType } from "./types";

/**
 * 所持しているアドオンを取得
 * @returns 所持しているアドオンの配列
 */
export async function getOwnedAddons(): Promise<AddonType[]> {
	return await safeInvoke<AddonType[]>("get_owned_addons");
}