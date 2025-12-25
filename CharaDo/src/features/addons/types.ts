import type { AddonType } from "@bindings/store";
export type { AddonType };


export const AddonTypeLevel = {
	DataExpansion: "DataExpansion",
	MotionExpansion: "MotionExpansion",
	CustomFrameAdd1: "CustomFrameAdd1",
	CustomFrameAdd2: "CustomFrameAdd2",
	CustomFrameAdd4: "CustomFrameAdd4",
} as const satisfies Record<string, AddonType>;

export const AddonTypeLevelMap: Record<AddonType, string> = {
	[AddonTypeLevel.DataExpansion]: "データ拡張パック",
	[AddonTypeLevel.MotionExpansion]: "モーション拡張パック",
	[AddonTypeLevel.CustomFrameAdd1]: "カスタム枠+1",
	[AddonTypeLevel.CustomFrameAdd2]: "カスタム枠+2",
	[AddonTypeLevel.CustomFrameAdd4]: "カスタム枠+4",
};