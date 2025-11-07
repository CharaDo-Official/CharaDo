// src/components/layout/TabBar.tsx
import { TABS, TabKey } from "../../config/tabs";

type Props = {
	active: TabKey;
	onChange: (tab: TabKey) => void;
};

export const TabBar = ({ active, onChange }: Props) => {
	return (
		<div className="flex">
			{TABS.map((tab) => (
				<button
					key={tab}
					className={`py-2 px-4 rounded ${active === tab ? "bg-blue-500 text-white" : "bg-gray-200"}`}
					onClick={() => onChange(tab)}
				>
					{tab}
				</button>
			))}
		</div>
	);
};
