import type { IntentionId } from "../types";

export interface Quest {
  id: string;
  name_en: string;
  name_jp: string;
  desc_en: string;
  desc_jp: string;
  type: "grid_intention" | "grid_count" | "stone_use" | "session" | "streak" | "journal";
  /** For grid_intention quests, which intention to build */
  intention?: IntentionId;
  /** Specific stone IDs required (for stone_use) */
  stoneIds?: string[];
  /** How many times to complete the action */
  target: number;
  /** XP reward */
  xpReward: number;
  /** Energy reward */
  energyReward: number;
  /** Fairy bond points reward */
  bondReward: number;
  /** Difficulty tier (affects when quests appear) */
  tier: 1 | 2 | 3;
}

export const ALL_QUESTS: Quest[] = [
  // Tier 1 — beginner quests
  {
    id: "love_grids_3",
    name_en: "Love Grid Creator",
    name_jp: "愛のグリッド作成",
    desc_en: "Build 3 grids with love intention",
    desc_jp: "恋愛の意図でグリッドを3つ作成",
    type: "grid_intention",
    intention: "love",
    target: 3,
    xpReward: 30,
    energyReward: 15,
    bondReward: 5,
    tier: 1,
  },
  {
    id: "calm_grids_3",
    name_en: "Peaceful Builder",
    name_jp: "平和の構築者",
    desc_en: "Build 3 grids with calm intention",
    desc_jp: "癒しの意図でグリッドを3つ作成",
    type: "grid_intention",
    intention: "calm",
    target: 3,
    xpReward: 30,
    energyReward: 15,
    bondReward: 5,
    tier: 1,
  },
  {
    id: "first_5_grids",
    name_en: "Grid Beginner",
    name_jp: "グリッド入門",
    desc_en: "Complete 5 crystal grids",
    desc_jp: "クリスタルグリッドを5つ完成",
    type: "grid_count",
    target: 5,
    xpReward: 40,
    energyReward: 20,
    bondReward: 8,
    tier: 1,
  },
  {
    id: "use_rose_quartz_3",
    name_en: "Rose Quartz Lover",
    name_jp: "ローズクォーツの愛好家",
    desc_en: "Use Rose Quartz in 3 different grids",
    desc_jp: "ローズクォーツを3つの異なるグリッドで使用",
    type: "stone_use",
    stoneIds: ["rose_quartz"],
    target: 3,
    xpReward: 25,
    energyReward: 10,
    bondReward: 4,
    tier: 1,
  },
  {
    id: "journal_3",
    name_en: "Reflective Spirit",
    name_jp: "振り返りの精神",
    desc_en: "Write 3 journal entries",
    desc_jp: "ジャーナルを3回記録",
    type: "journal",
    target: 3,
    xpReward: 20,
    energyReward: 10,
    bondReward: 5,
    tier: 1,
  },
  {
    id: "streak_3",
    name_en: "Three Day Journey",
    name_jp: "3日間の旅",
    desc_en: "Maintain a 3-day streak",
    desc_jp: "3日間の連続を達成",
    type: "streak",
    target: 3,
    xpReward: 25,
    energyReward: 15,
    bondReward: 5,
    tier: 1,
  },

  // Tier 2 — intermediate quests
  {
    id: "love_grids_5",
    name_en: "Love Master",
    name_jp: "愛の達人",
    desc_en: "Build 5 grids with love intention",
    desc_jp: "恋愛の意図でグリッドを5つ作成",
    type: "grid_intention",
    intention: "love",
    target: 5,
    xpReward: 50,
    energyReward: 30,
    bondReward: 10,
    tier: 2,
  },
  {
    id: "protection_grids_5",
    name_en: "Shield Weaver",
    name_jp: "守護の織り手",
    desc_en: "Build 5 grids with protection intention",
    desc_jp: "厄除けの意図でグリッドを5つ作成",
    type: "grid_intention",
    intention: "protection",
    target: 5,
    xpReward: 50,
    energyReward: 30,
    bondReward: 10,
    tier: 2,
  },
  {
    id: "healing_grids_5",
    name_en: "Healer's Path",
    name_jp: "癒しの道",
    desc_en: "Build 5 grids with healing intention",
    desc_jp: "健康の意図でグリッドを5つ作成",
    type: "grid_intention",
    intention: "healing",
    target: 5,
    xpReward: 50,
    energyReward: 30,
    bondReward: 10,
    tier: 2,
  },
  {
    id: "prosperity_grids_5",
    name_en: "Abundance Seeker",
    name_jp: "豊穣の探求者",
    desc_en: "Build 5 grids with prosperity intention",
    desc_jp: "金運の意図でグリッドを5つ作成",
    type: "grid_intention",
    intention: "prosperity",
    target: 5,
    xpReward: 50,
    energyReward: 30,
    bondReward: 10,
    tier: 2,
  },
  {
    id: "grids_15",
    name_en: "Dedicated Creator",
    name_jp: "献身のクリエイター",
    desc_en: "Complete 15 crystal grids",
    desc_jp: "クリスタルグリッドを15個完成",
    type: "grid_count",
    target: 15,
    xpReward: 60,
    energyReward: 40,
    bondReward: 12,
    tier: 2,
  },
  {
    id: "session_5",
    name_en: "Meditation Explorer",
    name_jp: "瞑想の探求者",
    desc_en: "Complete 5 guided sessions",
    desc_jp: "ガイド瞑想を5回完了",
    type: "session",
    target: 5,
    xpReward: 40,
    energyReward: 25,
    bondReward: 8,
    tier: 2,
  },
  {
    id: "streak_7",
    name_en: "Week Warrior",
    name_jp: "一週間の戦士",
    desc_en: "Maintain a 7-day streak",
    desc_jp: "7日間の連続を達成",
    type: "streak",
    target: 7,
    xpReward: 50,
    energyReward: 30,
    bondReward: 10,
    tier: 2,
  },

  // Tier 3 — advanced quests
  {
    id: "grids_50",
    name_en: "Grid Grandmaster",
    name_jp: "グリッドの大師範",
    desc_en: "Complete 50 crystal grids",
    desc_jp: "クリスタルグリッドを50個完成",
    type: "grid_count",
    target: 50,
    xpReward: 100,
    energyReward: 80,
    bondReward: 25,
    tier: 3,
  },
  {
    id: "streak_30",
    name_en: "Moon Cycle Master",
    name_jp: "月の周期の達人",
    desc_en: "Maintain a 30-day streak",
    desc_jp: "30日間の連続を達成",
    type: "streak",
    target: 30,
    xpReward: 200,
    energyReward: 100,
    bondReward: 30,
    tier: 3,
  },
  {
    id: "session_20",
    name_en: "Meditation Master",
    name_jp: "瞑想の達人",
    desc_en: "Complete 20 guided sessions",
    desc_jp: "ガイド瞑想を20回完了",
    type: "session",
    target: 20,
    xpReward: 80,
    energyReward: 60,
    bondReward: 20,
    tier: 3,
  },
  {
    id: "journal_20",
    name_en: "Soul Writer",
    name_jp: "魂の記録者",
    desc_en: "Write 20 journal entries",
    desc_jp: "ジャーナルを20回記録",
    type: "journal",
    target: 20,
    xpReward: 60,
    energyReward: 40,
    bondReward: 15,
    tier: 3,
  },
];

/** Get quests available for a given level */
export function getAvailableQuests(level: number): Quest[] {
  if (level >= 9) return ALL_QUESTS;
  if (level >= 5) return ALL_QUESTS.filter((q) => q.tier <= 2);
  return ALL_QUESTS.filter((q) => q.tier <= 1);
}
