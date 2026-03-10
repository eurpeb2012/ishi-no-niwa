import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorage } from "./asyncStorageAdapter";

export type FairyColor = "rose_quartz" | "amethyst" | "jade" | "onyx";
export type EvolutionStage = 1 | 2 | 3 | 4 | 5;
export type CrystalStage = 1 | 2 | 3 | 4 | 5;

export const FAIRY_COLORS: Record<FairyColor, { hex: string; name_en: string; name_jp: string }> = {
  rose_quartz: { hex: "#F4A0B5", name_en: "Rose Quartz", name_jp: "ローズクォーツ" },
  amethyst: { hex: "#9B59B6", name_en: "Amethyst", name_jp: "アメジスト" },
  jade: { hex: "#5B8C5A", name_en: "Jade", name_jp: "翡翠" },
  onyx: { hex: "#4A4A6A", name_en: "Onyx", name_jp: "オニキス" },
};

export const EVOLUTION_STAGES: Record<EvolutionStage, { name_en: string; name_jp: string; minLevel: number; glyph: string }> = {
  1: { name_en: "Seed Sprite", name_jp: "種の精", minLevel: 1, glyph: "\u2727" },
  2: { name_en: "Bud Fairy", name_jp: "蕾の妖精", minLevel: 3, glyph: "\u{1F331}" },
  3: { name_en: "Bloom Fairy", name_jp: "花の妖精", minLevel: 6, glyph: "\u{1F33A}" },
  4: { name_en: "Crystal Fairy", name_jp: "水晶の妖精", minLevel: 9, glyph: "\u{1F48E}" },
  5: { name_en: "Guardian Spirit", name_jp: "守護の精霊", minLevel: 12, glyph: "\u{1F31F}" },
};

export const CRYSTAL_STAGES: Record<CrystalStage, { name_en: string; name_jp: string; minGrids: number }> = {
  1: { name_en: "Rough Chip", name_jp: "原石のかけら", minGrids: 0 },
  2: { name_en: "Tumbled Stone", name_jp: "タンブルストーン", minGrids: 10 },
  3: { name_en: "Polished Cabochon", name_jp: "磨かれたカボション", minGrids: 30 },
  4: { name_en: "Faceted Gem", name_jp: "ファセットカットの宝石", minGrids: 50 },
  5: { name_en: "Radiant Crystal", name_jp: "輝くクリスタル", minGrids: 100 },
};

interface FairyState {
  colorVariant: FairyColor;
  evolutionStage: EvolutionStage;
  crystalStage: CrystalStage;
  bondLevel: number;
  totalEnergy: number;
  dominantIntention: string | null;
  intentionCounts: Record<string, number>;
  isAwake: boolean;
  lastInteraction: string;

  // Actions
  setColor: (color: FairyColor) => void;
  addBond: (amount: number) => void;
  addEnergy: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  trackGridIntention: (intention: string) => void;
  updateEvolution: (level: number) => void;
  updateCrystalStage: (gridsCompleted: number) => void;
  wakeUp: () => void;
  getEvolutionInfo: () => { stage: EvolutionStage; name_en: string; name_jp: string; glyph: string };
  getCrystalInfo: () => { stage: CrystalStage; name_en: string; name_jp: string };
}

export const useFairyStore = create<FairyState>()(
  persist(
    (set, get) => ({
      colorVariant: "amethyst",
      evolutionStage: 1 as EvolutionStage,
      crystalStage: 1 as CrystalStage,
      bondLevel: 0,
      totalEnergy: 0,
      dominantIntention: null,
      intentionCounts: {},
      isAwake: true,
      lastInteraction: new Date().toISOString().split("T")[0],

      setColor: (color) => set({ colorVariant: color }),

      addBond: (amount) =>
        set((state) => ({
          bondLevel: Math.min(100, state.bondLevel + amount),
          lastInteraction: new Date().toISOString().split("T")[0],
          isAwake: true,
        })),

      addEnergy: (amount) =>
        set((state) => ({
          totalEnergy: state.totalEnergy + amount,
          lastInteraction: new Date().toISOString().split("T")[0],
          isAwake: true,
        })),

      spendEnergy: (amount) => {
        const state = get();
        if (state.totalEnergy < amount) return false;
        set({ totalEnergy: state.totalEnergy - amount });
        return true;
      },

      trackGridIntention: (intention) =>
        set((state) => {
          const counts = { ...state.intentionCounts };
          counts[intention] = (counts[intention] || 0) + 1;
          // Find dominant intention
          let maxCount = 0;
          let dominant = intention;
          for (const [key, val] of Object.entries(counts)) {
            if (val > maxCount) {
              maxCount = val;
              dominant = key;
            }
          }
          return { intentionCounts: counts, dominantIntention: dominant };
        }),

      updateEvolution: (level) =>
        set(() => {
          let stage: EvolutionStage = 1;
          if (level >= 12) stage = 5;
          else if (level >= 9) stage = 4;
          else if (level >= 6) stage = 3;
          else if (level >= 3) stage = 2;
          return { evolutionStage: stage };
        }),

      updateCrystalStage: (gridsCompleted) =>
        set(() => {
          let stage: CrystalStage = 1;
          if (gridsCompleted >= 100) stage = 5;
          else if (gridsCompleted >= 50) stage = 4;
          else if (gridsCompleted >= 30) stage = 3;
          else if (gridsCompleted >= 10) stage = 2;
          return { crystalStage: stage };
        }),

      wakeUp: () =>
        set({
          isAwake: true,
          lastInteraction: new Date().toISOString().split("T")[0],
        }),

      getEvolutionInfo: () => {
        const state = get();
        return { stage: state.evolutionStage, ...EVOLUTION_STAGES[state.evolutionStage] };
      },

      getCrystalInfo: () => {
        const state = get();
        return { stage: state.crystalStage, ...CRYSTAL_STAGES[state.crystalStage] };
      },
    }),
    {
      name: "ishi-fairy",
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({
        colorVariant: state.colorVariant,
        evolutionStage: state.evolutionStage,
        crystalStage: state.crystalStage,
        bondLevel: state.bondLevel,
        totalEnergy: state.totalEnergy,
        dominantIntention: state.dominantIntention,
        intentionCounts: state.intentionCounts,
        isAwake: state.isAwake,
        lastInteraction: state.lastInteraction,
      }),
    }
  )
);
