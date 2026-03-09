/**
 * Seasonal decorative items that can be placed on the crystal grid.
 * Limited-time collectibles — each has an availability window.
 */

export interface SeasonalItem {
  id: string;
  name_en: string;
  name_jp: string;
  glyph: string;
  color: string;
  season: "spring" | "summer" | "autumn" | "winter";
  availableMonths: number[]; // 1-12
}

export const SEASONAL_ITEMS: SeasonalItem[] = [
  // Spring (March - May)
  {
    id: "sakura",
    name_en: "Sakura",
    name_jp: "桜",
    glyph: "\uD83C\uDF38",
    color: "#FFB7C5",
    season: "spring",
    availableMonths: [3, 4, 5],
  },
  {
    id: "plum_blossom",
    name_en: "Plum Blossom",
    name_jp: "梅",
    glyph: "\uD83C\uDF3A",
    color: "#E8507A",
    season: "spring",
    availableMonths: [2, 3, 4],
  },
  {
    id: "butterfly",
    name_en: "Butterfly",
    name_jp: "蝶",
    glyph: "\uD83E\uDD8B",
    color: "#C8A2E8",
    season: "spring",
    availableMonths: [3, 4, 5],
  },

  // Summer (June - August)
  {
    id: "shell",
    name_en: "Seashell",
    name_jp: "貝殻",
    glyph: "\uD83D\uDC1A",
    color: "#FFD4A8",
    season: "summer",
    availableMonths: [6, 7, 8],
  },
  {
    id: "lotus",
    name_en: "Lotus",
    name_jp: "蓮",
    glyph: "\uD83E\uDEB7",
    color: "#F8A4C8",
    season: "summer",
    availableMonths: [6, 7, 8],
  },
  {
    id: "wave",
    name_en: "Wave",
    name_jp: "波",
    glyph: "\uD83C\uDF0A",
    color: "#64B5F6",
    season: "summer",
    availableMonths: [6, 7, 8],
  },

  // Autumn (September - November)
  {
    id: "maple_leaf",
    name_en: "Maple Leaf",
    name_jp: "紅葉",
    glyph: "\uD83C\uDF41",
    color: "#E65100",
    season: "autumn",
    availableMonths: [9, 10, 11],
  },
  {
    id: "chrysanthemum",
    name_en: "Chrysanthemum",
    name_jp: "菊",
    glyph: "\uD83C\uDF3B",
    color: "#FFD54F",
    season: "autumn",
    availableMonths: [9, 10, 11],
  },
  {
    id: "acorn",
    name_en: "Acorn",
    name_jp: "どんぐり",
    glyph: "\uD83C\uDF30",
    color: "#8D6E63",
    season: "autumn",
    availableMonths: [9, 10, 11],
  },

  // Winter (December - February)
  {
    id: "snowflake",
    name_en: "Snowflake",
    name_jp: "雪",
    glyph: "\u2744\uFE0F",
    color: "#B3E5FC",
    season: "winter",
    availableMonths: [12, 1, 2],
  },
  {
    id: "pine",
    name_en: "Pine Branch",
    name_jp: "松",
    glyph: "\uD83C\uDF32",
    color: "#2E7D32",
    season: "winter",
    availableMonths: [12, 1, 2],
  },
  {
    id: "crane",
    name_en: "Crane",
    name_jp: "鶴",
    glyph: "\uD83E\uDDA2",
    color: "#ECEFF1",
    season: "winter",
    availableMonths: [12, 1, 2],
  },
];

/**
 * Always-available decorative "Others" items — flowers, shells, nature elements.
 * These appear in the tray alongside crystals at all times.
 */
export const OTHERS_ITEMS: SeasonalItem[] = [
  { id: "rose", name_en: "Rose", name_jp: "薔薇", glyph: "\uD83C\uDF39", color: "#E8507A", season: "spring", availableMonths: [1,2,3,4,5,6,7,8,9,10,11,12] },
  { id: "sunflower", name_en: "Sunflower", name_jp: "ひまわり", glyph: "\uD83C\uDF3B", color: "#FFD54F", season: "summer", availableMonths: [1,2,3,4,5,6,7,8,9,10,11,12] },
  { id: "tulip", name_en: "Tulip", name_jp: "チューリップ", glyph: "\uD83C\uDF37", color: "#FF6B81", season: "spring", availableMonths: [1,2,3,4,5,6,7,8,9,10,11,12] },
  { id: "hibiscus", name_en: "Hibiscus", name_jp: "ハイビスカス", glyph: "\uD83C\uDF3A", color: "#FF6F91", season: "summer", availableMonths: [1,2,3,4,5,6,7,8,9,10,11,12] },
  { id: "shell_spiral", name_en: "Shell", name_jp: "貝殻", glyph: "\uD83D\uDC1A", color: "#FFD4A8", season: "summer", availableMonths: [1,2,3,4,5,6,7,8,9,10,11,12] },
  { id: "feather", name_en: "Feather", name_jp: "羽", glyph: "\uD83E\uDEB6", color: "#B0BEC5", season: "autumn", availableMonths: [1,2,3,4,5,6,7,8,9,10,11,12] },
  { id: "leaf", name_en: "Leaf", name_jp: "葉", glyph: "\uD83C\uDF3F", color: "#66BB6A", season: "spring", availableMonths: [1,2,3,4,5,6,7,8,9,10,11,12] },
  { id: "star", name_en: "Star", name_jp: "星", glyph: "\u2B50", color: "#FFD700", season: "winter", availableMonths: [1,2,3,4,5,6,7,8,9,10,11,12] },
];

/** Get items available this month */
export function getCurrentSeasonalItems(): SeasonalItem[] {
  const month = new Date().getMonth() + 1;
  return SEASONAL_ITEMS.filter((item) => item.availableMonths.includes(month));
}

/** Get always-available "Others" items */
export function getOthersItems(): SeasonalItem[] {
  return OTHERS_ITEMS;
}

/** Get current season name */
export function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}
