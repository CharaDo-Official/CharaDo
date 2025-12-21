import React from "react";
import { type Task, type Status, StatusLevelMap } from "@features/tasks/types";
import { QuickTaskAdd } from "./QuickTaskAdd";
import { TaskList } from "./TaskList";

interface TaskColumnProps {
	status: Status;
	tasks: Task[];
	onAdd?: (task: Task) => Promise<void>;
	onTaskClick: (task: Task) => void;
	bgColor?: string;
	showAddForm?: boolean;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
	status,
	tasks,
	onAdd,
	onTaskClick,
	bgColor = "bg-gray-100",
	showAddForm = true
}) => {
	return (
		<div className={`flex flex-col h-full rounded-lg overflow-hidden ${bgColor}`}>
			<div className="p-2 font-bold text-center text-gray-700 border-b border-gray-200/50 bg-white/30 backdrop-blur-sm">
				{StatusLevelMap[status]}
			</div>

			<div className="flex-1 p-2 overflow-y-auto min-h-[300px]">
				{showAddForm && onAdd && (
					<QuickTaskAdd status={status} onAdd={onAdd} />
				)}

				<TaskList
					tasks={tasks}
					onTaskClick={onTaskClick}
				/>
			</div>
		</div>
	);
};
