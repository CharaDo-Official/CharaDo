// Rust側から返される生データ
import type { 
	Character as CharacterRaw,
	Dialogue,
	MediaSource,
	NecessaryMedia,
	OptionalMedia
} from "@bindings/character";

export type { 
	CharacterRaw,
	Dialogue,
	MediaSource,
	NecessaryMedia,
	OptionalMedia
};

// フロントで扱う整形後の型
// 現状はRust側の型と構造は同じだが、将来的な拡張（Date変換など）のために別名で定義
export type Character = CharacterRaw;