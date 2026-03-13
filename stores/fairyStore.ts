import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorage } from "./asyncStorageAdapter";
import type { OutfitSlot } from "../data/fairyOutfits";
import type { FairyLandBiome } from "../data/fairyLand";

export type FairyColor = "rose_quartz" | "amethyst" | "peridot" | "onyx" | "topaz" | "sapphire" | "aquamarine";
export type EvolutionStage = 1 | 2 | 3 | 4 | 5;
export type CrystalStage = 1 | 2 | 3 | 4 | 5;

/** Updated colors to match Takae's watercolor concept art */
export const FAIRY_COLORS: Record<FairyColor, { hex: string; name_en: string; name_jp: string; accent: string }> = {
  rose_quartz: { hex: "#F4A0B5", name_en: "Rose Quartz", name_jp: "ローズクォーツ", accent: "#FFD6E0" },
  amethyst: { hex: "#9B7CB8", name_en: "Amethyst", name_jp: "アメジスト", accent: "#D4C4E8" },
  peridot: { hex: "#7CB87C", name_en: "Peridot", name_jp: "ペリドット", accent: "#C4E8C4" },
  onyx: { hex: "#4A5080", name_en: "Onyx", name_jp: "オニキス", accent: "#8890B8" },
  topaz: { hex: "#E8B86D", name_en: "Topaz", name_jp: "トパーズ", accent: "#F5DCA8" },
  sapphire: { hex: "#4A7BDB", name_en: "Sapphire", name_jp: "サファイア", accent: "#A0BEF0" },
  aquamarine: { hex: "#5EC4B8", name_en: "Aquamarine", name_jp: "アクアマリン", accent: "#B0E8E0" },
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

  // Outfit system (#3 avatar customization)
  equippedOutfits: Record<OutfitSlot, string>; // slot -> outfit ID
  purchasedOutfitIds: string[];

  // Fairy Land (#4 world-building)
  builtStructureIds: string[];
  unlockedBiomes: FairyLandBiome[];
  totalEnergySpent: number;

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

  // Outfit actions
  equipOutfit: (slot: OutfitSlot, outfitId: string) => void;
  purchaseOutfit: (outfitId: string) => void;

  // Fairy Land actions
  buildStructure: (structureId: string, cost: number) => boolean;
  unlockBiome: (biome: FairyLandBiome) => void;
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

      // Outfit defaults
      equippedOutfits: {
        wings: "wings_default",
        dress: "dress_default",
        crown: "crown_default",
        accessory: "",
      },
      purchasedOutfitIds: [],

      // Fairy Land defaults
      builtStructureIds: [],
      unlockedBiomes: ["meadow"],
      totalEnergySpent: 0,

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

      // Outfit actions
      equipOutfit: (slot, outfitId) =>
        set((state) => ({
          equippedOutfits: { ...state.equippedOutfits, [slot]: outfitId },
        })),

      purchaseOutfit: (outfitId) =>
        set((state) => ({
          purchasedOutfitIds: state.purchasedOutfitIds.includes(outfitId)
            ? state.purchasedOutfitIds
            : [...state.purchasedOutfitIds, outfitId],
        })),

      // Fairy Land actions
      buildStructure: (structureId, cost) => {
        const state = get();
        if (state.totalEnergy < cost) return false;
        if (state.builtStructureIds.includes(structureId)) return false;
        set({
          totalEnergy: state.totalEnergy - cost,
          totalEnergySpent: state.totalEnergySpent + cost,
          builtStructureIds: [...state.builtStructureIds, structureId],
        });
        return true;
      },

      unlockBiome: (biome) =>
        set((state) => ({
          unlockedBiomes: state.unlockedBiomes.includes(biome)
            ? state.unlockedBiomes
            : [...state.unlockedBiomes, biome],
        })),
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
        equippedOutfits: state.equippedOutfits,
        purchasedOutfitIds: state.purchasedOutfitIds,
        builtStructureIds: state.builtStructureIds,
        unlockedBiomes: state.unlockedBiomes,
        totalEnergySpent: state.totalEnergySpent,
      }),
    }
  )
);
