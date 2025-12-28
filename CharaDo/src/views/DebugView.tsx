import { invoke } from "@tauri-apps/api/core";
import { info } from "@tauri-apps/plugin-log";
import { useState } from "react";

const DebugView: React.FC = () => {
	const [appInfo, setAppInfo] = useState<any>(null);
	const [addons, setAddons] = useState<any>(null); // アドオン専用のステート
	const [loadingInfo, setLoadingInfo] = useState(false); // アプリ情報用
	const [loadingAddons, setLoadingAddons] = useState(false); // アドオン用

	async function getStoreInfo() {
		setLoadingInfo(true);
		try {
			const data = await invoke<any>("get_store_info");
			setAppInfo(data);
			await info("DebugView: store app info fetched");
		} catch (error) {
			console.error("Error fetching app info:", error);
		} finally {
			setLoadingInfo(false);
		}
	}

	async function getStoreAddons() {
		setLoadingAddons(true);
		try {
			const data = await invoke<any>("get_store_addons");
	        setAddons(data); // appInfo とは別の場所に保存
			await info("DebugView: store addons fetched");
		} catch (error) {
			console.error("Error fetching store addons:", error);
		} finally {
			setLoadingAddons(false);
		}
	}

	return (
		<div>
			<h2>Debug View</h2>
			<div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
				<button onClick={getStoreInfo} disabled={loadingInfo}>
					{loadingInfo ? "Loading Info..." : "Get Store App Info"}
				</button>
				<button onClick={getStoreAddons} disabled={loadingAddons}>
					{loadingAddons ? "Loading AddOns..." : "Get Store AddOns"}
				</button>
			</div>
			{/* 結果を別々に表示 */}
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
				<div>
					<h3>App Info:</h3>
					<pre style={{ background: "#f5f5f5", padding: "8px" }}>
						{JSON.stringify(appInfo, null, 2)}
					</pre>
				</div>
				<div>
					<h3>Store AddOns:</h3>
					<pre style={{ background: "#f5f5f5", padding: "8px" }}>
						{JSON.stringify(addons, null, 2)}
					</pre>
				</div>
			</div>
		</div>
	);
};

export default DebugView;