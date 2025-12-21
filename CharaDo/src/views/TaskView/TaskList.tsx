import React from "react";
import { type Task, type Importance, type Status, ImportanceLevelMap, StatusLevelMap } from "@features/tasks/types";

interface TaskListProps {
	tasks: Task[];
	onUpdate: (task: Task) => Promise<void>;
	onDelete: (id: number) => Promise<void>;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete }) => {

	const handleDelete = async (id: number) => {
		if (confirm("Are you sure?")) {
			try {
				await onDelete(id);
			} catch (e) {
				console.error("Failed to delete task:", e);
				alert(`Failed to delete task: ${e}`);
			}
		}
	};

	const handleStatusChange = async (task: Task, newStatus: Status) => {
		try {
			await onUpdate({ ...task, status: newStatus });
		} catch (e) {
			console.error("Failed to update status:", e);
			alert(`Failed to update status: ${e}`);
		}
	};

	const handleImportanceChange = async (task: Task, newImportance: Importance) => {
		try {
			await onUpdate({ ...task, importance: newImportance });
		} catch (e) {
			console.error("Failed to update importance:", e);
			alert(`Failed to update importance: ${e}`);
		}
	};

	return (
		<div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
			<h2 className="text-xl font-bold mb-4">Task List</h2>
			<ul className="space-y-3">
				{tasks.map(task => (
					<li key={task.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
						<div className="flex justify-between items-start mb-2">
							<div>
								<strong className="text-lg">{task.title}</strong>
								<span className="ml-2 text-gray-600 text-sm">{task.description}</span>
							</div>
							<button
								onClick={() => handleDelete(task.id)}
								className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
							>
								Delete
							</button>
						</div>

						<div className="text-sm text-gray-500 mb-2">
							<span>Created: {task.created_date.toLocaleDateString()}</span>
							{task.due_date && <span> | Due: {task.due_date.toLocaleDateString()}</span>}
						</div>

						<div className="flex items-center gap-4 text-sm">
							<div className="flex items-center gap-2">
								<label className="font-medium text-gray-700">Status:</label>
								<select
									className="p-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-white"
									value={task.status}
									onChange={(e) => handleStatusChange(task, e.target.value as Status)}
								>
									{(Object.entries(StatusLevelMap) as [Status, string][]).map(([key, label]) => (
										<option key={key} value={key}>{label}</option>
									))}
								</select>
							</div>

							<div className="flex items-center gap-2">
								<label className="font-medium text-gray-700">Importance:</label>
								<select
									className="p-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-white"
									value={task.importance}
									onChange={(e) => handleImportanceChange(task, e.target.value as Importance)}
								>
									{(Object.entries(ImportanceLevelMap) as [Importance, string][]).map(([key, label]) => (
										<option key={key} value={key}>{label}</option>
									))}
								</select>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

