import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		ignores: [
			"vite.config.ts",
			"node_modules/**",
			"src-tauri/**",
			".next/**",
			"dist/**",
			"build/**"
		],
	},
	// JavaScript / TypeScript 全体設定
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		languageOptions: {
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
			},
		},
	},

	// TypeScript 推奨ルール
	tseslint.configs.recommended,

	// React 推奨ルール
	pluginReact.configs.flat.recommended,

	// React Hooks 推奨ルール
	pluginReactHooks.configs.recommended,

	// 上書き設定（最後に適用）
	{
		files: ["**/*.{ts,tsx,js,jsx}"],
		rules: {
			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-react": "off",
			"semi": ["error", "always"],           // セミコロン必須
			"indent": ["error", "tab"],            // インデントはタブで
			"quotes": ["error", "double"],         // ダブルクオートを使用
			"react/prop-types": "off",							// TypeScript使用時はprop-types不要
		},
		settings: {
			react: { version: "detect" },
		},
	},
]);
