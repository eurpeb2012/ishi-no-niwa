/**
 * Crystal shop partnerships — real crystal shops advertised in-app.
 * From Mar 10 meeting: partner with crystal shops, advertise in exchange
 * for photos/crystals.
 */

export interface CrystalShop {
  id: string;
  name_en: string;
  name_jp: string;
  location_en: string;
  location_jp: string;
  desc_en: string;
  desc_jp: string;
  /** Specialty crystals this shop is known for */
  specialtyStoneIds: string[];
  /** Logo glyph (placeholder until real logos) */
  glyph: string;
  /** Background color for the card */
  accentColor: string;
  /** Whether this is a featured/premium partner */
  isFeatured: boolean;
  /** Tags for filtering */
  tags: string[];
}

export const CRYSTAL_SHOPS: CrystalShop[] = [
  {
    id: "shop_shibuya_crystals",
    name_en: "Shibuya Crystal Gallery",
    name_jp: "渋谷クリスタルギャラリー",
    location_en: "Shibuya, Tokyo",
    location_jp: "東京・渋谷",
    desc_en: "Premium crystal gallery specializing in Japanese native crystals and rare imports",
    desc_jp: "日本産クリスタルと希少な輸入品を専門とするプレミアムクリスタルギャラリー",
    specialtyStoneIds: ["amethyst", "chrysanthemum_stone", "jade_jadeite", "smoky_quartz"],
    glyph: "\u{1F48E}",
    accentColor: "#9B59B6",
    isFeatured: true,
    tags: ["japan", "native", "gallery", "premium"],
  },
  {
    id: "shop_healing_stones_jp",
    name_en: "Healing Stones Japan",
    name_jp: "ヒーリングストーンズジャパン",
    location_en: "Harajuku, Tokyo",
    location_jp: "東京・原宿",
    desc_en: "Curated collection of healing crystals and power stones",
    desc_jp: "癒しのクリスタルとパワーストーンの厳選コレクション",
    specialtyStoneIds: ["rose_quartz", "moonstone", "labradorite", "fluorite"],
    glyph: "\u2728",
    accentColor: "#F4A0B5",
    isFeatured: true,
    tags: ["healing", "power_stone", "curated"],
  },
  {
    id: "shop_mineral_market",
    name_en: "Crystal Mineral Market",
    name_jp: "クリスタルミネラルマーケット",
    location_en: "Ikebukuro, Tokyo",
    location_jp: "東京・池袋",
    desc_en: "Large selection of raw and polished crystals at fair prices",
    desc_jp: "原石と磨き石の豊富な品揃え、適正価格",
    specialtyStoneIds: ["clear_quartz", "citrine", "tigers_eye", "carnelian", "hematite"],
    glyph: "\u{1F48E}",
    accentColor: "#E8B86D",
    isFeatured: false,
    tags: ["affordable", "variety", "raw", "polished"],
  },
  {
    id: "shop_gem_palace",
    name_en: "Gem Palace Kyoto",
    name_jp: "宝石パレス京都",
    location_en: "Gion, Kyoto",
    location_jp: "京都・祇園",
    desc_en: "Exquisite gem-quality crystals in a traditional Kyoto setting",
    desc_jp: "伝統的な京都の空間で宝石品質のクリスタルを",
    specialtyStoneIds: ["ruby", "sapphire", "emerald", "tanzanite"],
    glyph: "\u{1F451}",
    accentColor: "#FFD700",
    isFeatured: true,
    tags: ["luxury", "gem_quality", "kyoto", "traditional"],
  },
  {
    id: "shop_earth_crystal",
    name_en: "Earth Crystal Online",
    name_jp: "アースクリスタルオンライン",
    location_en: "Online Shop",
    location_jp: "オンラインショップ",
    desc_en: "Worldwide crystal delivery with authenticity certificates",
    desc_jp: "鑑定書付きの世界中のクリスタルをお届け",
    specialtyStoneIds: ["malachite", "turquoise", "lapis_lazuli", "sugilite"],
    glyph: "\u{1F30D}",
    accentColor: "#4ECDC4",
    isFeatured: false,
    tags: ["online", "worldwide", "certified", "rare"],
  },
];

/** Get featured partner shops */
export function getFeaturedShops(): CrystalShop[] {
  return CRYSTAL_SHOPS.filter((s) => s.isFeatured);
}

/** Find shops that sell a specific crystal */
export function getShopsForStone(stoneId: string): CrystalShop[] {
  return CRYSTAL_SHOPS.filter((s) => s.specialtyStoneIds.includes(stoneId));
}
