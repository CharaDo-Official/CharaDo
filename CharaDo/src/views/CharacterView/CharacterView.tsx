import { useState, useEffect } from "react";
import { useCharacters } from "@features/characters/hooks";
import CharacterList from "./components/CharacterList";
import CharacterDetail from "./components/CharacterDetail";

export default function CharacterView() {
	const { characters, loading } = useCharacters();
	const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);

	// 初期選択（データロード完了時に最初のキャラクターを選択）
	useEffect(() => {
		if (!loading && characters.length > 0 && selectedCharacterId === null) {
			setSelectedCharacterId(characters[0].id);
		}
	}, [loading, characters, selectedCharacterId]);

	const selectedCharacter = characters.find(c => c.id === selectedCharacterId) || null;

	return (
		<div className="flex h-[calc(100vh-64px)] p-4 gap-4 overflow-hidden bg-orange-50/30">
			{/* id40-10 キャラクター選択箇所 */}
			<section className="w-1/3 min-w-[250px] max-w-[350px] flex flex-col border-2 border-gray-800 rounded-lg p-3 bg-white shadow-sm">
				<h2 className="text-xl font-bold mb-4 flex items-center border-b-2 border-gray-100 pb-2">
					<span className="mr-2">🐱</span> キャラクター選択
				</h2>
				<CharacterList
					characters={characters}
					selectedId={selectedCharacterId}
					onSelect={setSelectedCharacterId}
				/>
			</section>

			{/* id40-20 ~ id40-60 詳細表示箇所 */}
			<section className="flex-1 flex flex-col border-2 border-gray-800 rounded-lg p-1 bg-white shadow-sm overflow-hidden relative">
				<div className="p-2 border-b-2 border-gray-100 mb-2">
					<h2 className="text-xl font-bold flex items-center">
						選択キャラクター <span className="text-sm font-normal text-gray-500 ml-4">id: {selectedCharacter?.id}</span>
					</h2>
				</div>

				{selectedCharacter ? (
					<CharacterDetail character={selectedCharacter} />
				) : (
					<div className="flex items-center justify-center h-full text-gray-500">
						キャラクターを選択してください
					</div>
				)}
			</section>
		</div>
	);
}

