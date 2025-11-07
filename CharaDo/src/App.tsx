import { info } from "@tauri-apps/plugin-log";
import { useTab } from "@hooks/useTab";
import { TabKey } from "@config/tabs";
import TabBar from "@components/layout/TabBar";
import TaskView from "@views/TaskView";
import DebugView from "@views/DebugView";



async function test() {
	info("test button clicked");
}

function App() {
	const { activeTab, selectTab } = useTab("task");

	const renderView = (tab: TabKey) => {
		switch (tab) {
		case "task":
			return <TaskView />;
		case "debug":
			return <DebugView />;
		}
	};

	return (
		<div>
			<TabBar active={activeTab} onChange={selectTab} />
			<main>
				{renderView(activeTab)}
			</main>
			<h1>Hello World!</h1>
			<p>かわいいキャラクターがあなたのタスクを管理してくれる、可愛い×ToDoアプリ！</p>
			<button onClick={test}>
				Click me
			</button>
		</div>
	);
}

export default App;
