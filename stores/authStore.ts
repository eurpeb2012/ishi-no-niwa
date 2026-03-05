import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorage } from "./asyncStorageAdapter";
import type { UserProfile, SubscriptionTier } from "../types";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  hasAccess: (requiredTier: SubscriptionTier) => boolean;
}

const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  tsuki: 1,
  hoshi: 2,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      signOut: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      hasAccess: (requiredTier) => {
        const user = get().user;
        if (!user) return requiredTier === "free";
        return TIER_RANK[user.subscriptionTier] >= TIER_RANK[requiredTier];
      },
    }),
    {
      name: "ishi-auth",
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
