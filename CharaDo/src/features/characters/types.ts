// Rust側から返される型
import type { 
	Character as CharacterRaw,
	AnimationKind,
	NecessaryAnimation,
	OptionalAnimation,
	Dialogue
} from "@bindings/character";

export type { 
	CharacterRaw,
	AnimationKind,
	NecessaryAnimation,
	OptionalAnimation,
	Dialogue 
};

// フロントで扱う整形後の型
// 現状はRust側の型とほぼ同じだが、将来的な拡張や変換のために定義しておく
export type Character = CharacterRaw;

