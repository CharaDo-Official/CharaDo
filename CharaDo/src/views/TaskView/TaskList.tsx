import React from "react";
import { type Task } from "@features/tasks/types";

interface TaskListProps {
	tasks: Task[];
	onTaskClick: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick }) => {
	return (
		<ul className="space-y-2">
			{tasks.map(task => (
				<li
					key={task.id}
					onClick={() => onTaskClick(task)}
					className="bg-white p-3 rounded shadow-sm border border-gray-200 cursor-pointer hover:border-orange-400 hover:shadow-md transition-all group relative"
				>
					<div className="flex justify-between items-start">
						<span className="font-medium text-gray-800 line-clamp-2">{task.title}</span>
						{/* 重要度アイコン (簡易) */}
						<div className="flex text-yellow-400 text-xs">
							{task.importance === "Crucial" && "★★★"}
							{task.importance === "Important" && "★★"}
							{task.importance === "Normal" && "★"}
						</div>
					</div>

					{task.due_date && (
						<div className={`text-xs mt-2 flex items-center gap-1 ${new Date() > task.due_date ? "text-red-500 font-bold" : "text-gray-500"
						}`}>
							📅 {task.due_date.toLocaleDateString()}
						</div>
					)}

					{/* 編集アイコン (ホバー時のみ表示したりするが、今は常に簡易表示) */}
					<div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<span className="text-gray-400 text-xs">✎</span>
					</div>
				</li>
			))}
		</ul>
	);
};
