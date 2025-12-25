import { safeInvoke } from "@lib/api-client";
import type { User, Language } from "./types";

/**
 * ユーザー設定を取得
 * @returns ユーザー設定
 */
export async function getUserConfig(): Promise<User> {
	return await safeInvoke<User>("get_user_config");
}

/**
 * 使用中キャラクターIDを設定
 * @param characterId キャラクターID
 * @param isStandard 標準キャラクターかどうか
 */
export async function setUsingCharacterId(characterId: number, isStandard: boolean): Promise<void> {
	return await safeInvoke<void>("set_using_character_id", { characterId, isStandard });
}

/**
 * 言語を設定
 * @param language 言語
 */
export async function setUserLanguage(language: Language): Promise<void> {
	return await safeInvoke<void>("set_user_language", { language });
}