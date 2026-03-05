import { create } from "zustand";
import type { Stone, ChakraId } from "../types";
import stonesData from "../data/stones.json";

interface StoneState {
  stones: Stone[];
  selectedStoneId: string | null;
  filterChakra: ChakraId | null;
  filterIntention: string | null;
  filterJapanNative: boolean;
  sortBy: "name" | "tier" | "chakra" | "rarity";

  selectStone: (id: string | null) => void;
  setFilterChakra: (chakra: ChakraId | null) => void;
  setFilterIntention: (intention: string | null) => void;
  setFilterJapanNative: (enabled: boolean) => void;
  setSortBy: (sort: "name" | "tier" | "chakra" | "rarity") => void;
  getStone: (id: string) => Stone | undefined;
  getFilteredStones: () => Stone[];
}

export const useStoneStore = create<StoneState>((set, get) => ({
  stones: stonesData as Stone[],
  selectedStoneId: null,
  filterChakra: null,
  filterIntention: null,
  filterJapanNative: false,
  sortBy: "tier",

  selectStone: (id) => set({ selectedStoneId: id }),
  setFilterChakra: (chakra) => set({ filterChakra: chakra }),
  setFilterIntention: (intention) => set({ filterIntention: intention }),
  setFilterJapanNative: (enabled) => set({ filterJapanNative: enabled }),
  setSortBy: (sort) => set({ sortBy: sort }),

  getStone: (id) => get().stones.find((s) => s.id === id),

  getFilteredStones: () => {
    const state = get();
    let filtered = [...state.stones];

    if (state.filterChakra) {
      filtered = filtered.filter((s) =>
        s.chakras.includes(state.filterChakra!)
      );
    }
    if (state.filterIntention) {
      filtered = filtered.filter((s) =>
        s.intentions.includes(state.filterIntention!)
      );
    }
    if (state.filterJapanNative) {
      filtered = filtered.filter((s) => s.origin_japan);
    }

    switch (state.sortBy) {
      case "name":
        filtered.sort((a, b) => a.name_en.localeCompare(b.name_en));
        break;
      case "tier":
        filtered.sort((a, b) => a.tier - b.tier || a.name_en.localeCompare(b.name_en));
        break;
      case "rarity": {
        const rarityOrder = { common: 0, uncommon: 1, rare: 2 };
        filtered.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
        break;
      }
      case "chakra": {
        const chakraOrder = ["root", "sacral", "solar_plexus", "heart", "throat", "third_eye", "crown"];
        filtered.sort(
          (a, b) =>
            chakraOrder.indexOf(a.chakras[0]) -
            chakraOrder.indexOf(b.chakras[0])
        );
        break;
      }
    }

    return filtered;
  },
}));
