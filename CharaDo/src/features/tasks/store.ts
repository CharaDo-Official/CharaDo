import { create } from "zustand";
import type { Task } from "./types";
import { fetchTasks } from "./api";

interface TaskState {
	tasks: Task[];
	loading: boolean;
	fetchTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
	tasks: [],
	loading: false,
	fetchTasks: async () => {
		set({ loading: true });
		const tasks = await fetchTasks();
		set({ tasks, loading: false });
	},
}));
