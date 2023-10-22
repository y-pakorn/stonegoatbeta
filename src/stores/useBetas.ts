import { axios } from "@/constants/axios";
import { Beta } from "@/interfaces/beta";
import { create } from "zustand";

interface BetaStore {
  betas: Beta[];
  fetchBetas: () => Promise<void>;
  isLoading: boolean;
}

const BETA_ENDPOINT = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,timestamp,permalink,caption&access_token=${process.env.NEXT_PUBLIC_IG_ACCESS_TOKEN}&limit=1000`;

export const useBetas = create<BetaStore>((set, get) => ({
  betas: [],
  isLoading: false,
  fetchBetas: async () => {
    try {
      set({ isLoading: true });
      const data: Beta[] = [];
      const res = await axios.get(BETA_ENDPOINT);
      data.push(...res.data.data);
      //if (res.data.paging?.next) {
      //const nextRes = await axios.get(res.data.paging.next);
      //data.push(...nextRes.data.data);
      //}
      set({
        betas: data,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
