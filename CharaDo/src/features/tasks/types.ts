// Rust側から返される生データ
import type { Importance, Status, Task as TaskRaw } from "@bindings/task";
export type { TaskRaw };

// Rust側のenum型はそのまま再エクスポート
export type { Importance, Status };

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
