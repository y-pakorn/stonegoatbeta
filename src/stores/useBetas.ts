import {
  GRADES_REGEX,
  INSTAGRAM_HANDLE_REGEX,
  MONTHS_REGEX,
} from "@/constants/grades";
import { ZONES_REGEX } from "@/constants/zones";
import { BetaInfo } from "@/interfaces/beta";
import { create } from "zustand";

interface BetaStore {
  betas: BetaInfo[];
  fetchBetas: () => Promise<void>;
  isLoading: boolean;
}

export const useBetas = create<BetaStore>((set) => ({
  betas: [],
  isLoading: false,
  fetchBetas: async () => {
    try {
      set({ isLoading: true });

      const res = await fetch("/api/betas").then((res) => res.json());

      set({
        betas: res.betas.map((b: BetaInfo) => ({
          ...b,
          timestamp: new Date(b.timestamp),
        })),
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
