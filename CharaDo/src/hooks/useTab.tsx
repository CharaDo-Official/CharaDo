// src/hooks/useTab.ts
import { useState } from "react";
import { TabKey } from "@config/tabs";

// useStateのタグラッパー版
export const useTab = (initial: TabKey) => {
	const [activeTab, setActiveTab] = useState<TabKey>(initial);
	const selectTab = (tab: TabKey) => setActiveTab(tab);
	return { activeTab, selectTab };
};
