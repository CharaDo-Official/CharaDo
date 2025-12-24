// Rust側から返される生データ
import type { Importance, Status, Task as TaskRaw } from "@bindings/task";
export type { TaskRaw };

// Rust側のenum型はそのまま再エクスポート
export type { Importance, Status };

// フロントで扱う整形後の型
export const ImportanceLevel = {
	Unimportant: "Unimportant",
	Normal: "Normal",
	Important: "Important",
	Crucial: "Crucial",
} as const satisfies Record<string, Importance>;

export const StatusLevel = {
	ToDo: "ToDo",
	Waiting: "Waiting",
	WantDo: "WantDo",
	Doing: "Doing",
} as const satisfies Record<string, Status>;

// 日本語版マップ
export const ImportanceLevelMap: Record<Importance, string> = {
	[ImportanceLevel.Unimportant]: "まあまあ",
	[ImportanceLevel.Normal]: "ふつう",
	[ImportanceLevel.Important]: "そこそこ",
	[ImportanceLevel.Crucial]: "だいじ",
};

export const StatusLevelMap: Record<Status, string> = {
	[StatusLevel.ToDo]: "ToDo",
	[StatusLevel.Waiting]: "相手待ち",
	[StatusLevel.WantDo]: "やりたいこと",
	[StatusLevel.Doing]: "進行中",
};

// フロントで扱う整形後の型
export interface Task {
	/**
	 * タスクID
	 */
	id: number,
	/**
	 * タイトル
	 */
	title: string,
	/**
	 * 説明
	 */
	description: string,
	/**
	 * 締め切り日
	 */
	due_date: Date | null,
	/**
	 * 作成日
	 */
	created_date: Date,
	/**
	 * 提案から外れた日
	 */
	out_cast_date: Date | null,
	/**
	 * 重要度
	 */
	importance: Importance,
	/**
	 * ステータス
	 */
	status: Status,
	/**
	 * 表示順
	 */
	display_order: number,
}
