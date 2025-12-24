import { useState, useEffect } from "react";
import { useCharacters, useCharacterActions } from "@features/characters/hooks";
import { Character } from "@features/characters/types";
import CharacterList from "./components/CharacterList";
import CharacterDetail from "./components/CharacterDetail";
import CharacterEditModal from "./components/CharacterEditModal";

export default function CharacterView() {
	const { characters, loading } = useCharacters();
	const { addCharacter, updateCharacter } = useCharacterActions();
	
	const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
	
	// モーダル管理
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

	// 初期選択（データロード完了時に最初のキャラクターを選択）
	useEffect(() => {
		if (!loading && characters.length > 0 && selectedCharacterId === null) {
			setSelectedCharacterId(characters[0].id);
		}
	}, [loading, characters, selectedCharacterId]);

	const selectedCharacter = characters.find(c => c.id === selectedCharacterId) || null;

	const handleAddClick = () => {
		setEditingCharacter(null); // 新規作成
		setIsModalOpen(true);
	};

	const handleEditClick = (character: Character) => {
		setEditingCharacter(character); // 編集
		setIsModalOpen(true);
	};

	const handleSave = async (data: Partial<Character>) => {
		if (editingCharacter) {
			// 更新
			// ※ 実際にはバリデーションやデータ変換が必要
			const updatedCharacter = { ...editingCharacter, ...data } as Character;
			
			// サムネイルを通常時の画像で代用（サムネイルが未設定の場合）
			if (!updatedCharacter.thumbnail_source || 
				("External" in updatedCharacter.thumbnail_source && updatedCharacter.thumbnail_source.External === "")) {
				if (updatedCharacter.necessary_media.usual) {
					updatedCharacter.thumbnail_source = updatedCharacter.necessary_media.usual;
				}
			}

			await updateCharacter(updatedCharacter);
		} else {
			// 新規作成
			// 仮のIDや初期データを補完する必要があるが、ここではモック的に処理
			// 本来はRust側でID生成などを任せるため、dataをそのまま渡す形になるはず
			// 今回は型エラー回避のため、とりあえずキャスト
			const newCharacter = { 
				id: 0, // Rust側で無視されるか、自動採番される想定
				is_standard: false,
				dialogues: { usual: null, addition: null, achievement: null, on_stage: null, off_stage: null, touch: null },
				necessary_media: { usual: { External: "" }, addition: { External: "" }, achievement: { External: "" }, on_stage: { External: "" } },
				optional_media: { off_stage: null, touch: null },
				thumbnail_source: { External: "" },
				author: "",
				...data 
			} as Character;
			
			// サムネイルを通常時の画像で代用
			if (newCharacter.necessary_media.usual) {
				newCharacter.thumbnail_source = newCharacter.necessary_media.usual;
			}
			
			await addCharacter(newCharacter);
		}
	};

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
					onAdd={handleAddClick}
					onEdit={handleEditClick}
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

			{/* id50 キャラ詳細モーダル */}
			<CharacterEditModal 
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSave}
				initialData={editingCharacter}
			/>
		</div>
	);
}
