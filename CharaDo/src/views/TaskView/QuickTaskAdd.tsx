import React, { useState } from "react";
import { type Task, type Status, ImportanceLevel } from "@features/tasks/types";

interface QuickTaskAddProps {
	status: Status;
	onAdd: (task: Task) => Promise<void>;
}

export const QuickTaskAdd: React.FC<QuickTaskAddProps> = ({ status, onAdd }) => {
	const [title, setTitle] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!title.trim()) return;

		try {
			const task: Task = {
				id: 0,
				title: title,
				description: "",
				importance: ImportanceLevel.Normal,
				status: status,
				due_date: null,
				created_date: new Date(),
				out_cast_date: null,
				display_order: 0,
			};
			await onAdd(task);
			setTitle("");
		} catch (e) {
			console.error("Failed to add task:", e);
			alert(`Failed to add task: ${e}`);
		}
	};

	return (
		<div
			className="mb-2"
			onMouseEnter={() => setIsFocused(true)}
			onMouseLeave={() => { if (!title) setIsFocused(false); }}
		>
			{!isFocused && !title ? (
				<div className="p-2 text-gray-400 bg-gray-50 rounded border border-dashed border-gray-300 cursor-text text-sm hover:bg-white hover:border-gray-400 transition-colors">
					+ {status}の追加
				</div>
			) : (
				<form onSubmit={handleSubmit} className="relative">
					<input
						autoFocus
						type="text"
						className="w-full p-2 pr-8 border border-blue-300 rounded shadow-sm focus:ring-2 focus:ring-blue-200 outline-none text-sm"
						placeholder={`${status}を入力...`}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onBlur={() => { if (!title) setIsFocused(false); }}
					/>
					<button
						type="submit"
						className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
						disabled={!title}
					>
					</button>
				</form>
			)}
		</div>
	);
};

