import { invoke } from "@tauri-apps/api/core";
import type { TaskRaw, Importance, Status, Task } from "./types";

export async function fetchTasks(): Promise<Task[]> {
	// Rustから生データを取得
	const rawTasks: TaskRaw[] = await invoke("get_all_tasks");
	// 整形
	return rawTasks.map(data => ({

		id: Number(data.id),
		title: String(data.title),
		description: String(data.description),
		due_date: data.due_date ? new Date(data.due_date) : null,
		created_date: new Date(data.created_date),
		out_cast_date: data.out_cast_date ? new Date(data.out_cast_date) : null,
		importance: data.importance as Importance,
		status: data.status as Status,
		display_order: Number(data.display_order),
	}));
}
