import { useTab } from "@hooks/useTab";
import { TabKey } from "@config/tabs";
import TabBar from "@components/layout/TabBar";
import TaskView from "@views/TaskView";
import DebugView from "@views/DebugView";


function App() {
	const { activeTab, selectTab } = useTab("task");

	const renderView = (tab: TabKey) => {
		switch (tab) {
		case "task":
			return <TaskView />;
		case "debug":
			return <DebugView />;
		}
	};

	return (
		<div>
			<TabBar active={activeTab} onChange={selectTab} />
			<main>
				{renderView(activeTab)}
			</main>
		</div>
	);
}

export default App;
