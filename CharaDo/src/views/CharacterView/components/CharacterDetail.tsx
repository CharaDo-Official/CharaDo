import { Character } from "@features/characters/types";

interface CharacterDetailProps {
	character: Character;
}

export default function CharacterDetail({ character }: CharacterDetailProps) {
	return (
		<div className="flex h-full gap-4 p-2 overflow-hidden">
			{/* 左側: 立ち絵表示 (id40-20) */}
			<div className="w-1/2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 relative p-4">

				<div className="text-xs font-mono text-gray-400 absolute top-2 left-2">
					id: {character.id}
				</div>

				<div className="flex-1 flex items-center justify-center w-full">
					{/* 立ち絵プレースホルダー */}
					<div className="relative w-full h-full max-h-[500px] flex items-center justify-center">
						{/* キャラクター画像を表示する場所 */}
						<div className="text-center text-gray-400">
							<div className="text-6xl mb-4">🐱</div>
							<p>[立ち絵表示エリア]</p>
							<p className="text-sm mt-2">{character.name}</p>
						</div>
					</div>
				</div>

				<div className="text-xs text-gray-500 absolute bottom-2 left-4 bg-white/80 px-2 py-1 rounded">
					{character.is_standard ? `made by ${character.author || "公式"}` : "User Created"}
				</div>
			</div>

			{/* 右側: 詳細設定 (id40-30 ~ 60) */}
			<div className="w-1/2 flex flex-col gap-4 overflow-y-auto pr-2 pb-4">

				{/* id40-30 アニメーション選択 */}
				<div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
					<div className="flex justify-between items-center mb-2">
						<h3 className="text-sm font-bold border-b-2 border-orange-200 inline-block">アニメーション確認</h3>
						<div className="flex gap-1">
							<button className="text-xs border rounded px-2 py-1 hover:bg-gray-100" disabled>&lt;</button>
							<button className="text-xs border rounded px-2 py-1 hover:bg-gray-100" disabled>&gt;</button>
						</div>
					</div>

					<div className="grid grid-cols-4 gap-2">
						{["通常時*", "追加時*", "達成時*", "登場時*"].map(label => (
							<button key={label} className="border border-gray-300 p-1 text-xs rounded hover:bg-orange-50 hover:border-orange-400 flex flex-col items-center gap-1 bg-white h-24">
								<span className="font-bold">{label}</span>
								<div className="flex-1 bg-gray-100 w-full rounded flex items-center justify-center">
									IMG
								</div>
							</button>
						))}
					</div>
				</div>

				{/* id40-40 基本情報 */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<div className="w-2 h-8 bg-orange-400 rounded-sm"></div>
						<h1 className="text-2xl font-bold text-gray-800">
							{character.name}
						</h1>
						<button className="text-gray-400 hover:text-orange-500 ml-auto">
							<span className="text-xl">🔗</span>
						</button>
					</div>
					<p className="text-sm text-gray-600 pl-4 whitespace-pre-wrap leading-relaxed">
						{character.description || "説明文はありません。"}
					</p>
				</div>

				{/* id40-60 表示見本 */}
				<div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
					<h3 className="text-lg font-bold mb-2">表示見本</h3>
					<div className="h-40 bg-gray-100 rounded-lg border-2 border-gray-200 border-dashed flex items-center justify-center relative overflow-hidden">
						{/* プレビューの中身 */}
						<div className="absolute right-4 bottom-0 w-24 h-32 bg-gray-300 rounded-t-lg opacity-50"></div>
						<div className="bg-white p-2 rounded shadow absolute top-4 right-12 text-xs">
							お仕事がんばってね
						</div>
						<div className="text-gray-400">Preview Area</div>
					</div>
				</div>

				{/* id40-50 セリフ編集 (表形式) */}
				<div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
					<div className="flex justify-between items-center mb-2">
						<h3 className="text-sm font-bold">セリフ編集</h3>
						<button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm transition-colors">
							保存
						</button>
					</div>

					<div className="bg-white rounded border border-gray-200 overflow-hidden text-sm">
						<table className="w-full">
							<tbody>
								{[
									{ key: "usual", label: "通常時" },
									{ key: "addition", label: "追加時" },
									{ key: "achievement", label: "達成時" },
									{ key: "on_stage", label: "登場時" },
									{ key: "off_stage", label: "退出時" },
									{ key: "touch", label: "タッチ時" }
								].map((row, i) => (
									<tr key={row.key} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
										<td className="px-3 py-2 text-gray-600 font-medium whitespace-nowrap w-20">{row.label}</td>
										<td className="px-3 py-2 text-gray-800">
											{character.dialogues[row.key as keyof typeof character.dialogues] || "-"}
										</td>
										<td className="px-2 py-2 text-xs text-gray-400 w-20 font-mono text-right">
											Id: {character.id}-5{i}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

			</div>
		</div>
	);
}

