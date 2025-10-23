import "./App.css";
import { info } from "@tauri-apps/plugin-log";


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
		</div>
	);
}

export default App;
