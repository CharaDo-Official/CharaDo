import { invoke } from "@tauri-apps/api/core";
import { debug, warn } from "@tauri-apps/plugin-log";
import { useEffect } from "react";
import {Task} from "@bindings/task";

function TaskTest() {
	useEffect(() => {
		invoke("get_all_tasks")
			.then((tasks) => {
				const taskList = tasks as Task[];
				debug(`Fetched ${taskList.length} tasks:`);
				taskList.forEach((task) => {
					debug(`- [${task.id}] ${task.title} (created_date: ${task.created_date})`);
				});
			})
			.catch((error) => warn(error));
	}, []); // ← 空依存配列により初回マウント時のみ実行

	return (
		<div>
			<h2>Task Test Component</h2>
			<p>Check the console for fetched tasks.</p>

		</div>
	);
}

export default TaskTest;
