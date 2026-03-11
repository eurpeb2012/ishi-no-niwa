/**
 * Fairy outfit/customization items.
 * Inspired by Takae's concept art — watercolor kawaii style.
 * Outfits are earned via quests or purchased via IAP.
 */

export type OutfitSlot = "wings" | "dress" | "accessory" | "crown";

export interface FairyOutfit {
  id: string;
  slot: OutfitSlot;
  name_en: string;
  name_jp: string;
  desc_en: string;
  desc_jp: string;
  /** How to obtain: quest reward, purchase, or evolution unlock */
  obtainMethod: "quest" | "purchase" | "evolution" | "default";
  /** Quest ID that rewards this (if quest) */
  questId?: string;
  /** Evolution stage that unlocks this */
  evolutionStage?: 1 | 2 | 3 | 4 | 5;
  /** Visual style attributes for rendering */
  style: OutfitStyle;
}

export interface OutfitStyle {
  /** Primary color overlay (null = use fairy color) */
  colorOverride?: string | null;
  /** Pattern type for wings/dress */
  pattern: "solid" | "gradient" | "petal" | "crystal" | "starry" | "sakura" | "aurora";
  /** Opacity of accent elements */
  accentOpacity: number;
  /** Glyph displayed for the item */
  glyph: string;
  /** Extra sparkle effect */
  sparkle: boolean;
  /** Wing shape modifier (for wings slot) */
  wingShape?: "round" | "petal" | "butterfly" | "crystal" | "feather";
  /** Crown/accessory decoration glyphs */
  decorGlyphs?: string[];
}

export const ALL_OUTFITS: FairyOutfit[] = [
  // Default outfits (always available)
  {
    id: "wings_default",
    slot: "wings",
    name_en: "Basic Wings",
    name_jp: "基本の羽",
    desc_en: "Simple translucent fairy wings",
    desc_jp: "シンプルな半透明の妖精の羽",
    obtainMethod: "default",
    style: {
      pattern: "solid",
      accentOpacity: 0.8,
      glyph: "\u{1FAB6}",
      sparkle: false,
      wingShape: "round",
    },
  },
  {
    id: "dress_default",
    slot: "dress",
    name_en: "Crystal Dress",
    name_jp: "クリスタルドレス",
    desc_en: "A simple dress in your fairy's color",
    desc_jp: "妖精の色に合わせたシンプルなドレス",
    obtainMethod: "default",
    style: {
      pattern: "solid",
      accentOpacity: 1.0,
      glyph: "\u{1F457}",
      sparkle: false,
    },
  },
  {
    id: "crown_default",
    slot: "crown",
    name_en: "Seedling Sprout",
    name_jp: "芽生えの新芽",
    desc_en: "A tiny sprout atop your fairy",
    desc_jp: "妖精の頭の小さな新芽",
    obtainMethod: "default",
    style: {
      pattern: "solid",
      accentOpacity: 0.9,
      glyph: "\u{1F331}",
      sparkle: false,
      decorGlyphs: ["\u{1F331}"],
    },
  },

  // Evolution-unlocked outfits
  {
    id: "wings_petal",
    slot: "wings",
    name_en: "Petal Wings",
    name_jp: "花びらの羽",
    desc_en: "Soft petal-shaped wings with gradient edges",
    desc_jp: "グラデーションの花びら型の羽",
    obtainMethod: "evolution",
    evolutionStage: 2,
    style: {
      pattern: "petal",
      accentOpacity: 0.85,
      glyph: "\u{1F33A}",
      sparkle: false,
      wingShape: "petal",
    },
  },
  {
    id: "crown_flower",
    slot: "crown",
    name_en: "Flower Crown",
    name_jp: "花の冠",
    desc_en: "A delicate crown of tiny flowers",
    desc_jp: "小さな花の繊細な冠",
    obtainMethod: "evolution",
    evolutionStage: 3,
    style: {
      pattern: "petal",
      accentOpacity: 0.9,
      glyph: "\u{1F33A}",
      sparkle: false,
      decorGlyphs: ["\u{1F33C}", "\u{1F33A}", "\u{1F33C}"],
    },
  },
  {
    id: "wings_crystal",
    slot: "wings",
    name_en: "Crystal Wings",
    name_jp: "水晶の羽",
    desc_en: "Faceted crystal wings that catch the light",
    desc_jp: "光を反射するファセットカットのクリスタルの羽",
    obtainMethod: "evolution",
    evolutionStage: 4,
    style: {
      pattern: "crystal",
      accentOpacity: 0.9,
      glyph: "\u{1F48E}",
      sparkle: true,
      wingShape: "crystal",
    },
  },
  {
    id: "crown_crystal",
    slot: "crown",
    name_en: "Crystal Tiara",
    name_jp: "クリスタルティアラ",
    desc_en: "A gleaming tiara with crystal facets",
    desc_jp: "クリスタルファセットの輝くティアラ",
    obtainMethod: "evolution",
    evolutionStage: 4,
    style: {
      pattern: "crystal",
      accentOpacity: 1.0,
      glyph: "\u{1F451}",
      sparkle: true,
      decorGlyphs: ["\u2728", "\u{1F451}", "\u2728"],
    },
  },
  {
    id: "wings_guardian",
    slot: "wings",
    name_en: "Guardian Wings",
    name_jp: "守護の翼",
    desc_en: "Majestic wings with golden aura",
    desc_jp: "金色のオーラを持つ威厳ある翼",
    obtainMethod: "evolution",
    evolutionStage: 5,
    style: {
      colorOverride: "#FFD70040",
      pattern: "aurora",
      accentOpacity: 0.95,
      glyph: "\u{1F31F}",
      sparkle: true,
      wingShape: "feather",
    },
  },
  {
    id: "dress_guardian",
    slot: "dress",
    name_en: "Guardian Gown",
    name_jp: "守護の衣",
    desc_en: "An ethereal flowing gown with crystal accents",
    desc_jp: "クリスタルの飾りが付いた幻想的な流れるガウン",
    obtainMethod: "evolution",
    evolutionStage: 5,
    style: {
      pattern: "aurora",
      accentOpacity: 1.0,
      glyph: "\u{1F31F}",
      sparkle: true,
    },
  },

  // Quest-reward outfits
  {
    id: "dress_love",
    slot: "dress",
    name_en: "Heart Blossom Dress",
    name_jp: "ハートの花ドレス",
    desc_en: "Earned by mastering love grids",
    desc_jp: "愛のグリッドをマスターして獲得",
    obtainMethod: "quest",
    questId: "love_grids_5",
    style: {
      colorOverride: "#FFB6C1",
      pattern: "petal",
      accentOpacity: 0.95,
      glyph: "\u{1F338}",
      sparkle: false,
    },
  },
  {
    id: "accessory_shield",
    slot: "accessory",
    name_en: "Protection Charm",
    name_jp: "護りのお守り",
    desc_en: "Earned by completing shield weaver quest",
    desc_jp: "守護の織り手クエストを完了して獲得",
    obtainMethod: "quest",
    questId: "protection_grids_5",
    style: {
      pattern: "crystal",
      accentOpacity: 0.9,
      glyph: "\u{1F6E1}",
      sparkle: true,
      decorGlyphs: ["\u{1F6E1}"],
    },
  },
  {
    id: "crown_master",
    slot: "crown",
    name_en: "Grand Master Crown",
    name_jp: "グランドマスターの冠",
    desc_en: "Earned by completing 50 grids",
    desc_jp: "50個のグリッド完成で獲得",
    obtainMethod: "quest",
    questId: "grids_50",
    style: {
      colorOverride: "#FFD700",
      pattern: "starry",
      accentOpacity: 1.0,
      glyph: "\u{1F451}",
      sparkle: true,
      decorGlyphs: ["\u{1F31F}", "\u{1F451}", "\u{1F31F}"],
    },
  },

  // Purchasable outfits (IAP)
  {
    id: "wings_sakura",
    slot: "wings",
    name_en: "Sakura Wings",
    name_jp: "桜の羽",
    desc_en: "Delicate cherry blossom wings",
    desc_jp: "繊細な桜の花びらの羽",
    obtainMethod: "purchase",
    style: {
      colorOverride: "#FFB7C5",
      pattern: "sakura",
      accentOpacity: 0.9,
      glyph: "\u{1F338}",
      sparkle: true,
      wingShape: "butterfly",
    },
  },
  {
    id: "dress_moonlight",
    slot: "dress",
    name_en: "Moonlight Gown",
    name_jp: "月光のドレス",
    desc_en: "An ethereal moonlit fairy dress",
    desc_jp: "幻想的な月光の妖精ドレス",
    obtainMethod: "purchase",
    style: {
      colorOverride: "#C0C8E0",
      pattern: "starry",
      accentOpacity: 0.95,
      glyph: "\u{1F319}",
      sparkle: true,
    },
  },
  {
    id: "wings_aurora",
    slot: "wings",
    name_en: "Aurora Wings",
    name_jp: "オーロラの羽",
    desc_en: "Shimmering aurora borealis wings",
    desc_jp: "きらめくオーロラの羽",
    obtainMethod: "purchase",
    style: {
      pattern: "aurora",
      accentOpacity: 0.9,
      glyph: "\u{1F30C}",
      sparkle: true,
      wingShape: "butterfly",
    },
  },
];

/** Get outfits available to the player */
export function getUnlockedOutfits(
  evolutionStage: number,
  completedQuestIds: string[],
  purchasedOutfitIds: string[],
): FairyOutfit[] {
  return ALL_OUTFITS.filter((outfit) => {
    if (outfit.obtainMethod === "default") return true;
    if (outfit.obtainMethod === "evolution") return evolutionStage >= (outfit.evolutionStage || 1);
    if (outfit.obtainMethod === "quest") return outfit.questId ? completedQuestIds.includes(outfit.questId) : false;
    if (outfit.obtainMethod === "purchase") return purchasedOutfitIds.includes(outfit.id);
    return false;
  });
}

/** Get all outfits for a given slot */
export function getOutfitsBySlot(slot: OutfitSlot): FairyOutfit[] {
  return ALL_OUTFITS.filter((o) => o.slot === slot);
}
