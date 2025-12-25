import React from "react";
import { useAddons, AddonTypeLevelMap } from "@features/addons";

const PlanView: React.FC = () => {
	const { addons, loading } = useAddons();

	if (loading) {
		return <div className="p-10 text-center text-gray-500">Loading addons...</div>;
	}

	return (
		<div>
			<h1>PlanView</h1>
			<p>所持しているアドオン</p>
			<ul>
				{addons.map((addon) => (
					<li key={addon}>{AddonTypeLevelMap[addon]}</li>
				))}
			</ul>
		</div>
	);
};

export default PlanView;