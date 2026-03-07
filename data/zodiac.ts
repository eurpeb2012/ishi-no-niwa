/**
 * Zodiac sign to crystal mapping for birth crystal recommendations.
 */

export interface ZodiacSign {
  id: string;
  name_en: string;
  name_jp: string;
  glyph: string;
  element_en: string;
  element_jp: string;
  months: [number, number, number, number]; // [startMonth, startDay, endMonth, endDay]
  stones: string[];
  rulingPlanet_en: string;
  rulingPlanet_jp: string;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: "aries", name_en: "Aries", name_jp: "牡羊座", glyph: "\u2648", element_en: "Fire", element_jp: "火", months: [3, 21, 4, 19], stones: ["carnelian", "garnet", "tigers_eye"], rulingPlanet_en: "Mars", rulingPlanet_jp: "火星" },
  { id: "taurus", name_en: "Taurus", name_jp: "牡牛座", glyph: "\u2649", element_en: "Earth", element_jp: "地", months: [4, 20, 5, 20], stones: ["rose_quartz", "jade_jadeite", "malachite"], rulingPlanet_en: "Venus", rulingPlanet_jp: "金星" },
  { id: "gemini", name_en: "Gemini", name_jp: "双子座", glyph: "\u264A", element_en: "Air", element_jp: "風", months: [5, 21, 6, 20], stones: ["citrine", "agate", "clear_quartz"], rulingPlanet_en: "Mercury", rulingPlanet_jp: "水星" },
  { id: "cancer", name_en: "Cancer", name_jp: "蟹座", glyph: "\u264B", element_en: "Water", element_jp: "水", months: [6, 21, 7, 22], stones: ["moonstone", "rose_quartz", "rhodonite"], rulingPlanet_en: "Moon", rulingPlanet_jp: "月" },
  { id: "leo", name_en: "Leo", name_jp: "獅子座", glyph: "\u264C", element_en: "Fire", element_jp: "火", months: [7, 23, 8, 22], stones: ["tigers_eye", "citrine", "amber"], rulingPlanet_en: "Sun", rulingPlanet_jp: "太陽" },
  { id: "virgo", name_en: "Virgo", name_jp: "乙女座", glyph: "\u264D", element_en: "Earth", element_jp: "地", months: [8, 23, 9, 22], stones: ["fluorite", "green_aventurine", "prehnite"], rulingPlanet_en: "Mercury", rulingPlanet_jp: "水星" },
  { id: "libra", name_en: "Libra", name_jp: "天秤座", glyph: "\u264E", element_en: "Air", element_jp: "風", months: [9, 23, 10, 22], stones: ["rose_quartz", "lapis_lazuli", "aquamarine"], rulingPlanet_en: "Venus", rulingPlanet_jp: "金星" },
  { id: "scorpio", name_en: "Scorpio", name_jp: "蠍座", glyph: "\u264F", element_en: "Water", element_jp: "水", months: [10, 23, 11, 21], stones: ["black_obsidian", "garnet", "labradorite"], rulingPlanet_en: "Pluto", rulingPlanet_jp: "冥王星" },
  { id: "sagittarius", name_en: "Sagittarius", name_jp: "射手座", glyph: "\u2650", element_en: "Fire", element_jp: "火", months: [11, 22, 12, 21], stones: ["turquoise", "lapis_lazuli", "amethyst"], rulingPlanet_en: "Jupiter", rulingPlanet_jp: "木星" },
  { id: "capricorn", name_en: "Capricorn", name_jp: "山羊座", glyph: "\u2651", element_en: "Earth", element_jp: "地", months: [12, 22, 1, 19], stones: ["garnet", "smoky_quartz", "black_tourmaline"], rulingPlanet_en: "Saturn", rulingPlanet_jp: "土星" },
  { id: "aquarius", name_en: "Aquarius", name_jp: "水瓶座", glyph: "\u2652", element_en: "Air", element_jp: "風", months: [1, 20, 2, 18], stones: ["amethyst", "aquamarine", "labradorite"], rulingPlanet_en: "Uranus", rulingPlanet_jp: "天王星" },
  { id: "pisces", name_en: "Pisces", name_jp: "魚座", glyph: "\u2653", element_en: "Water", element_jp: "水", months: [2, 19, 3, 20], stones: ["amethyst", "moonstone", "fluorite"], rulingPlanet_en: "Neptune", rulingPlanet_jp: "海王星" },
];

function dateInRange(month: number, day: number, range: [number, number, number, number]): boolean {
  const [sm, sd, em, ed] = range;
  if (sm <= em) {
    return (month > sm || (month === sm && day >= sd)) && (month < em || (month === em && day <= ed));
  }
  // Wraps around year boundary (e.g., Capricorn: Dec 22 - Jan 19)
  return (month > sm || (month === sm && day >= sd)) || (month < em || (month === em && day <= ed));
}

export function getZodiacForDate(month: number, day: number): ZodiacSign {
  return ZODIAC_SIGNS.find((z) => dateInRange(month, day, z.months)) || ZODIAC_SIGNS[0];
}

export function getZodiacForBirthMonth(birthMonth: number): ZodiacSign {
  // Approximate: use the 15th of the month
  return getZodiacForDate(birthMonth, 15);
}

export function getAllZodiacSigns(): ZodiacSign[] {
  return ZODIAC_SIGNS;
}
