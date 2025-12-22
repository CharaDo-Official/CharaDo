import { create } from "zustand";
import type { Task } from "./types";
import * as api from "./api";

// 全体の状態を管理するための型
interface TaskState {
	tasks: Task[];
	loading: boolean;
	// Actions
	fetchTasks: () => Promise<void>;
	getTask: (id: number) => Promise<Task>;
	addTask: (task: Task) => Promise<void>;
	updateTask: (task: Task) => Promise<void>;
	deleteTask: (id: number) => Promise<void>;
}


/**
 * Reactからストアを使うためのフック
 * @param set 状態を更新するための関数
 * @param get 状態を取得するための関数
 * @returns タスクのストア
 */
export const useTaskStore = create<TaskState>((set, get) => ({
	tasks: [],
	loading: false,

	fetchTasks: async () => {
		set({ loading: true });
		try {
			const tasks = await api.getAllTasks();
			set({ tasks });
		} finally {
			set({ loading: false });
		}
	},

	getTask: async (id: number) => {
		set({ loading: true });
		try {
			const task = await api.getTask(id);
			return task;
		} finally {
			set({ loading: false });
		}
	},

	addTask: async (task: Task) => {
		set({ loading: true });
		try {
			await api.addTask(task);
			await get().fetchTasks();
		} finally {
			set({ loading: false });
		}
	},

	updateTask: async (task: Task) => {
		set({ loading: true });
		try {
			await api.updateTask(task);
			await get().fetchTasks();
		} finally {
			set({ loading: false });
		}
	},

	deleteTask: async (id: number) => {
		set({ loading: true });
		try {
			await api.deleteTask(id);
			await get().fetchTasks();
		} finally {
			set({ loading: false });
		}
	},
}));