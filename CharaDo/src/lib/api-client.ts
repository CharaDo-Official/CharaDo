// src/lib/api-client.ts
import { invoke, InvokeArgs } from "@tauri-apps/api/core";
import type { UserError } from "@bindings/user_error"; // bindingされた型

/**
 * UserErrorのtypeの型
 */
export type UserErrorType = UserError["type"];

/**
 * UserErrorのtypeの定数オブジェクト
 */
// satisfy を使うことで、キーや値が UserErrorType に適合しているかチェックされる プロパティはstring型
// as const: readonly
export const ERROR_TYPE = {
	Validation: "ValidationError",
	NotFound: "NotFoundError",
	Store: "StoreError",
	Poison: "PoisonError",
	Io: "IoError",
	Parse: "ParseError",
	WinApi: "WinApiError",
} as const satisfies Record<string, UserErrorType>;

// アプリケーション内で扱う統一エラー型
export class AppError extends Error {
	public readonly type: UserError["type"];

	constructor(error: UserError) {
		super(error.message);
		this.name = "AppError";
		this.type = error.type;
	}
}

/**
 * Tauriのinvokeをラップし、エラーをAppError型に変換して再スローする
 * @param command コマンド名
 * @param args 引数
 * @returns 結果
 */
export async function safeInvoke<T>(command: string, args?: InvokeArgs): Promise<T> {
	try {
		return await invoke<T>(command, args);
	} catch (error: UserError | unknown) {
		if (isUserError(error)) {
			throw new AppError(error);
		}
		throw new Error(`Unexpected system error occurred: ${error}`);
	}
}

/**
 * Rustのエラーオブジェクトかどうかを判定する型ガード
 * @param error エラー
 * @returns エラーがUserError型かどうか
 */
export function isUserError(error: unknown): error is UserError {
	if (typeof error !== "object" || error === null) return false;
	const e = error as Record<string, unknown>;
	return "type" in e && "message" in e && typeof e.message === "string";
}