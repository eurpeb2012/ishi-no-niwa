/**
 * In-App Purchase product definitions.
 * These are crystal packs and rare crystal unlocks (separate from subscription).
 */

export interface IAPProduct {
  id: string;
  name_en: string;
  name_jp: string;
  desc_en: string;
  desc_jp: string;
  type: "crystal_pack" | "rare_crystal" | "energy_pack" | "fairy_outfit";
  price: string; // display price
  /** Crystal IDs included (for crystal packs) */
  stoneIds?: string[];
  /** Energy amount (for energy packs) */
  energyAmount?: number;
  /** Fairy outfit item ID (for fairy outfits) */
  outfitItemId?: string;
  /** Rarity indicator for display */
  rarity: "common" | "uncommon" | "rare" | "legendary";
  /** Icon/glyph for display */
  glyph: string;
}

export const IAP_PRODUCTS: IAPProduct[] = [
  // Crystal Packs
  {
    id: "pack_starter",
    name_en: "Starter Crystal Pack",
    name_jp: "スタータークリスタルパック",
    desc_en: "5 essential crystals to begin your journey",
    desc_jp: "旅を始めるための5つの基本クリスタル",
    type: "crystal_pack",
    price: "$1.99",
    stoneIds: ["rose_quartz", "amethyst", "clear_quartz", "tigers_eye", "black_tourmaline"],
    rarity: "common",
    glyph: "\u{1F48E}",
  },
  {
    id: "pack_chakra",
    name_en: "Chakra Crystal Set",
    name_jp: "チャクラクリスタルセット",
    desc_en: "7 crystals for all 7 chakras",
    desc_jp: "7つのチャクラに対応する7つのクリスタル",
    type: "crystal_pack",
    price: "$3.99",
    stoneIds: ["garnet", "carnelian", "citrine", "jade_jadeite", "aquamarine", "lapis_lazuli", "amethyst"],
    rarity: "uncommon",
    glyph: "\u{1F308}",
  },
  {
    id: "pack_japan",
    name_en: "Japan Native Collection",
    name_jp: "日本産クリスタルコレクション",
    desc_en: "Rare crystals native to Japan",
    desc_jp: "日本原産の希少クリスタル",
    type: "crystal_pack",
    price: "$4.99",
    stoneIds: ["chrysanthemum_stone", "jade_jadeite", "agate", "smoky_quartz"],
    rarity: "rare",
    glyph: "\u{1F5FE}",
  },
  {
    id: "pack_premium",
    name_en: "Premium Crystal Vault",
    name_jp: "プレミアムクリスタルコレクション",
    desc_en: "8 rare and legendary crystals",
    desc_jp: "希少・伝説級クリスタル8種",
    type: "crystal_pack",
    price: "$7.99",
    stoneIds: ["labradorite", "sugilite", "prehnite", "fluorite", "malachite", "turquoise", "rhodonite", "moonstone"],
    rarity: "legendary",
    glyph: "\u{1F451}",
  },

  // Individual Rare Crystals
  {
    id: "crystal_labradorite",
    name_en: "Labradorite",
    name_jp: "ラブラドライト",
    desc_en: "Unlock the mystical Labradorite",
    desc_jp: "神秘のラブラドライトを解放",
    type: "rare_crystal",
    price: "$0.99",
    stoneIds: ["labradorite"],
    rarity: "rare",
    glyph: "\u2728",
  },
  {
    id: "crystal_sugilite",
    name_en: "Sugilite",
    name_jp: "スギライト",
    desc_en: "Unlock the rare Sugilite",
    desc_jp: "希少なスギライトを解放",
    type: "rare_crystal",
    price: "$0.99",
    stoneIds: ["sugilite"],
    rarity: "rare",
    glyph: "\u2728",
  },

  // Energy Packs
  {
    id: "energy_small",
    name_en: "Energy Boost",
    name_jp: "エネルギーブースト",
    desc_en: "50 Crystal Energy for your fairy",
    desc_jp: "妖精のための50クリスタルエネルギー",
    type: "energy_pack",
    price: "$0.99",
    energyAmount: 50,
    rarity: "common",
    glyph: "\u26A1",
  },
  {
    id: "energy_large",
    name_en: "Energy Surge",
    name_jp: "エネルギーサージ",
    desc_en: "200 Crystal Energy for your fairy",
    desc_jp: "妖精のための200クリスタルエネルギー",
    type: "energy_pack",
    price: "$2.99",
    energyAmount: 200,
    rarity: "uncommon",
    glyph: "\u{1F4AB}",
  },

  // Fairy Outfits
  {
    id: "outfit_sakura",
    name_en: "Sakura Wings Set",
    name_jp: "桜の羽セット",
    desc_en: "Beautiful cherry blossom fairy outfit",
    desc_jp: "美しい桜の妖精衣装",
    type: "fairy_outfit",
    price: "$1.99",
    outfitItemId: "wings_sakura",
    rarity: "rare",
    glyph: "\u{1F338}",
  },
  {
    id: "outfit_moonlight",
    name_en: "Moonlight Gown",
    name_jp: "月光のドレス",
    desc_en: "Ethereal moonlit fairy dress",
    desc_jp: "幻想的な月光の妖精ドレス",
    type: "fairy_outfit",
    price: "$1.99",
    outfitItemId: "dress_moonlight",
    rarity: "rare",
    glyph: "\u{1F319}",
  },
];

/** Group products by type */
export function getProductsByType(type: IAPProduct["type"]): IAPProduct[] {
  return IAP_PRODUCTS.filter((p) => p.type === type);
}
