import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorage } from "./asyncStorageAdapter";

/**
 * Manages user's physical crystal collection:
 * - Owned crystals
 * - Wishlist
 * - Favorites
 */

interface CollectionState {
  owned: string[];
  wishlist: string[];
  favorites: string[];

  addOwned: (stoneId: string) => void;
  removeOwned: (stoneId: string) => void;
  addWishlist: (stoneId: string) => void;
  removeWishlist: (stoneId: string) => void;
  toggleFavorite: (stoneId: string) => void;
  isOwned: (stoneId: string) => boolean;
  isWishlisted: (stoneId: string) => boolean;
  isFavorite: (stoneId: string) => boolean;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      owned: [],
      wishlist: [],
      favorites: [],

      addOwned: (stoneId) =>
        set((s) => ({
          owned: s.owned.includes(stoneId) ? s.owned : [...s.owned, stoneId],
          wishlist: s.wishlist.filter((id) => id !== stoneId),
        })),

      removeOwned: (stoneId) =>
        set((s) => ({ owned: s.owned.filter((id) => id !== stoneId) })),

      addWishlist: (stoneId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(stoneId) ? s.wishlist : [...s.wishlist, stoneId],
        })),

      removeWishlist: (stoneId) =>
        set((s) => ({ wishlist: s.wishlist.filter((id) => id !== stoneId) })),

      toggleFavorite: (stoneId) =>
        set((s) => ({
          favorites: s.favorites.includes(stoneId)
            ? s.favorites.filter((id) => id !== stoneId)
            : [...s.favorites, stoneId],
        })),

      isOwned: (stoneId) => get().owned.includes(stoneId),
      isWishlisted: (stoneId) => get().wishlist.includes(stoneId),
      isFavorite: (stoneId) => get().favorites.includes(stoneId),
    }),
    {
      name: "ishi-collection",
      storage: createJSONStorage(() => asyncStorage),
    }
  )
);
