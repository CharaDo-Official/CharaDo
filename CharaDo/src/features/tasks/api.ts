import { invoke } from "@tauri-apps/api/core";
import type { TaskRaw, Importance, Status, Task } from "./types";

// 生データ -> 整形データ
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

// 整形データ -> 生データ
function denormalize(data: Task): TaskRaw {
	return {
		id: Number(data.id),
		title: String(data.title),
		description: String(data.description),
		due_date: data.due_date ? data.due_date.toISOString() : "",
		created_date: data.created_date.toISOString(),
		out_cast_date: data.out_cast_date ? data.out_cast_date.toISOString() : "",
		importance: data.importance as Importance,
		status: data.status as Status,
		display_order: Number(data.display_order),
	};
}

export async function fetchTasks(): Promise<Task[]> {
	// Rustから生データを取得
	const rawTasks: TaskRaw[] = await invoke("get_all_tasks");
	// 整形
	return rawTasks.map(normalize);
}

export async function addTask(task: Task): Promise<void> {
	await invoke("add_task", { task: denormalize(task) });
}

export async function updateTask(task: Task): Promise<void> {
	await invoke("update_task", { task: denormalize(task) });
}

export async function deleteTask(id: number): Promise<void> {
	await invoke("delete_task", { id });
}
