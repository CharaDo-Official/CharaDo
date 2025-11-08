import { useEffect } from "react";
import { useTaskStore } from "./store";

export function useTasks() {
	const { tasks, loading, fetchTasks } = useTaskStore();

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
