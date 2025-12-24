import { Character } from "@features/characters/types";

interface CharacterListProps {
	characters: Character[];
	selectedId: number | null;
	onSelect: (id: number) => void;
}

export default function CharacterList({ characters, selectedId, onSelect }: CharacterListProps) {
	return (
		<div className="flex-1 overflow-y-auto p-1">
			<div className="grid grid-cols-2 gap-3 content-start">
				{characters.map((char) => (
					<button
						key={char.id}
						onClick={() => onSelect(char.id)}
						className={`
                            flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all relative
                            ${selectedId === char.id
						? "border-orange-400 bg-orange-50 shadow-inner"
						: "border-gray-200 hover:bg-gray-50 hover:border-gray-300"}
                        `}
					>
						{/* 編集ボタン (ユーザー作成のみ) */}
						{!char.is_standard && (
							<div className="absolute top-1 right-1 text-gray-400 hover:text-orange-500">
								✏️
							</div>
						)}

						{/* 画像プレースホルダー */}
						<div className="w-20 h-20 bg-gray-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center border border-gray-200">
							{/* ここにサムネイル画像 */}
							{/* TODO: メディアソースの処理 */}
							<span className="text-3xl">😺</span>
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
					className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-gray-300 hover:bg-gray-50 text-gray-400 hover:text-orange-500 transition-colors aspect-[3/4] min-h-[140px]"
					onClick={() => alert("追加機能は未実装です")}
				>
					<div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2">
						<span className="text-4xl text-orange-400 font-bold">+</span>
					</div>
					<span className="text-sm font-bold">追加</span>
				</button>
			</div>
		</div>
	);
}

