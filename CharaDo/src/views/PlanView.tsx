import React, { useMemo, useEffect } from "react";
import { useAddons, AddonTypeLevel } from "@features/addons";

// 価格定義：AddonTypeの文字列をキーにする
const PRICES: Record<string, string> = {
		  DataExpansion: "500円",
		  MotionExpansion: "500円",
		  CustomFrameAdd1: "500円",
		  CustomFrameAdd2: "500円",
		  CustomFrameAdd4: "500円",
		  AllIn: "1000円",
		  Donate: "500円",
};

export const PlanView: React.FC = () => {
	  // 自作フック useAddons を使用
	  const { addons = [], loading = false } = useAddons();

	  // デバッグ用ログ
	  useEffect(() => {
	  	  console.log("PlanView Addons:", addons);
	  }, [addons]);

	  // --- 判定ロジック：Hooksは早期リターンの前に全て記述する (Reactルール遵守) ---
	  const safeAddons = useMemo(() => (Array.isArray(addons) ? addons : []), [addons]);

	  // 各アドオンの所持判定
	  const hasData = useMemo(() => safeAddons.includes(AddonTypeLevel.DataExpansion), [safeAddons]);
	  const hasMotion = useMemo(() => safeAddons.includes(AddonTypeLevel.MotionExpansion), [safeAddons]);
	  const hasAllIn = useMemo(() => safeAddons.includes("AllIn" as any), [safeAddons]);

	  const hasF1 = useMemo(() => safeAddons.includes(AddonTypeLevel.CustomFrameAdd1), [safeAddons]);
	  const hasF2 = useMemo(() => safeAddons.includes(AddonTypeLevel.CustomFrameAdd2), [safeAddons]);
	  const hasF4 = useMemo(() => safeAddons.includes(AddonTypeLevel.CustomFrameAdd4), [safeAddons]);

	  // キャラ枠カードの状態計算 (仕様: 0->1, 1->3, 3->7, 7)
	  const frameCard = useMemo(() => {
	  	  // 1枠&2枠&4枠 全て保持時
	  	  if (hasF1 && hasF2 && hasF4) {
	  	  	  return {
	  	  	  	  display: "7",
	  	  	  	  target: null,
	  	  	  	  btnText: "購入不可",
	  	  	  	  btnColor: "bg-gray-400",
	  	  	  	  disabled: true,
	  	  	  	  price: "---"
	  	  	  };
	  	  }
	  	  // 1枠&2枠 保持時 -> 次は4枠追加
	  	  if (hasF1 && hasF2) {
	  	  	  return {
	  	  	  	  display: "3 → 7",
	  	  	  	  target: AddonTypeLevel.CustomFrameAdd4,
	  	  	  	  btnText: "アップグレード",
	  	  	  	  btnColor: "bg-amber-400",
	  	  	  	  disabled: false,
	  	  	  	  price: PRICES.CustomFrameAdd4
	  	  	  };
	  	  }
	  	  // 1枠保持時 -> 次は2枠追加
	  	  if (hasF1) {
	  	  	  return {
	  	  	  	  display: "1 → 3",
	  	  	  	  target: AddonTypeLevel.CustomFrameAdd2,
	  	  	  	  btnText: "アップグレード",
	  	  	  	  btnColor: "bg-amber-400",
	  	  	  	  disabled: false,
	  	  	  	  price: PRICES.CustomFrameAdd2
	  	  	  };
	  	  }
	  	  // 未保持時 -> 次は1枠追加
	  	  return {
	  	  	  display: "0 → 1",
	  	  	  target: AddonTypeLevel.CustomFrameAdd1,
	  	  	  btnText: "アップグレード",
	  	  	  btnColor: "bg-amber-400",
	  	  	  disabled: false,
	  	  	  price: PRICES.CustomFrameAdd1
	  	  };
	  }, [hasF1, hasF2, hasF4]);

	  // オールインパック購入可否 (いずれかの拡張をバラで持っている、または既にオールイン所持なら不可)
	  const canBuyAllIn = useMemo(() => {
	  	  return !(hasData || hasMotion || hasF1 || hasF2 || hasF4 || hasAllIn);
	  }, [hasData, hasMotion, hasF1, hasF2, hasF4, hasAllIn]);

	  // --- ローディング判定 (Hooksの後に記述) ---
	  if (loading) {
	  	  return (
	  	  	  <div className="flex items-center justify-center min-h-screen bg-[#FDF5E6]">
	  	  	  	  <div className="text-xl font-bold text-gray-400 font-sans">読み込み中...</div>
	  	  	  </div>
	  	  );
	  }

	  const handleBuy = (type: string | null) => {
	  	  if (!type) return;
	  	  console.log(`Steam購入リクエスト: ${type}`);
	  	  // ここで api-client 等を通じて購入処理を呼ぶ
	  };

	  return (
	  	  <div className="p-8 bg-[#FDF5E6] min-h-screen font-sans text-gray-800 overflow-auto">
	  	  	  <div className="flex items-center gap-4 mb-10">
	  	  	  	  <span className="text-3xl font-bold">💰</span>
	  	  	  	  <h2 className="text-3xl font-bold">全てのプラン</h2>
	  	  	  </div>

	  	  	  <div className="grid grid-cols-4 gap-6 items-start">
	  	  	  	  {/* データ拡張パック id:60-10 */}
	  	  	  	  <PlanCard
	  	  	  	  	  title="データ拡張パック"
	  	  	  	  	  price={PRICES.DataExpansion}
	  	  	  	  	  limitations={["今月分のカレンダーのみ閲覧可能", "選択日のタスク情報を確認不可"]}
	  	  	  	  	  benefits={["先月以前のカレンダーが閲覧可能になります", "選択日のタスク情報が確認可能になります"]}
	  	  	  	  	  buttonText={hasData ? "購入済み" : "購入"}
	  	  	  	  	  buttonDisabled={hasData}
	  	  	  	  	  buttonColor={hasData ? "bg-gray-400" : "bg-amber-400"}
	  	  	  	  	  onBuy={() => handleBuy("DataExpansion")}
	  	  	  	  />

	  	  	  	  {/* モーション拡張パック id:60-20 */}
	  	  	  	  <PlanCard
	  	  	  	  	  title="モーション拡張パック"
	  	  	  	  	  price={PRICES.MotionExpansion}
	  	  	  	  	  limitations={["通常/登場/退場/追加/達成時", "モーション＆セリフ"]}
	  	  	  	  	  benefits={["全てのキャラクターのタッチモーションを開放", "セリフの編集が可能になります"]}
	  	  	  	  	  buttonText={hasMotion ? "購入済み" : "購入"}
	  	  	  	  	  buttonDisabled={hasMotion}
	  	  	  	  	  buttonColor={hasMotion ? "bg-gray-400" : "bg-amber-400"}
	  	  	  	  	  onBuy={() => handleBuy("MotionExpansion")}
	  	  	  	  />

	  	  	  	  {/* キャラカスタム枠 id:60-30 */}
	  	  	  	  <PlanCard
	  	  	  	  	  title="キャラカスタム枠"
	  	  	  	  	  price={frameCard.price}
	  	  	  	  	  limitations={["カスタムキャラクターなし"]}
	  	  	  	  	  benefits={["カスタムキャラクターを追加可能", "各々のアニメーションを自由に設定可能"]}
	  	  	  	  	  buttonText={frameCard.btnText}
	  	  	  	  	  buttonDisabled={frameCard.disabled}
	  	  	  	  	  buttonColor={frameCard.btnColor}
	  	  	  	  	  footerContent={
	  	  	  	  	  	  <div className="text-2xl font-bold mt-2 text-center text-gray-700">
	  	  	  	  	  	  	  {frameCard.display}
	  	  	  	  	  	  </div>
	  	  	  	  	  }
	  	  	  	  	  onBuy={() => handleBuy(frameCard.target)}
	  	  	  	  />

	  	  	  	  {/* 右側：パックと寄付 */}
	  	  	  	  <div className="flex flex-col gap-6">
	  	  	  	  	  {/* オールインパック id:60-40 */}
	  	  	  	  	  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-white hover:shadow-lg transition-all">
	  	  	  	  	  	  <h3 className="text-xl font-bold text-center">オールインパック</h3>
	  	  	  	  	  	  <p className="text-2xl font-bold text-right my-4">{PRICES.AllIn}</p>
	  	  	  	  	  	  <div className="text-[11px] space-y-1 mb-4 text-gray-600">
	  	  	  	  	  	  	  <p>① データ拡張パック</p>
	  	  	  	  	  	  	  <p>② モーション拡張パック</p>
	  	  	  	  	  	  	  <p>③ キャラカスタム枠 +1</p>
	  	  	  	  	  	  	  <p className="mt-2 font-bold text-gray-800">ⓘ 全ての拡張機能をアンロックします</p>
	  	  	  	  	  	  </div>
	  	  	  	  	  	  <div className="flex flex-col items-center gap-2">
	  	  	  	  	  	  	  <button
	  	  	  	  	  	  	  	  disabled={!canBuyAllIn}
	  	  	  	  	  	  	  	  onClick={() => handleBuy("AllIn")}
	  	  	  	  	  	  	  	  className={`w-full py-2 rounded-full font-bold shadow-sm transition-all text-white ${
	  	  	  	  	  	  	  	  	  !canBuyAllIn ? "bg-gray-400 cursor-not-allowed" : "bg-amber-400 hover:bg-amber-500"
	  	  	  	  	  	  	  	  }`}
	  	  	  	  	  	  	  >
	  	  	  	  	  	  	  	  {hasAllIn ? "購入済み" : !canBuyAllIn ? "購入不可" : "購入"}
	  	  	  	  	  	  	  </button>
	  	  	  	  	  	  	  <span className="text-[10px] text-gray-400 underline cursor-pointer hover:text-gray-600">ⓘ 詳細はこちら</span>
	  	  	  	  	  	  </div>
	  	  	  	  	  </div>

	  	  	  	  	  {/* 寄付 id:60-50 */}
	  	  	  	  	  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-white hover:shadow-lg transition-all">
	  	  	  	  	  	  <h3 className="text-xl font-bold text-center text-gray-800">寄付</h3>
	  	  	  	  	  	  <div className="flex justify-between items-end my-4">
	  	  	  	  	  	  	  <span className="text-4xl">🍙</span>
	  	  	  	  	  	  	  <p className="text-2xl font-bold text-gray-700 font-sans">{PRICES.Donate}</p>
	  	  	  	  	  	  </div>
	  	  	  	  	  	  <div className="text-[10px] space-y-1 mb-4 text-gray-500 leading-tight">
	  	  	  	  	  	  	  <p>ⓘ CharaDoは、ユーザの協力の元に成り立つプロジェクトです。</p>
	  	  	  	  	  	  	  <p>ⓘ 紬・ノアのごはん代、新機能開発に使われます。</p>
	  	  	  	  	  	  	  <p>ⓘ 寄付による直接的なメリットはございません。</p>
	  	  	  	  	  	  </div>
	  	  	  	  	  	  <div className="flex flex-col items-center gap-2">
	  	  	  	  	  	  	  <button 
	  	  	  	  	  	  	  	  onClick={() => handleBuy("Donate")}
	  	  	  	  	  	  	  	  className="w-full py-2 rounded-full font-bold bg-amber-400 hover:bg-amber-500 text-white shadow-sm transition-all"
	  	  	  	  	  	  	  >
	  	  	  	  	  	  	  	  寄付
	  	  	  	  	  	  	  </button>
	  	  	  	  	  	  	  <span className="text-[10px] text-gray-400 underline cursor-pointer hover:text-gray-600">ⓘ 詳細はこちら</span>
	  	  	  	  	  	  </div>
	  	  	  	  	  </div>
	  	  	  	  </div>
	  	  	  </div>
	  	  </div>
	  );
};

// サブコンポーネント (Props型定義)
interface PlanCardProps {
	  title: string;
	  price: string;
	  limitations: string[];
	  benefits: string[];
	  buttonText: string;
	  buttonDisabled: boolean;
	  buttonColor: string;
	  onBuy: () => void;
	  footerContent?: React.ReactNode;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
	  title, 
	  price, 
	  limitations = [], 
	  benefits = [], 
	  buttonText, 
	  buttonDisabled, 
	  buttonColor,
	  onBuy, 
	  footerContent 
}) => (
	  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col h-full bg-white hover:shadow-lg transition-all">
	  	  <div className="flex-grow">
	  	  	  <h3 className="text-lg font-bold text-center mb-4 text-gray-800 font-sans">{title}</h3>
	  	  	  <p className="text-2xl font-bold text-right mb-6 text-gray-700 font-sans">{price}</p>
	  	  	  
	  	  	  <div className="space-y-2 text-left mb-6 font-sans">
	  	  	  	  {limitations.map((text, i) => (
	  	  	  	  	  <p key={i} className="text-[11px] text-gray-400 flex gap-1 items-start leading-tight font-sans">
	  	  	  	  	  	  <span>ⓘ</span> <span>{text}</span>
	  	  	  	  	  </p>
	  	  	  	  ))}
	  	  	  </div>

	  	  	  <div className="text-gray-400 text-xl my-4 text-center leading-none">↓</div>

	  	  	  <div className="space-y-2 text-left mb-6 font-sans">
	  	  	  	  {benefits.map((text, i) => (
	  	  	  	  	  <p key={i} className="text-[11px] text-gray-800 font-medium flex gap-1 items-start leading-tight font-sans">
	  	  	  	  	  	  <span>✓</span> <span>{text}</span>
	  	  	  	  	  </p>
	  	  	  	  ))}
	  	  	  </div>
	  	  </div>

	  	  <div className="flex flex-col items-center gap-2 mt-auto">
	  	  	  <button
	  	  	  	  onClick={onBuy}
	  	  	  	  disabled={buttonDisabled}
	  	  	  	  className={`w-full py-2 rounded-full font-bold shadow-sm transition-all text-white font-sans ${buttonColor} ${
	  	  	  	  	  buttonDisabled ? "cursor-not-allowed opacity-80" : "hover:brightness-105 shadow-md"
	  	  	  	  }`}
	  	  	  >
	  	  	  	  {buttonText}
	  	  	  </button>
	  	  	  <span className="text-[10px] text-gray-400 underline cursor-pointer hover:text-gray-600 transition-colors font-sans">
	  	  	  	  ⓘ 詳細はこちら
	  	  	  </span>
	  	  	  {footerContent}
	  	  </div>
	  </div>
);

export default PlanView;