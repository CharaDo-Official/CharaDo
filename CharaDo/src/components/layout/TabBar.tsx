// src/components/layout/TabBar.tsx
import { TABS, TabKey } from "@config/tabs";

type Props = {
	active: TabKey;
	onChange: (tab: TabKey) => void;
};

const TabBar = ({ active, onChange }: Props) => {
	return (
		<div className="flex">
			{TABS.map((tab) => (
				<button
					key={tab.key}
					className={`py-2 px-4 rounded ${active === tab.key ? "bg-blue-500 text-white" : "bg-gray-200"}`}
					onClick={() => onChange(tab.key)}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
};

export default TabBar;
