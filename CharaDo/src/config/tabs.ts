// タブ型定義
export type TabKey = "task" | "character" | "debug";

export interface TabItem {
	key: TabKey;
	label: string;
}

// タブ設定
export const TABS: TabItem[] = [
	{ key: "task", label: "タスク" },
	{ key: "character", label: "キャラクター" },
	{ key: "debug", label: "デバッグ" },
];
