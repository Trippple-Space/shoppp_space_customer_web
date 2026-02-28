// store/onboarding.store.ts
import { create } from "zustand";

interface OnboardingState {
  showCartTip: boolean;
  hasSeenCartTip: boolean;
  triggerCartTip: () => void;
  hideCartTip: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  showCartTip: false,
  hasSeenCartTip: localStorage.getItem("seenCartTip") === "true",

  triggerCartTip: () => {
    const hasSeen = localStorage.getItem("seenCartTip") === "true";
    if (hasSeen) return;

    set({ showCartTip: true });
    setTimeout(() => {
      set({ showCartTip: false, hasSeenCartTip: true });
      localStorage.setItem("seenCartTip", "true");
    }, 3500);
  },

  hideCartTip: () => set({ showCartTip: false }),
}));
