import { open } from "@tauri-apps/plugin-dialog";


/**
 * ファイル選択フック
 */
export function useFileSelect() {
	const selectMediaFile = async (): Promise<string | null> => {
		try {
			const selected = await open({
				multiple: false,	// 複数選択不可
				filters: [{
					name: "Image or Video",
					extensions: ["png", "jpg", "jpeg", "gif", "webm", "mp4"]
				}]
			});
			
			if (selected === null) return null;
			return selected as string;
		} catch (error) {
			console.error("File selection failed:", error);
			return null;
		}
	};

	return { selectMediaFile };
}
