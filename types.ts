export type Rarity = "common" | "uncommon" | "rare";
export type SubscriptionTier = "free" | "tsuki" | "hoshi";
export type ChakraId =
  | "root"
  | "sacral"
  | "solar_plexus"
  | "heart"
  | "throat"
  | "third_eye"
  | "crown";
export type IntentionId =
  | "love"
  | "prosperity"
  | "healing"
  | "protection"
  | "spiritual"
  | "calm"
  | "career"
  | "courage"
  | "purification"
  | "balance"
  | "amplify"
  | "creativity"
  | "wisdom";
export type TemplateCategory = "basic" | "japanese" | "sacred" | "custom";
export type AdPlacement =
  | "stone_detail"
  | "post_grid"
  | "library_footer"
  | "session_end"
  | "daily_intention";

export interface Stone {
  id: string;
  name_en: string;
  name_jp: string;
  reading: string;
  color_primary: string;
  color_hex: string;
  origin_japan: boolean;
  origin_region: string | null;
  chakras: ChakraId[];
  intentions: string[];
  hardness: number;
  rarity: Rarity;
  tier: number;
  unlock_level: number;
  description_en: string;
  description_jp: string;
  lore_en: string;
  lore_jp: string;
}

export interface GridTemplate {
  id: string;
  name_en: string;
  name_jp: string;
  geometry_type: string;
  point_count: number;
  points: { x: number; y: number }[];
  symmetry_axes: number;
  unlock_level: number;
  required_tier: SubscriptionTier;
  category: TemplateCategory;
  intentions: string[];
}

export interface StonePlacement {
  stoneId: string;
  x: number;
  y: number;
  rotation: number;
}

export interface SavedGrid {
  id: string;
  templateId: string | null;
  name: string;
  intention: string | null;
  placements: StonePlacement[];
  isShared: boolean;
  favoriteCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserProgress {
  xpTotal: number;
  level: number;
  currentStreakDays: number;
  longestStreakDays: number;
  stonesUnlocked: string[];
  templatesUnlocked: string[];
  skillsCompleted: string[];
  achievements: string[];
  gridsCompletedCount: number;
  guidedSessionsCount: number;
  dailyIntentionToday: boolean;
  lastActiveDate: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarStoneId: string;
  language: "en" | "jp";
  birthMonth: number;
  subscriptionTier: SubscriptionTier;
  subscriptionExpires: string | null;
}

export interface GemSellerAd {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerLogo: string;
  stoneId: string;
  headline_en: string;
  headline_jp: string;
  imageUrl: string;
  destinationUrl: string;
  priceRange: string;
  placement: AdPlacement;
}

export const XP_TABLE: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 450,
  5: 700,
  6: 1000,
  7: 1400,
  8: 1900,
  9: 2500,
  10: 3200,
  11: 4000,
  12: 5000,
  15: 8000,
  18: 12000,
  20: 16000,
};

export const XP_REWARDS = {
  COMPLETE_GRID: 20,
  COMPLETE_SESSION: 30,
  NEW_STONE_USED: 15,
  DAILY_INTENTION: 10,
  NEW_TEMPLATE: 25,
  SHARE_GRID: 10,
  STREAK_7: 50,
  STREAK_30: 200,
  READ_LORE: 5,
  SKILL_CHALLENGE: 50,
} as const;
