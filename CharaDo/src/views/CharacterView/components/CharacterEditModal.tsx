import { useState, useEffect } from "react";
import { Character, MediaSource } from "@features/characters/types";
import { useFileSelect } from "@hooks/useFileSelect";

interface CharacterEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (characterData: Partial<Character>) => void;
	initialData?: Character | null; // null for new character
}

// 初期データのテンプレート
const INITIAL_CHARACTER: Partial<Character> = {
	name: "",
	description: "",
	is_standard: false,
	// 他のフィールドは必要に応じて初期化
	necessary_media: {
		usual: { External: "" },
		addition: { External: "" },
		achievement: { External: "" },
		on_stage: { External: "" },
	},
	optional_media: {
		off_stage: null,
		touch: null,
	},
};

export default function CharacterEditModal({ isOpen, onClose, onSave, initialData }: CharacterEditModalProps) {
	const [formData, setFormData] = useState<Partial<Character>>(INITIAL_CHARACTER);
	const [touched, setTouched] = useState(false);
	const { selectMediaFile } = useFileSelect();

	// モーダルが開くたびに初期化
	useEffect(() => {
		if (isOpen) {
			setFormData(initialData ? { ...initialData } : { ...INITIAL_CHARACTER });
			setTouched(false);
		}
	}, [isOpen, initialData]);

	if (!isOpen) return null;

	const handleSave = () => {
		onSave(formData);
		onClose();
	};

	const handleReset = () => {
		if (window.confirm("入力内容をリセットしますか？")) {
			setFormData(initialData ? { ...initialData } : { ...INITIAL_CHARACTER });
		}
	};

	// 選択済みかどうかを判定するヘルパー（簡易）
	const isMediaSelected = (category: "necessary" | "optional", key: string): boolean => {
		if (category === "necessary") {
			const media = formData.necessary_media as any;
			return media && media[key] && (media[key].External || media[key].Embedded);
		} else {
			const media = formData.optional_media as any;
			return media && media[key] && (media[key].External || media[key].Embedded);
		}
	};

	// 簡易的なバリデーション: 名前と必須アニメーション
	const isValid = !!formData.name &&
		isMediaSelected("necessary", "usual") &&
		isMediaSelected("necessary", "addition") &&
		isMediaSelected("necessary", "achievement") &&
		isMediaSelected("necessary", "on_stage");

	// メディアファイルの更新ヘルパー
	const updateMedia = async (
		category: "necessary" | "optional",
		key: string
	) => {
		const filePath = await selectMediaFile();
		if (!filePath) return;

		setFormData(prev => {
			const mediaSource: MediaSource = { External: filePath }; // ファイルパスはExternalとして扱う

			if (category === "necessary") {
				return {
					...prev,
					necessary_media: {
						...prev.necessary_media,
						[key]: mediaSource
					} as any // 型定義が複雑なため一時的にanyキャスト（実際には厳密にやるべき）
				};
			} else {
				return {
					...prev,
					optional_media: {
						...prev.optional_media,
						[key]: mediaSource
					} as any
				};
			}
		});
	};
	
	const getMediaLabel = (category: "necessary" | "optional", key: string): string => {
		if (category === "necessary") {
			const media = formData.necessary_media as any;
			if (media && media[key]) {
				// オブジェクトの中身を表示用文字列にする簡易処理
				const src = media[key];
				if (src.External) return src.External;
				if (src.Embedded) return "Embedded Media";
				return "未選択";
			}
		} else {
			const media = formData.optional_media as any;
			if (media && media[key]) {
				const src = media[key];
				if (src.External) return src.External;
				if (src.Embedded) return "Embedded Media";
				return "未選択";
			}
		}
		return "未選択";
	};


	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">

				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-100 bg-orange-50/50 rounded-t-xl">
					<div className="flex items-center gap-2">
						<span className="bg-orange-400 text-white text-xs px-2 py-0.5 rounded font-bold">id: 50-10</span>
						<h2 className="text-lg font-bold text-gray-800">
							{initialData ? "キャラクター編集" : "キャラクターの追加"}
						</h2>
					</div>
					<div className="flex gap-2">
						<button
							onClick={onClose}
							className="px-4 py-1.5 text-sm font-bold text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
						>
							キャンセル
						</button>
						<button
							onClick={handleSave}
							disabled={!isValid}
							className={`px-4 py-1.5 text-sm font-bold text-white rounded border transition-colors shadow-sm
								${isValid
			? "bg-orange-400 border-orange-500 hover:bg-orange-500"
			: "bg-gray-300 border-gray-400 cursor-not-allowed"}
							`}
						>
							完了
						</button>
					</div>
				</div>

				{/* Body */}
				<div className="p-6 flex flex-col gap-6">

					{/* id50-30 キャラクター名 */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-bold text-gray-700 flex justify-between">
							キャラクター名*
							<span className="text-xs font-mono text-gray-300">id: 50-30</span>
						</label>
						<input
							type="text"
							value={formData.name || ""}
							onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
							placeholder="キャラクター名を入力する"
							className="w-full p-2 border border-gray-300 rounded bg-orange-50/30 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
						/>
						{!formData.name && touched && (
							<span className="text-xs text-red-500">キャラクター名は必須です</span>
						)}
					</div>

					{/* id50-40 説明 */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-bold text-gray-700 flex justify-between">
							キャラクターの説明
							<span className="text-xs font-mono text-gray-300">id: 50-40</span>
						</label>
						<textarea
							value={formData.description || ""}
							onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
							placeholder="キャラクターの説明を入力する&#13;&#10;文字数2行分まで　ユーザ入力は通常色"
							className="w-full p-2 border border-gray-300 rounded bg-orange-50/30 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition-all min-h-[80px] resize-none"
						/>
					</div>

					{/* id50-50 アニメーション入力 */}
					<div className="flex flex-col gap-3">
						<label className="text-sm font-bold text-gray-700 flex justify-between border-b pb-1 border-gray-100">
							アニメーション*
							<span className="text-xs font-mono text-gray-300">id: 50-50</span>
						</label>

						<div className="grid gap-2">
							{[
								{ label: "通常時", key: "usual" },
								{ label: "追加時", key: "addition" },
								{ label: "達成時", key: "achievement" },
								{ label: "登場時", key: "on_stage" }
							].map((item) => (
								<button
									key={item.key}
									className={`flex items-center gap-3 p-3 border rounded-lg transition-colors text-left group
										${isMediaSelected("necessary", item.key) ? "bg-orange-100 border-orange-300" : "bg-orange-50/50 border-orange-200 hover:bg-orange-100"}`}
									onClick={() => updateMedia("necessary", item.key)}
								>
									<div className="w-8 h-8 flex items-center justify-center bg-white rounded border border-orange-200 text-orange-400 group-hover:scale-110 transition-transform">
										{isMediaSelected("necessary", item.key) ? "✅" : "📄"}
									</div>
									<div className="flex flex-col overflow-hidden w-full">
										<span className="text-sm text-gray-600 font-medium">
											{item.label}を選択
										</span>
										<span className="text-xs text-gray-400 truncate block w-full">
											{getMediaLabel("necessary", item.key)}
										</span>
									</div>
								</button>
							))}
						</div>

						<label className="text-sm font-bold text-gray-700 flex justify-between border-b pb-1 border-gray-100 mt-2">
							アニメーション(拡張)
						</label>
						<div className="grid gap-2">
							{[
								{ label: "退場時", key: "off_stage" },
								{ label: "タッチ時", key: "touch" }
							].map((item) => (
								<button
									key={item.key}
									className={`flex items-center gap-3 p-3 border rounded-lg transition-colors text-left group
										${isMediaSelected("optional", item.key) ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200 hover:bg-gray-50"}`}
									onClick={() => updateMedia("optional", item.key)}
								>
									<div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded border border-gray-200 text-gray-400 group-hover:scale-110 transition-transform">
										{isMediaSelected("optional", item.key) ? "✅" : "📄"}
									</div>
									<div className="flex flex-col overflow-hidden w-full">
										<span className="text-sm text-gray-500">
											{item.label}を選択
										</span>
										<span className="text-xs text-gray-400 truncate block w-full">
											{getMediaLabel("optional", item.key)}
										</span>
									</div>
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center rounded-b-xl">
					<div className="text-xs text-gray-400 font-mono">id: 50-60</div>
					<button
						onClick={handleReset}
						className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 border border-red-200 bg-white rounded hover:bg-red-50 transition-colors"
					>
						🗑️ リセット
					</button>
				</div>
			</div>
		</div>
	);
}
