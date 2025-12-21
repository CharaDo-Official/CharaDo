import React, { useState } from "react";
import { useTasks, useTaskActions } from "@features/tasks/hooks";
import { TaskColumn } from "./TaskColumn";
import { StatusLevel, type Task } from "@features/tasks/types";
import { TaskDetailModal } from "./TaskDetailModal";

const TaskView: React.FC = () => {
	const { tasks, loading } = useTasks();
	const { addTask, updateTask, deleteTask } = useTaskActions();
	
	// Modal State
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleTaskClick = (task: Task) => {
		setSelectedTask(task);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedTask(null);
	};

	if (loading) {
		return <div className="p-10 text-center text-gray-500">Loading tasks...</div>;
	}

	// Statusごとにタスクを分類
	const todoTasks = tasks.filter(t => t.status === StatusLevel.ToDo);
	const waitingTasks = tasks.filter(t => t.status === StatusLevel.Waiting);
	const wantDoTasks = tasks.filter(t => t.status === StatusLevel.WantDo);
	const doingTasks = tasks.filter(t => t.status === StatusLevel.Doing);

	return (
		<div className="h-screen w-full bg-[#FFE4C4] p-4 overflow-hidden flex flex-col">
			
			<div className="flex-1 grid grid-cols-4 gap-4 h-full">
				{/* 1. ToDo List */}
				<TaskColumn 
					status={StatusLevel.ToDo} 
					tasks={todoTasks} 
					onAdd={addTask} 
					onTaskClick={handleTaskClick}
					bgColor="bg-gray-100"
				/>

				{/* 2. Waiting List */}
				<TaskColumn 
					status={StatusLevel.Waiting} 
					tasks={waitingTasks} 
					onAdd={addTask} 
					onTaskClick={handleTaskClick}
					bgColor="bg-gray-200"
				/>

				{/* 3. Doing List (Top Right) & 4. Suggestion (Top Right End) */}
				<div className="flex flex-col gap-4">
					<div className="flex-1">
						<TaskColumn 
							status={StatusLevel.Doing} 
							tasks={doingTasks} 
							onAdd={addTask} 
							onTaskClick={handleTaskClick}
							bgColor="bg-gray-100"
						/>
					</div>
					
					<div className="flex-1">
						<TaskColumn 
							status={StatusLevel.WantDo} 
							tasks={wantDoTasks} 
							onAdd={addTask} 
							onTaskClick={handleTaskClick}
							bgColor="bg-gray-200"
						/>
					</div>
				</div>

				{/* 4. Suggestion / Character Area */}
				<div className="flex flex-col h-full gap-4">
					<div className="h-1/3 bg-white/50 rounded-lg p-2 border border-blue-200">
						<div className="text-center font-bold text-gray-600 mb-2">提案</div>
						<div className="text-sm text-center text-gray-400">No suggestions</div>
					</div>

					<div className="flex-1 relative">
						<div className="absolute bottom-0 right-0 w-full h-full flex items-end justify-center">
							<img 
								src="/character_placeholder.png" 
								alt="Character" 
								className="max-h-full object-contain opacity-80"
								onError={(e) => {
									e.currentTarget.style.display = "none";
									e.currentTarget.parentElement!.innerHTML = "<div class='text-4xl'>🐱</div>";
								}}
							/>
						</div>
						<div className="absolute top-0 right-0 bg-white p-3 rounded-2xl rounded-tr-none shadow-lg border border-gray-200 m-4 max-w-[200px]">
							<p className="text-sm text-gray-700">お仕事がんばってね</p>
						</div>
					</div>
				</div>
			</div>

			{/* Task Detail Modal */}
			{selectedTask && (
				<TaskDetailModal 
					task={selectedTask}
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					onSave={updateTask}
					onDelete={deleteTask}
				/>
			)}
		</div>
	);
};

export default TaskView;
