/**
 * Healing music tracks for guided sessions.
 * In production, these would reference actual audio files.
 * Currently mock data with metadata for UI display.
 */

export interface HealingTrack {
  id: string;
  name_en: string;
  name_jp: string;
  duration: number; // seconds
  category: "meditation" | "nature" | "crystal_bowls" | "binaural";
  intention: string;
  glyph: string;
  /** BPM — slower = more calming */
  bpm: number;
}

export const HEALING_TRACKS: HealingTrack[] = [
  // Meditation
  {
    id: "zen_garden",
    name_en: "Zen Garden",
    name_jp: "禅の庭",
    duration: 600,
    category: "meditation",
    intention: "calm",
    glyph: "\u{1F3B6}",
    bpm: 60,
  },
  {
    id: "crystal_meditation",
    name_en: "Crystal Meditation",
    name_jp: "クリスタル瞑想",
    duration: 900,
    category: "meditation",
    intention: "spiritual",
    glyph: "\u{1F3B5}",
    bpm: 55,
  },
  {
    id: "morning_light",
    name_en: "Morning Light",
    name_jp: "朝の光",
    duration: 480,
    category: "meditation",
    intention: "healing",
    glyph: "\u{1F305}",
    bpm: 65,
  },

  // Nature
  {
    id: "forest_stream",
    name_en: "Forest Stream",
    name_jp: "森の小川",
    duration: 720,
    category: "nature",
    intention: "calm",
    glyph: "\u{1F332}",
    bpm: 0,
  },
  {
    id: "ocean_waves",
    name_en: "Ocean Waves",
    name_jp: "海の波",
    duration: 600,
    category: "nature",
    intention: "healing",
    glyph: "\u{1F30A}",
    bpm: 0,
  },
  {
    id: "rain_on_leaves",
    name_en: "Rain on Leaves",
    name_jp: "葉の上の雨",
    duration: 900,
    category: "nature",
    intention: "calm",
    glyph: "\u{1F327}",
    bpm: 0,
  },

  // Crystal Bowls
  {
    id: "singing_bowls_chakra",
    name_en: "Chakra Singing Bowls",
    name_jp: "チャクラシンギングボウル",
    duration: 840,
    category: "crystal_bowls",
    intention: "spiritual",
    glyph: "\u{1F514}",
    bpm: 40,
  },
  {
    id: "tibetan_bowls",
    name_en: "Tibetan Bowls",
    name_jp: "チベタンボウル",
    duration: 600,
    category: "crystal_bowls",
    intention: "calm",
    glyph: "\u{1F54E}",
    bpm: 45,
  },
  {
    id: "crystal_harmony",
    name_en: "Crystal Harmony",
    name_jp: "クリスタルハーモニー",
    duration: 720,
    category: "crystal_bowls",
    intention: "love",
    glyph: "\u{1F48E}",
    bpm: 50,
  },

  // Binaural
  {
    id: "theta_waves",
    name_en: "Theta Waves",
    name_jp: "シータ波",
    duration: 900,
    category: "binaural",
    intention: "spiritual",
    glyph: "\u{1F300}",
    bpm: 0,
  },
  {
    id: "deep_relaxation",
    name_en: "Deep Relaxation",
    name_jp: "深いリラクゼーション",
    duration: 600,
    category: "binaural",
    intention: "calm",
    glyph: "\u{1F4A4}",
    bpm: 0,
  },
  {
    id: "focus_flow",
    name_en: "Focus Flow",
    name_jp: "集中フロー",
    duration: 480,
    category: "binaural",
    intention: "career",
    glyph: "\u{1F9E0}",
    bpm: 0,
  },
];

export const MUSIC_CATEGORIES = [
  { id: "all", name_en: "All", name_jp: "すべて" },
  { id: "meditation", name_en: "Meditation", name_jp: "瞑想" },
  { id: "nature", name_en: "Nature", name_jp: "自然" },
  { id: "crystal_bowls", name_en: "Crystal Bowls", name_jp: "クリスタルボウル" },
  { id: "binaural", name_en: "Binaural", name_jp: "バイノーラル" },
] as const;

export function getTracksByCategory(category: string): HealingTrack[] {
  if (category === "all") return HEALING_TRACKS;
  return HEALING_TRACKS.filter((t) => t.category === category);
}

export function getTracksByIntention(intention: string): HealingTrack[] {
  return HEALING_TRACKS.filter((t) => t.intention === intention);
}
