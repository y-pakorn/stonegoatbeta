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
      if (res.betas) {
        const betas: BetaInfo[] = [];

        for (const beta of res.betas) {
          const zones = [...beta.caption.matchAll(ZONES_REGEX)].map(
            (e) => e?.[1] || e?.[0]
          );
          const grades = [...beta.caption.matchAll(GRADES_REGEX)].map(
            (e) => e?.[1] ?? e?.[0]
          );
          const month = beta.caption.match(MONTHS_REGEX)?.[0];
          const instagramMatch = beta.caption.match(INSTAGRAM_HANDLE_REGEX);
          if (month && grades && zones) {
            for (var i = 0; i < grades.length; i++) {
              const grade = grades[i];
              for (var j = 0; j < zones.length; j++) {
                const zone = zones[j];
                if (grade && zone) {
                  betas.push({
                    ...beta,
                    zone,
                    month,
                    grade: grade as any,
                    instagram: instagramMatch?.[0] || null,
                    date: new Date(beta.timestamp),
                  });
                }
              }
            }
          }
        }

        set({
          betas,
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
