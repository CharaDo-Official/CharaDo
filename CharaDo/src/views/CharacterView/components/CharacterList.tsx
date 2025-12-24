import { Character } from "@features/characters/types";

interface CharacterListProps {
	characters: Character[];
	selectedId: number | null;
	onSelect: (id: number) => void;
	onAdd: () => void;
	onEdit: (character: Character) => void;
}

export default function CharacterList({ characters, selectedId, onSelect, onAdd, onEdit }: CharacterListProps) {
	return (
		<div className="flex-1 overflow-y-auto p-1">
			<div className="grid grid-cols-2 gap-3 content-start">
				{characters.map((char) => (
					<button
						key={char.id}
						onClick={() => onSelect(char.id)}
						className={`
                            flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all relative group
                            ${selectedId === char.id
						? "border-orange-400 bg-orange-50 shadow-inner"
						: "border-gray-200 hover:bg-gray-50 hover:border-gray-300"}
                        `}
					>
						{/* 編集ボタン (ユーザー作成のみ) */}
						{!char.is_standard && (
							<div 
								className="absolute top-1 right-1 text-gray-400 hover:text-orange-500 p-1 hover:bg-white rounded-full transition-all z-10"
								onClick={(e) => {
									e.stopPropagation();
									onEdit(char);
								}}
							>
								✏️
							</div>
						)}

						{/* 画像プレースホルダー */}
						<div className="w-20 h-20 bg-gray-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center border border-gray-200 relative">
							{/* ここにサムネイル画像 */}
							<span className="text-3xl z-0">😺</span>
							
							{/* 選択中のインジケーター */}
							{selectedId === char.id && (
								<div className="absolute inset-0 border-2 border-orange-400 rounded-lg pointer-events-none"></div>
							)}
						</div>
						<span className="text-sm font-bold truncate w-full text-center text-gray-700">
							{char.name}
						</span>
						<span className="text-xs text-gray-400 font-mono">
							Id: {char.id}
						</span>
					</button>
				))}

				{/* 追加ボタン */}
				<button
					className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-gray-300 hover:bg-gray-50 text-gray-400 hover:text-orange-500 transition-colors aspect-[3/4] min-h-[140px] group"
					onClick={onAdd}
				>
					<div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
						<span className="text-4xl text-orange-400 font-bold">+</span>
					</div>
					<span className="text-sm font-bold">追加</span>
				</button>
			</div>
		</div>
	);
}
