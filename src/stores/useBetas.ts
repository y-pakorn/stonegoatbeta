import { axios } from "@/constants/axios";
import { Beta } from "@/interfaces/beta";
import { create } from "zustand";

interface BetaStore {
  betas: Beta[];
  fetchBetas: () => Promise<void>;
  isLoading: boolean;
}

export const useBetas = create<BetaStore>((set, get) => ({
  betas: [],
  isLoading: false,
  fetchBetas: async () => {
    try {
      set({ isLoading: true });
      const data: Beta[] = [];
      const res = await axios.get("/api/betas");
      set({
        betas: res.data.betas,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
