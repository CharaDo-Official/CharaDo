// バックエンドとの通信を担当

import { invoke } from "@tauri-apps/api/core";
import type { TaskRaw, Importance, Status, Task } from "./types";

// Rustデータ -> TSデータ
function normalize(data: TaskRaw): Task {
	return {
		id: Number(data.id),
		title: String(data.title),
		description: String(data.description),
		due_date: data.due_date ? new Date(data.due_date) : null,
		created_date: new Date(data.created_date),
		out_cast_date: data.out_cast_date ? new Date(data.out_cast_date) : null,
		importance: data.importance as Importance,
		status: data.status as Status,
		display_order: Number(data.display_order),
	};
}

// 日付を YYYY-MM-DD 形式の文字列に変換するヘルパー関数
function toDateString(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

// TSデータ -> Rustデータ
function denormalize(data: Task): TaskRaw {
	return {
		id: Number(data.id),
		title: String(data.title),
		description: String(data.description),
		due_date: data.due_date ? toDateString(data.due_date) : null,
		created_date: toDateString(data.created_date),
		out_cast_date: data.out_cast_date ? toDateString(data.out_cast_date) : null,
		importance: data.importance as Importance,	
		status: data.status as Status,
		display_order: Number(data.display_order),
	};
}

/**
 * 全てのタスクを取得
 * @returns タスクの配列
 */
export async function getAllTasks(): Promise<Task[]> {
	// Rustから生データを取得
	const rawTasks: TaskRaw[] = await invoke("get_all_tasks");
	// 整形
	return rawTasks.map(normalize);
}

/**
 * 特定のタスクを取得
 * @param id タスクID
 * @returns タスク
 */
export async function getTask(id: number): Promise<Task | null> {
	const rawTask: TaskRaw | null = await invoke("get_task", { id });
	if (rawTask === null) {
		return null;
	}
	return normalize(rawTask);
}
	
/**
 * タスクを追加
 * @param task タスク
 * @returns 追加されたタスクID
 */
export async function addTask(task: Task): Promise<number> {
	return await invoke("add_task", { task: denormalize(task) });
}

/**
 * タスクを更新
 * @param task タスク
 */
export async function updateTask(task: Task): Promise<void> {
	await invoke("update_task", { task: denormalize(task) });
}

/**
 * タスクを削除
 * @param id タスクID
 */
export async function deleteTask(id: number): Promise<void> {
	await invoke("delete_task", { id });
}
