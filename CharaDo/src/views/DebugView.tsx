import { invoke } from "@tauri-apps/api/core";
import { info } from "@tauri-apps/plugin-log";
import { useState } from "react";

const DebugView: React.FC = () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [appInfo, setAppInfo] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	async function testLog() {
		await info("DebugView: test button clicked");
	}

	async function getStoreInfo() {
		setLoading(true);
		try {
			// 型を any にして生のレスポンスを受け取る
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const data = await invoke<any>("get_store_info");
			setAppInfo(data);
			await info("DebugView: store app info fetched");
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

	async function getStoreAddons() {
		setLoading(true);
		try {
			// 型を any にして生のレスポンスを受け取る
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const data = await invoke<any>("get_store_addons");
			setAppInfo(data);
			await info("DebugView: store addons fetched");
			console.log("Store AddOns:", data);
		} catch (error) {
			// 詳細を全部出力する（DevTools と端末）
			console.error("Error fetching store addons (raw):", error);
			console.dir(error);
			try {
				// Error オブジェクトの非列挙プロパティも含めて文字列化
				const snap = JSON.stringify(error, Object.getOwnPropertyNames(error));
				console.log("Error JSON snapshot:", snap);
			} catch (e) {
				console.warn("stringify error failed:", e);
			}
			await info(`get_store_addons error: ${String(error)}`);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<h2>Debug View</h2>
			<video
				src="http://assets.localhost/tumugi/達成時.webm"
				controls
				width="300"
			/>
			<img src="http://assets.localhost/tumugi/thumbnail.png" alt="紬" />
			<div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
				<button onClick={testLog}>
					Test Log
				</button><br></br>
				<button onClick={getStoreInfo} disabled={loading}>
					{loading ? "Loading..." : "Get Store App Info"}
				</button><br></br>
				<button onClick={getStoreAddons} disabled={loading}>
					{loading ? "Loading..." : "Get Store AddOns"}
				</button><br></br>
			</div>

			{appInfo && (
				<div style={{ textAlign: "left" }}>
					<h3>Result:</h3>
					<pre style={{
						marginTop: 12,
						padding: 8,
						border: "1px solid #ccc",
						borderRadius: 6,
						backgroundColor: "#f5f5f5",
						color: "#333",
						overflowX: "auto"
					}}>
						{JSON.stringify(appInfo, null, 2)}
					</pre>
				</div>
			)}
		</div>
	);
};

export default DebugView;
