import React, { useState, useEffect } from "react";
import { type Task, type Importance, type Status, ImportanceLevelMap, StatusLevelMap } from "@features/tasks/types";

interface TaskDetailModalProps {
	task: Task;
	isOpen: boolean;
	onClose: () => void;
	onSave: (task: Task) => Promise<void>;
	onDelete: (id: number) => Promise<void>;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
	task: initialTask,
	isOpen,
	onClose,
	onSave,
	onDelete
}) => {
	const [editingTask, setEditingTask] = useState<Task>(initialTask);

	// モーダルが開かれたとき、または初期タスクが変わったときにstateをリセット
	useEffect(() => {
		setEditingTask(initialTask);
	}, [initialTask, isOpen]);

	if (!isOpen) return null;

	const handleSave = async () => {
		try {
			await onSave(editingTask);
			onClose();
		} catch (e) {
			console.error("Failed to save task:", e);
			alert(`Failed to save task: ${e}`);
		}
	};

	const handleDelete = async () => {
		if (confirm("本当に削除しますか？")) {
			try {
				await onDelete(editingTask.id);
				onClose();
			} catch (e) {
				console.error("Failed to delete task:", e);
				alert(`Failed to delete task: ${e}`);
			}
		}
	};

	// 日付input用のフォーマット変換 (YYYY-MM-DD)
	const dateValue = editingTask.due_date
		? editingTask.due_date.toISOString().split("T")[0]
		: "";

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setEditingTask({
			...editingTask,
			due_date: val ? new Date(val) : null
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
			{/* Modal Content */}
			<div className="bg-[#FFF8F0] w-[600px] max-w-[90vw] rounded-lg shadow-xl p-6 relative flex flex-col gap-4" onClick={e => e.stopPropagation()}>

				{/* Header: Title and Status label */}
				<div className="flex justify-between items-center border-b border-orange-200 pb-2">
					<h2 className="text-xl font-bold text-gray-800">
						{StatusLevelMap[editingTask.status]}の編集
					</h2>
					<button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
				</div>

				{/* Task Name */}
				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1">タスク名*</label>
					<input
						type="text"
						className="w-full p-2 border border-orange-300 rounded focus:ring-2 focus:ring-orange-400 outline-none bg-white"
						placeholder="タスク名を入力する"
						value={editingTask.title}
						onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
					/>
				</div>

				{/* Memo */}
				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1">メモ</label>
					<textarea
						className="w-full p-2 border border-orange-300 rounded focus:ring-2 focus:ring-orange-400 outline-none h-24 bg-white resize-none"
						placeholder="メモを入力する"
						value={editingTask.description}
						onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
					/>
				</div>

				{/* Due Date */}
				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1">締切</label>
					<input
						type="date"
						className="w-full p-2 border border-orange-300 rounded focus:ring-2 focus:ring-orange-400 outline-none bg-white"
						value={dateValue}
						onChange={handleDateChange}
					/>
				</div>

				{/* Importance Radio */}
				<div>
					<label className="block text-sm font-bold text-gray-700 mb-2">重要度</label>
					<div className="flex gap-2">
						{(Object.entries(ImportanceLevelMap) as [Importance, string][]).map(([key, label]) => (
							<button
								key={key}
								onClick={() => setEditingTask({ ...editingTask, importance: key })}
								className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${editingTask.importance === key
									? "bg-orange-100 border-orange-500 text-orange-800 ring-1 ring-orange-500"
									: "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
								}`}
							>
								{label}
							</button>
						))}
					</div>
				</div>

				{/* Status Radio */}
				<div>
					<label className="block text-sm font-bold text-gray-700 mb-2">ステータス</label>
					<div className="flex gap-2 flex-wrap">
						{(Object.entries(StatusLevelMap) as [Status, string][]).map(([key, label]) => (
							<button
								key={key}
								onClick={() => setEditingTask({ ...editingTask, status: key })}
								className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${editingTask.status === key
									? "bg-orange-100 border-orange-500 text-orange-800 ring-1 ring-orange-500"
									: "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
								}`}
							>
								{label}
							</button>
						))}
					</div>
				</div>

				{/* Footer Buttons */}
				<div className="flex justify-between items-center mt-4 pt-4 border-t border-orange-200">
					<button
						onClick={handleDelete}
						className="px-4 py-2 text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 rounded transition-colors"
					>
						削除する
					</button>
					<div className="flex gap-2">
						<button
							onClick={onClose}
							className="px-6 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded font-bold transition-colors"
						>
							キャンセル
						</button>
						<button
							onClick={handleSave}
							disabled={!editingTask.title.trim()}
							className={`px-8 py-2 text-white rounded font-bold shadow-md transition-all ${!editingTask.title.trim()
								? "bg-gray-400 cursor-not-allowed"
								: "bg-orange-500 hover:bg-orange-600 hover:shadow-lg"
							}`}
						>
							保存
						</button>
					</div>
				</div>

			</div>
		</div>
	);
};

