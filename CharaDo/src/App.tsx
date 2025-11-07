import { useState } from "react";
import "./App.css";
import { info } from "@tauri-apps/plugin-log";
import TabBar from "./components/layout/TabBar";



async function test () {
	info("test button clicked");
}

function App() {
	const [activeTab, setActiveTab] = useState<"task" | "debug">("task");

	return (
		<div>
			<TabBar active={activeTab} onChange={setActiveTab} />
			<main>
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
