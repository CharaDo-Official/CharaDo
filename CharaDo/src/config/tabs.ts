// タブ型定義
export type TabKey = "task" | "character" | "plan" | "debug";

export interface TabItem {
	key: TabKey;
	label: string;
}

// タブ設定
export const TABS: TabItem[] = [
	{ key: "task", label: "タスク" },
	{ key: "character", label: "キャラ" },
	{ key: "plan", label: "プラン" },
	{ key: "debug", label: "デバッグ" },
];
