/**
 * Moon phase calculation and crystal recommendations per phase.
 */

export type MoonPhase =
  | "new_moon"
  | "waxing_crescent"
  | "first_quarter"
  | "waxing_gibbous"
  | "full_moon"
  | "waning_gibbous"
  | "last_quarter"
  | "waning_crescent";

export interface MoonPhaseInfo {
  phase: MoonPhase;
  name_en: string;
  name_jp: string;
  glyph: string;
  description_en: string;
  description_jp: string;
  recommendedStones: string[];
  bestIntentions: string[];
}

const MOON_PHASES: MoonPhaseInfo[] = [
  {
    phase: "new_moon",
    name_en: "New Moon",
    name_jp: "新月",
    glyph: "\u{1F311}",
    description_en: "Time for new beginnings. Set intentions and plant seeds for what you wish to manifest.",
    description_jp: "新しい始まりの時。意図を設定し、実現したいことの種を蒔きましょう。",
    recommendedStones: ["moonstone", "black_tourmaline", "clear_quartz"],
    bestIntentions: ["spiritual", "purification"],
  },
  {
    phase: "waxing_crescent",
    name_en: "Waxing Crescent",
    name_jp: "三日月",
    glyph: "\u{1F312}",
    description_en: "Energy is building. Focus on growth and take the first steps toward your goals.",
    description_jp: "エネルギーが高まっています。成長に集中し、目標に向けた最初の一歩を踏み出しましょう。",
    recommendedStones: ["citrine", "green_aventurine", "carnelian"],
    bestIntentions: ["prosperity", "courage"],
  },
  {
    phase: "first_quarter",
    name_en: "First Quarter",
    name_jp: "上弦の月",
    glyph: "\u{1F313}",
    description_en: "A time of action and decision. Overcome challenges with determination.",
    description_jp: "行動と決断の時。決意を持って課題を乗り越えましょう。",
    recommendedStones: ["tigers_eye", "carnelian", "garnet"],
    bestIntentions: ["courage", "career"],
  },
  {
    phase: "waxing_gibbous",
    name_en: "Waxing Gibbous",
    name_jp: "十三夜月",
    glyph: "\u{1F314}",
    description_en: "Refine your approach. Adjust and prepare for the culmination of your efforts.",
    description_jp: "アプローチを磨きましょう。努力の結実に向けて調整・準備を。",
    recommendedStones: ["lapis_lazuli", "fluorite", "labradorite"],
    bestIntentions: ["wisdom", "career"],
  },
  {
    phase: "full_moon",
    name_en: "Full Moon",
    name_jp: "満月",
    glyph: "\u{1F315}",
    description_en: "Peak energy. Time for gratitude, celebration, and charging your crystals under moonlight.",
    description_jp: "エネルギーの頂点。感謝と祝福の時。月光の下で石を浄化しましょう。",
    recommendedStones: ["moonstone", "clear_quartz", "amethyst"],
    bestIntentions: ["spiritual", "amplify"],
  },
  {
    phase: "waning_gibbous",
    name_en: "Waning Gibbous",
    name_jp: "十八夜月",
    glyph: "\u{1F316}",
    description_en: "Share wisdom and express gratitude. Reflect on what you've achieved.",
    description_jp: "知恵を共有し、感謝を表しましょう。達成したことを振り返りましょう。",
    recommendedStones: ["amethyst", "prehnite", "jade_jadeite"],
    bestIntentions: ["healing", "calm"],
  },
  {
    phase: "last_quarter",
    name_en: "Last Quarter",
    name_jp: "下弦の月",
    glyph: "\u{1F317}",
    description_en: "Release what no longer serves you. Forgive, let go, and make space.",
    description_jp: "もう必要のないものを手放しましょう。許し、解放し、空間を作りましょう。",
    recommendedStones: ["smoky_quartz", "black_obsidian", "rhodonite"],
    bestIntentions: ["purification", "protection"],
  },
  {
    phase: "waning_crescent",
    name_en: "Waning Crescent",
    name_jp: "二十六夜月",
    glyph: "\u{1F318}",
    description_en: "Rest and restore. Meditate, dream, and prepare for the next cycle.",
    description_jp: "休息と回復。瞑想し、夢を見て、次のサイクルに備えましょう。",
    recommendedStones: ["amethyst", "moonstone", "sugilite"],
    bestIntentions: ["calm", "spiritual"],
  },
];

/**
 * Calculate the current moon phase based on date.
 * Uses a simple synodic month approximation (29.53 days).
 */
export function getCurrentMoonPhase(): MoonPhaseInfo {
  const now = new Date();
  // Known new moon: Jan 6, 2000 18:14 UTC
  const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0).getTime();
  const synodicMonth = 29.53058867;
  const daysSince = (now.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const moonAge = ((daysSince % synodicMonth) + synodicMonth) % synodicMonth;

  // Divide the cycle into 8 phases
  const phaseIndex = Math.floor((moonAge / synodicMonth) * 8) % 8;
  return MOON_PHASES[phaseIndex];
}

/**
 * Get the daily crystal recommendation based on moon phase + day of week.
 */
export function getDailyCrystal(): { stoneId: string; reason_en: string; reason_jp: string } {
  const phase = getCurrentMoonPhase();
  const dayOfWeek = new Date().getDay();
  const stoneIdx = dayOfWeek % phase.recommendedStones.length;
  const stoneId = phase.recommendedStones[stoneIdx];

  const intentionsLabel = phase.bestIntentions.join(" & ");

  return {
    stoneId,
    reason_en: `Today's ${phase.name_en} ${phase.glyph} brings ${intentionsLabel} energy. ${phase.description_en} This stone harmonizes with today's lunar cycle.`,
    reason_jp: `今日は${phase.name_jp}${phase.glyph}。${phase.description_jp} この石は今日の月のサイクルと調和しています。`,
  };
}

export function getAllMoonPhases(): MoonPhaseInfo[] {
  return MOON_PHASES;
}
