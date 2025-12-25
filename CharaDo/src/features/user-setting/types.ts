import type { User, Language } from "@bindings/user";
export type { User, Language };


export const LanguageMap: Record<Language, string> = {
	ja: "日本語",
	en: "English",
	Other: "Other",
} as const satisfies Record<Language, string>;