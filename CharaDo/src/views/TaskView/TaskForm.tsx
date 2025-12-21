import React, { useState } from "react";
import { type Task, type Importance, type Status, ImportanceLevelMap, StatusLevelMap, ImportanceLevel, StatusLevel } from "@features/tasks/types";

interface TaskFormProps {
	onAdd: (task: Task) => Promise<void>;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
	const [newTask, setNewTask] = useState<{
		title: string;
		description: string;
		importance: Importance;
		status: Status;
		due_date: string;
	}>({
		title: "",
		description: "",
		importance: ImportanceLevel.Normal,
		status: StatusLevel.ToDo,
		due_date: "",
	});

	const handleSubmit = async () => {
		try {
			const task: Task = {
				id: 0,
				title: newTask.title,
				description: newTask.description,
				importance: newTask.importance,
				status: newTask.status,
				due_date: newTask.due_date ? new Date(newTask.due_date) : null,
				created_date: new Date(),
				out_cast_date: null,
				display_order: 0,
			};
			await onAdd(task);
			setNewTask({
				title: "",
				description: "",
				importance: ImportanceLevel.Normal,
				status: StatusLevel.ToDo,
				due_date: "",
			});
		} catch (e) {
			console.error("Failed to add task:", e);
			alert(`Failed to add task: ${e}`);
		}
	};

	return (
		<div className="border border-gray-300 p-4 mb-5 rounded-md bg-white shadow-sm">
			<h2 className="text-xl font-bold mb-4">Add New Task</h2>
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700 mb-1">Title: </label>
				<input
					className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					value={newTask.title}
					onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
				/>
			</div>
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700 mb-1">Description: </label>
				<input
					className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					value={newTask.description}
					onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
				/>
			</div>
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700 mb-1">Importance: </label>
				<select
					className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
					value={newTask.importance}
					onChange={(e) => setNewTask({ ...newTask, importance: e.target.value as Importance })}
				>
					{(Object.entries(ImportanceLevelMap) as [Importance, string][]).map(([key, label]) => (
						<option key={key} value={key}>{label}</option>
					))}
				</select>
			</div>
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700 mb-1">Status: </label>
				<select
					className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
					value={newTask.status}
					onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Status })}
				>
					{(Object.entries(StatusLevelMap) as [Status, string][]).map(([key, label]) => (
						<option key={key} value={key}>{label}</option>
					))}
				</select>
			</div>
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700 mb-1">Due Date: </label>
				<input
					type="date"
					className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					value={newTask.due_date}
					onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
				/>
			</div>
			<button
				className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
				onClick={handleSubmit}
			>
				Add Task
			</button>
		</div>
	);
};

