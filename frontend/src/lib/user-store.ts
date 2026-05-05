import { create } from "zustand";
import { getMe } from "@/lib/api";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  plan: "free" | "essential" | "premium" | "family";
}

interface UserStore {
  user: CurrentUser | null;
  loading: boolean;
  fetch: () => Promise<void>;
  clear: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,
  fetch: async () => {
    try {
      const data = await getMe();
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  clear: () => set({ user: null, loading: false }),
}));
