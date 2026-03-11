/**
 * Crystal rarity tiers — based on real-world rarity and value.
 * Crystals are "common" through "legendary" (gem-quality).
 * From the Mar 10 meeting: same crystal name can exist at different qualities.
 * Low quality = crystal, high quality = gem.
 */

export type CrystalRarityTier = "common" | "uncommon" | "rare" | "legendary";

export interface CrystalRarityInfo {
  tier: CrystalRarityTier;
  name_en: string;
  name_jp: string;
  color: string;
  dropRate: number; // probability of getting from daily crystal (0-1)
  energyMultiplier: number; // energy bonus when used in grids
}

export const CRYSTAL_RARITY_TIERS: Record<CrystalRarityTier, CrystalRarityInfo> = {
  common: {
    tier: "common",
    name_en: "Common Crystal",
    name_jp: "コモンクリスタル",
    color: "#A0A0A0",
    dropRate: 0.50,
    energyMultiplier: 1.0,
  },
  uncommon: {
    tier: "uncommon",
    name_en: "Quality Crystal",
    name_jp: "クオリティクリスタル",
    color: "#4ECDC4",
    dropRate: 0.30,
    energyMultiplier: 1.5,
  },
  rare: {
    tier: "rare",
    name_en: "Rare Crystal",
    name_jp: "レアクリスタル",
    color: "#9B59B6",
    dropRate: 0.15,
    energyMultiplier: 2.0,
  },
  legendary: {
    tier: "legendary",
    name_en: "Gem Quality",
    name_jp: "宝石クオリティ",
    color: "#FFD700",
    dropRate: 0.05,
    energyMultiplier: 3.0,
  },
};

/**
 * Maps stone IDs to their rarity tier.
 * Defaults to "common" if not listed.
 * Based on real-world crystal rarity and market value.
 */
export const STONE_RARITY_MAP: Record<string, CrystalRarityTier> = {
  // Common — everyday crystals, easy to find
  rose_quartz: "common",
  amethyst: "common",
  clear_quartz: "common",
  smoky_quartz: "common",
  tigers_eye: "common",
  black_tourmaline: "common",
  carnelian: "common",
  agate: "common",
  obsidian: "common",
  hematite: "common",
  jasper: "common",
  sodalite: "common",

  // Uncommon — mid-range, available but pricier
  citrine: "uncommon",
  aquamarine: "uncommon",
  garnet: "uncommon",
  peridot: "uncommon",
  fluorite: "uncommon",
  moonstone: "uncommon",
  lapis_lazuli: "uncommon",
  jade_jadeite: "uncommon",
  rhodonite: "uncommon",
  chrysanthemum_stone: "uncommon",
  turquoise: "uncommon",
  prehnite: "uncommon",
  onyx: "uncommon",

  // Rare — hard to find, collectors seek these
  labradorite: "rare",
  sugilite: "rare",
  malachite: "rare",
  kunzite: "rare",
  tanzanite: "rare",
  larimar: "rare",
  alexandrite: "rare",
  moldavite: "rare",

  // Legendary — gem-quality, extremely valuable
  ruby: "legendary",
  sapphire: "legendary",
  emerald: "legendary",
  diamond: "legendary",
  black_opal: "legendary",
  paraiba_tourmaline: "legendary",
};

/** Get rarity tier for a stone, defaults to common */
export function getStoneRarity(stoneId: string): CrystalRarityTier {
  return STONE_RARITY_MAP[stoneId] || "common";
}

/** Get full rarity info for a stone */
export function getStoneRarityInfo(stoneId: string): CrystalRarityInfo {
  return CRYSTAL_RARITY_TIERS[getStoneRarity(stoneId)];
}
