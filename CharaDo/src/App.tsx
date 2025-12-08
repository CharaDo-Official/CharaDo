import "./App.css";
import { info } from "@tauri-apps/plugin-log";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
	const [appInfo, setAppInfo] = useState(null);
	const [loading, setLoading] = useState(false);

	async function test () {
		info("test button clicked");
	}

	async function getAppInfo() {
		setLoading(true);
		try {
			// 型を any にして生のレスポンスを受け取る
			const data = await invoke<any>("get_store_info");
			setAppInfo(data);
			await info("store app info fetched");
			console.log("App Info:", data);
		} catch (error) {
			// 詳細を全部出力する（DevTools と端末）
			console.error("Error fetching app info (raw):", error);
			console.dir(error);
			try {
				// Error オブジェクトの非列挙プロパティも含めて文字列化
				const snap = JSON.stringify(error, Object.getOwnPropertyNames(error));
				console.log("Error JSON snapshot:", snap);
			} catch (e) {
				console.warn("stringify error failed:", e);
			}
			await info(`get_store_info error: ${String(error)}`);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<h1>Hello World!</h1>
			<p>かわいいキャラクターがあなたのタスクを管理してくれる、可愛い×ToDoアプリ！</p>
			<button onClick={test}>
				Click me
			</button><br></br>
			<button onClick={getAppInfo} disabled={loading}>
				{loading ? "Loading..." : "Get Store App Info"}
			</button>
			{appInfo && (
				<pre style={{ marginTop: 12, padding: 8, border: "1px solid #ccc", borderRadius: 6 }}>
					{JSON.stringify(appInfo, null, 2)}
				</pre>
			)}
		</div>
	);
}

export default App;
