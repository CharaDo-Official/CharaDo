type TabBarProps = {
	active: "task" | "debug";
	onChange: (tab: "task" | "debug") => void;
};

const TabBar: React.FC<TabBarProps> = ({ active, onChange }) => {
	return (
		<div className="flex">
			<button
				className={`flex-1 p-2 ${active === "task" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
				onClick={() => onChange("task")}
			>
				Task
			</button>
			<button
				className={`flex-1 p-2 ${active === "debug" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
				onClick={() => onChange("debug")}
			>
				Debug
			</button>
		</div>
	);
};

export default TabBar;
