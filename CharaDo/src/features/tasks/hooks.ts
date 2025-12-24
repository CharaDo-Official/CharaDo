// フロントとの窓口

import { useEffect } from "react";
import { useTaskStore } from "./store";

/**
 * コンポーネントがマウントされた時にデータを取得
 * @returns タスクの配列とローディング状態
 */
export function useTasks() {
	const { tasks, loading, fetchTasks } = useTaskStore();


	// 初回マウント時にデータ取得
	// useEffect: 副作用を扱うためのフック
	// [] 内の変数が、前回レンダリング時から変化したときに実行される
	// [] が空の場合、コンポーネントのマウント時に一度だけ実行される

	// 今回の場合では、常にfetchTasks関数が同じ参照を持つため、最初の一回だけ実行される
	// fetchTasks関数を入れてるのは、useEffect の依存配列に使う値は「中で使っている値すべて」を入れる原則によるもの
	// なくても問題はないが、ESLintのルールに引っかかる
	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	return { tasks, loading };
}


// アクションだけを使いたい場合（ボタンなど）
/**
 * タスクのアクションを使用
 * @returns タスクのアクション
 */
export function useTaskActions() {
	// stateはTaskState型のオブジェクト
	// アクションはuseTaskStoreの中で定義
	const fetchTasks = useTaskStore((state) => state.fetchTasks);
	const getTask = useTaskStore((state) => state.getTask);
	const addTask = useTaskStore((state) => state.addTask);
	const updateTask = useTaskStore((state) => state.updateTask);
	const deleteTask = useTaskStore((state) => state.deleteTask);

	return { fetchTasks, getTask, addTask, updateTask, deleteTask };
}