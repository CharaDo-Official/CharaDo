import "./App.css";
import { info } from "@tauri-apps/plugin-log";
import TaskTest from "./test";


async function test () {
	info("test button clicked");
}

function App() {

	return (
		<div>
			<h1>Hello World!</h1>
			<p>かわいいキャラクターがあなたのタスクを管理してくれる、可愛い×ToDoアプリ！</p>
			<button onClick={test}>
				Click me
			</button>
			<TaskTest />
		</div>
	);
}

export default App;
