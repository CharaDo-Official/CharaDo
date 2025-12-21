// import styles from "./TaskView.module.css";
import React from "react";
import { useTasks, useTaskActions } from "@features/tasks/hooks";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";

const TaskView: React.FC = () => {
	const { tasks, loading } = useTasks();
	const { addTask, updateTask, deleteTask } = useTaskActions();

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="p-5 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-6 text-gray-800">Task Manager (Test UI)</h1>
			
			<div className="grid gap-8">
				<TaskForm onAdd={addTask} />
				<TaskList 
					tasks={tasks} 
					onUpdate={updateTask} 
					onDelete={deleteTask} 
				/>
			</div>
		</div>
	);
};

export default TaskView;
