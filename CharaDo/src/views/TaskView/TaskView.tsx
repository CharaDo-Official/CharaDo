// import styles from "./TaskView.module.css";
import { useState } from "react";
import { useTasks, useTaskActions } from "@features/tasks/hooks";
import { type Task, type Importance, type Status, ImportanceLevelMap, StatusLevelMap, ImportanceLevel, StatusLevel } from "@features/tasks/types";

const TaskView: React.FC = () => {
	const { tasks, loading } = useTasks();
	const { addTask, updateTask, deleteTask } = useTaskActions();

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

	const handleAdd = async () => {
		try {
			const task: Task = {
				id: 0, // Backend should handle ID generation usually, or we might need a better strategy if not. 
				// Assuming 0 is ignored/overwritten by backend logic for creation.
				title: newTask.title,
				description: newTask.description,
				importance: newTask.importance,
				status: newTask.status,
				due_date: newTask.due_date ? new Date(newTask.due_date) : null,
				created_date: new Date(),
				out_cast_date: null,
				display_order: 0,
			};
			await addTask(task);
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

	const handleDelete = async (id: number) => {
		if (confirm("Are you sure?")) {
			try {
				await deleteTask(id);
			} catch (e) {
				console.error("Failed to delete task:", e);
				alert(`Failed to delete task: ${e}`);
			}
		}
	};

	const handleStatusChange = async (task: Task, newStatus: Status) => {
		try {
			await updateTask({ ...task, status: newStatus });
		} catch (e) {
			console.error("Failed to update status:", e);
			alert(`Failed to update status: ${e}`);
		}
	};

	const handleImportanceChange = async (task: Task, newImportance: Importance) => {
		try {
			await updateTask({ ...task, importance: newImportance });
		} catch (e) {
			console.error("Failed to update importance:", e);
			alert(`Failed to update importance: ${e}`);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div style={{ padding: "20px" }}>
			<h1>Task Manager (Test UI)</h1>
			
			<div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
				<h2>Add New Task</h2>
				<div style={{ marginBottom: "10px" }}>
					<label>Title: </label>
					<input 
						value={newTask.title} 
						onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
					/>
				</div>
				<div style={{ marginBottom: "10px" }}>
					<label>Description: </label>
					<input 
						value={newTask.description} 
						onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
					/>
				</div>
				<div style={{ marginBottom: "10px" }}>
					<label>Importance: </label>
					<select 
						value={newTask.importance} 
						onChange={(e) => setNewTask({ ...newTask, importance: e.target.value as Importance })}
					>
						{(Object.entries(ImportanceLevelMap) as [Importance, string][]).map(([key, label]) => (
							<option key={key} value={key}>{label}</option>
						))}
					</select>
				</div>
				<div style={{ marginBottom: "10px" }}>
					<label>Status: </label>
					<select 
						value={newTask.status} 
						onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Status })}
					>
						{(Object.entries(StatusLevelMap) as [Status, string][]).map(([key, label]) => (
							<option key={key} value={key}>{label}</option>
						))}
					</select>
				</div>
				<div style={{ marginBottom: "10px" }}>
					<label>Due Date: </label>
					<input 
						type="date"
						value={newTask.due_date} 
						onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} 
					/>
				</div>
				<button onClick={handleAdd}>Add Task</button>
			</div>

			<h2>Task List</h2>
			<ul>
				{tasks.map(task => (
					<li key={task.id} style={{ marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
						<strong>{task.title}</strong> - {task.description}
						<br />
						<span>Created: {task.created_date.toLocaleDateString()}</span>
						{task.due_date && <span> | Due: {task.due_date.toLocaleDateString()}</span>}
						<br />
						<label>Status: </label>
						<select 
							value={task.status} 
							onChange={(e) => handleStatusChange(task, e.target.value as Status)}
						>
							{(Object.entries(StatusLevelMap) as [Status, string][]).map(([key, label]) => (
								<option key={key} value={key}>{label}</option>
							))}
						</select>
						
						<label style={{ marginLeft: "10px" }}>Importance: </label>
						<select 
							value={task.importance} 
							onChange={(e) => handleImportanceChange(task, e.target.value as Importance)}
						>
							{(Object.entries(ImportanceLevelMap) as [Importance, string][]).map(([key, label]) => (
								<option key={key} value={key}>{label}</option>
							))}
						</select>

						<button onClick={() => handleDelete(task.id)} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TaskView;
