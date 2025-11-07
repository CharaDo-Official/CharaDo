import { useState } from "react";
import { info } from "@tauri-apps/plugin-log";
import TabBar from "./components/layout/TabBar";
import TaskView from "./views/taskView";
import DebugView from "./views/DebugView";



async function test () {
	info("test button clicked");
}

function App() {
	const [activeTab, setActiveTab] = useState<"task" | "debug">("task");

	return (
		<div>
			<TabBar active={activeTab} onChange={setActiveTab} />
			<main>
				{activeTab === "task" && <TaskView />}
				{activeTab === "debug" && <DebugView />}
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
