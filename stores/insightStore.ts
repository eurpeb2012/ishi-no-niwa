import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorage } from "./asyncStorageAdapter";

/**
 * Tracks crystal usage patterns to generate AI-style insights
 * about the user's emotional/spiritual tendencies.
 */

interface InsightState {
  /** How many times each stone has been placed on grids */
  stoneUsage: Record<string, number>;
  /** How many times each intention has been selected */
  intentionUsage: Record<string, number>;
  /** How many times each color family has been used */
  colorUsage: Record<string, number>;
  /** Generated insight messages */
  insights: string[];

  trackStonePlaced: (stoneId: string, colorFamily: string) => void;
  trackIntention: (intentionId: string) => void;
  getTopStones: (count: number) => { id: string; uses: number }[];
  getTopIntentions: (count: number) => { id: string; uses: number }[];
  getTopColors: (count: number) => { id: string; uses: number }[];
  generateInsights: () => string[];
}

const COLOR_FAMILIES: Record<string, string> = {
  "#F4C2C2": "pink",
  "#9B59B6": "purple",
  "#FFFFFF": "white",
  "#B8860B": "gold",
  "#1A1A2E": "black",
  "#1F4788": "blue",
  "#006400": "green",
  "#E25822": "orange",
  "#8B0000": "red",
  "#7FB3D8": "light-blue",
  "#A9A9A9": "grey",
  "#696969": "dark-grey",
  "#2E8B57": "green",
  "#0F6A4B": "dark-green",
  "#00CED1": "teal",
  "#E8687E": "pink",
  "#9966CC": "purple",
  "#7BB661": "green",
  "#F0A500": "amber",
  "#C0392B": "red",
};

function getColorFamily(hex: string): string {
  return COLOR_FAMILIES[hex] || "other";
}

const INSIGHT_TEMPLATES_EN: Record<string, string[]> = {
  pink: [
    "You're drawn to heart-centered stones. Your spirit is seeking connection and love.",
    "The pink stones you favor reflect an open heart chakra. You radiate warmth.",
  ],
  purple: [
    "Your affinity for purple stones suggests deep spiritual awareness. Trust your intuition.",
    "Purple is the color of transformation. You're on a path of inner growth.",
  ],
  blue: [
    "Blue stones speak to your need for clear communication and truth.",
    "You're drawn to calming energies. Your soul seeks peace and clarity.",
  ],
  green: [
    "Green stones reflect your connection to healing and abundance. Nature grounds you.",
    "Your green stone choices suggest a generous spirit seeking balance.",
  ],
  black: [
    "Dark stones show you value protection and grounding. You're building strong foundations.",
  ],
  gold: [
    "Golden stones reflect your courage and determination. You're a natural leader.",
  ],
  "light-blue": [
    "Light blue stones mirror your gentle, flowing nature. You adapt with grace.",
  ],
  red: [
    "Red stones ignite your passion and vitality. Your root chakra is strong.",
  ],
  love: [
    "Your heart reaches out through every grid you create. Love is your guiding intention.",
  ],
  healing: [
    "You carry a healer's spirit. Your grids channel restorative energy.",
  ],
  protection: [
    "Your protective instincts are strong. You create safe spaces for growth.",
  ],
  spiritual: [
    "You're on a deeply spiritual path. Each grid brings you closer to your higher self.",
  ],
  calm: [
    "Peace is your anchor. Your practice shows someone who values inner stillness.",
  ],
  prosperity: [
    "Abundance flows toward those who seek it. Your grids attract prosperity.",
  ],
};

const INSIGHT_TEMPLATES_JP: Record<string, string[]> = {
  pink: [
    "ピンクの石に惹かれています。心が愛とつながりを求めています。",
  ],
  purple: [
    "紫の石への親和性は深い精神的な意識を示しています。直感を信じてください。",
  ],
  blue: [
    "青い石はコミュニケーションと真実への欲求を表しています。",
  ],
  green: [
    "緑の石は癒しと豊かさへのつながりを反映しています。",
  ],
  love: [
    "愛があなたの導く意図です。すべての陣に心が込められています。",
  ],
  healing: [
    "癒しの精神を持っています。あなたの陣は回復のエネルギーを伝えます。",
  ],
  calm: [
    "平和があなたの支えです。内なる静けさを大切にしています。",
  ],
};

export const useInsightStore = create<InsightState>()(
  persist(
    (set, get) => ({
      stoneUsage: {},
      intentionUsage: {},
      colorUsage: {},
      insights: [],

      trackStonePlaced: (stoneId, colorHex) =>
        set((state) => {
          const family = getColorFamily(colorHex);
          return {
            stoneUsage: {
              ...state.stoneUsage,
              [stoneId]: (state.stoneUsage[stoneId] || 0) + 1,
            },
            colorUsage: {
              ...state.colorUsage,
              [family]: (state.colorUsage[family] || 0) + 1,
            },
          };
        }),

      trackIntention: (intentionId) =>
        set((state) => ({
          intentionUsage: {
            ...state.intentionUsage,
            [intentionId]: (state.intentionUsage[intentionId] || 0) + 1,
          },
        })),

      getTopStones: (count) => {
        const usage = get().stoneUsage;
        return Object.entries(usage)
          .map(([id, uses]) => ({ id, uses }))
          .sort((a, b) => b.uses - a.uses)
          .slice(0, count);
      },

      getTopIntentions: (count) => {
        const usage = get().intentionUsage;
        return Object.entries(usage)
          .map(([id, uses]) => ({ id, uses }))
          .sort((a, b) => b.uses - a.uses)
          .slice(0, count);
      },

      getTopColors: (count) => {
        const usage = get().colorUsage;
        return Object.entries(usage)
          .map(([id, uses]) => ({ id, uses }))
          .sort((a, b) => b.uses - a.uses)
          .slice(0, count);
      },

      generateInsights: () => {
        const state = get();
        const messages: string[] = [];

        // Top color insight
        const topColors = Object.entries(state.colorUsage)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 2);

        for (const [color] of topColors) {
          const templates = INSIGHT_TEMPLATES_EN[color];
          if (templates) {
            messages.push(templates[Math.floor(Math.random() * templates.length)]);
          }
        }

        // Top intention insight
        const topIntentions = Object.entries(state.intentionUsage)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 1);

        for (const [intention] of topIntentions) {
          const templates = INSIGHT_TEMPLATES_EN[intention];
          if (templates) {
            messages.push(templates[Math.floor(Math.random() * templates.length)]);
          }
        }

        set({ insights: messages });
        return messages;
      },
    }),
    {
      name: "ishi-insights",
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({
        stoneUsage: state.stoneUsage,
        intentionUsage: state.intentionUsage,
        colorUsage: state.colorUsage,
      }),
    }
  )
);
