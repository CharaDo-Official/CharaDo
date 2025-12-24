import { useTab } from "@hooks/useTab";
import { TabKey } from "@config/tabs";
import TabBar from "@components/layout/TabBar";
import TaskView from "@views/TaskView";
import CharacterView from "@views/CharacterView";
import DebugView from "@views/DebugView";
import PlanView from "@views/PlanView";

function App() {
	const { activeTab, selectTab } = useTab("task");

	const renderView = (tab: TabKey) => {
		switch (tab) {
		case "task":
			return <TaskView />;
		case "character":
			return <CharacterView />;
		case "plan":
			return <PlanView />;
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
