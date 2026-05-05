import { create } from "zustand";

interface UpgradeStore {
  requiredPlans: string[] | null;
  setRequired: (plans: string[]) => void;
  clear: () => void;
}

export const useUpgradeStore = create<UpgradeStore>((set) => ({
  requiredPlans: null,
  setRequired: (plans) => set({ requiredPlans: plans }),
  clear: () => set({ requiredPlans: null }),
}));
