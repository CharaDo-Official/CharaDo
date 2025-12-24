import { create } from "zustand";
import type { AddonType } from "./types";
import * as api from "./api";

interface AddonState {
	addons: AddonType[];
	loading: boolean;
	// Actions
	fetchAddons: () => Promise<void>;
}

export const useAddonStore = create<AddonState>((set) => ({
	addons: [],
	loading: false,

	fetchAddons: async () => {
		set({ loading: true });
		try {
			const addons = await api.getOwnedAddons();
			set({ addons });
		} finally {
			set({ loading: false });
		}
	},
}));