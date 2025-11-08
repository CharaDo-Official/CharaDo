// import styles from "./TaskView.module.css";
import { useTasks } from "@features/tasks/hooks";

const TaskView: React.FC = () => {
	const { tasks, loading } = useTasks();

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>Task List</h1>
			<ul>
				{tasks.map(task => (
					<li key={task.id}>{task.title} <span>{task.description}</span> <span>{task.status}</span> <span>{task.importance}</span> <span>{task.created_date.toLocaleDateString()}</span> <span>{task.due_date?.toLocaleDateString()}</span></li>
				))}
			</ul>
		</div>
	);
};

export default TaskView;