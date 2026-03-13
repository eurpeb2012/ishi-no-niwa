/**
 * Fairy sprite asset map.
 *
 * Sprites are hi-res transparent PNGs in assets/fairy/, organized as:
 *   {color}_{evolution}_{mood}.png
 *
 * Example: amethyst_3_idle.png = Amethyst Bloom Fairy, idle pose
 *
 * Naming convention:
 *   color:     rose_quartz | amethyst | peridot | onyx
 *   evolution: 1 (seed) | 2 (bud) | 3 (bloom) | 4 (crystal) | 5 (guardian)
 *   mood:      idle | happy | excited | thinking | sleeping
 *
 * Asset generation guide:
 *   - 512×512px transparent PNG, @2x resolution
 *   - Soft watercolor / pastel anime style matching Takae's concept art
 *   - Each evolution stage shows progression:
 *     1: tiny glowing orb with wing buds
 *     2: small chibi fairy, simple crown, translucent wings
 *     3: flowing hair, flower crown, larger petal wings
 *     4: crystal wings, tiara, detailed dress, sparkle effects
 *     5: golden crown, majestic feathered wings, ethereal glow
 *   - Mood differences: expression, pose, sparkle intensity
 *     idle: neutral gentle smile, hands at rest
 *     happy: big smile, blush, slight bounce pose
 *     excited: open mouth, arms up, extra sparkles
 *     thinking: head tilted, finger to chin
 *     sleeping: closed eyes, curled pose, zzz particles
 */

import type { FairyColor, EvolutionStage } from "../stores/fairyStore";
import type { FairyMood } from "../components/common/CrystalFairy";
import { ImageSourcePropType } from "react-native";

type SpriteKey = `${FairyColor}_${EvolutionStage}_${FairyMood}`;

/**
 * Static require() map for all fairy sprites.
 *
 * React Native requires static require() calls — no dynamic paths.
 * When assets are ready, uncomment the real requires and remove placeholders.
 *
 * To add assets:
 * 1. Generate/commission 100 PNGs (4 colors × 5 evolutions × 5 moods)
 * 2. Place in assets/fairy/ with naming convention above
 * 3. Uncomment the corresponding require() line below
 */

// Placeholder: returns null when no sprite exists yet
const SPRITES: Partial<Record<SpriteKey, ImageSourcePropType>> = {
  // ── Amethyst ──────────────────────────────────────────────
  amethyst_1_idle: require("../assets/fairy/amethyst_1_idle.png"),
  amethyst_1_happy: require("../assets/fairy/amethyst_1_happy.png"),
  amethyst_1_excited: require("../assets/fairy/amethyst_1_excited.png"),
  amethyst_1_thinking: require("../assets/fairy/amethyst_1_thinking.png"),
  amethyst_1_sleeping: require("../assets/fairy/amethyst_1_sleeping.png"),
  // amethyst_2_idle: require("../assets/fairy/amethyst_2_idle.png"),
  // amethyst_2_happy: require("../assets/fairy/amethyst_2_happy.png"),
  // amethyst_2_excited: require("../assets/fairy/amethyst_2_excited.png"),
  // amethyst_2_thinking: require("../assets/fairy/amethyst_2_thinking.png"),
  // amethyst_2_sleeping: require("../assets/fairy/amethyst_2_sleeping.png"),
  amethyst_3_idle: require("../assets/fairy/amethyst_3_idle.png"),
  // amethyst_3_happy: require("../assets/fairy/amethyst_3_happy.png"),
  // amethyst_3_excited: require("../assets/fairy/amethyst_3_excited.png"),
  // amethyst_3_thinking: require("../assets/fairy/amethyst_3_thinking.png"),
  // amethyst_3_sleeping: require("../assets/fairy/amethyst_3_sleeping.png"),
  // amethyst_4_idle: require("../assets/fairy/amethyst_4_idle.png"),
  // amethyst_4_happy: require("../assets/fairy/amethyst_4_happy.png"),
  // amethyst_4_excited: require("../assets/fairy/amethyst_4_excited.png"),
  // amethyst_4_thinking: require("../assets/fairy/amethyst_4_thinking.png"),
  // amethyst_4_sleeping: require("../assets/fairy/amethyst_4_sleeping.png"),
  // amethyst_5_idle: require("../assets/fairy/amethyst_5_idle.png"),
  // amethyst_5_happy: require("../assets/fairy/amethyst_5_happy.png"),
  // amethyst_5_excited: require("../assets/fairy/amethyst_5_excited.png"),
  // amethyst_5_thinking: require("../assets/fairy/amethyst_5_thinking.png"),
  // amethyst_5_sleeping: require("../assets/fairy/amethyst_5_sleeping.png"),

  // ── Rose Quartz ───────────────────────────────────────────
  rose_quartz_1_idle: require("../assets/fairy/rose_quartz_1_idle.png"),
  rose_quartz_1_happy: require("../assets/fairy/rose_quartz_1_happy.png"),
  rose_quartz_1_excited: require("../assets/fairy/rose_quartz_1_excited.png"),
  rose_quartz_1_thinking: require("../assets/fairy/rose_quartz_1_thinking.png"),
  rose_quartz_1_sleeping: require("../assets/fairy/rose_quartz_1_sleeping.png"),
  // ... (remaining rose_quartz stages)

  // ── Peridot ───────────────────────────────────────────────
  peridot_3_idle: require("../assets/fairy/peridot_3_idle.png"),
  peridot_3_happy: require("../assets/fairy/peridot_3_happy.png"),
  peridot_3_excited: require("../assets/fairy/peridot_3_excited.png"),
  peridot_3_thinking: require("../assets/fairy/peridot_3_thinking.png"),
  peridot_3_sleeping: require("../assets/fairy/peridot_3_sleeping.png"),
  // ... (remaining peridot stages)

  // ── Onyx ──────────────────────────────────────────────────
  // onyx_1_idle: require("../assets/fairy/onyx_1_idle.png"),
  // ... (remaining onyx stages)

  // ── Ruby ──────────────────────────────────────────────────
  ruby_3_idle: require("../assets/fairy/ruby_3_idle.png"),
  ruby_3_happy: require("../assets/fairy/ruby_3_happy.png"),
  ruby_3_excited: require("../assets/fairy/ruby_3_excited.png"),
  ruby_3_thinking: require("../assets/fairy/ruby_3_thinking.png"),
  ruby_3_sleeping: require("../assets/fairy/ruby_3_sleeping.png"),

  // ── Moonstone ─────────────────────────────────────────────
  moonstone_3_idle: require("../assets/fairy/moonstone_3_idle.png"),
  moonstone_3_happy: require("../assets/fairy/moonstone_3_happy.png"),
  moonstone_3_excited: require("../assets/fairy/moonstone_3_excited.png"),
  moonstone_3_thinking: require("../assets/fairy/moonstone_3_thinking.png"),
  moonstone_3_sleeping: require("../assets/fairy/moonstone_3_sleeping.png"),

  // ── Garnet Peridot ────────────────────────────────────────
  garnet_peridot_3_idle: require("../assets/fairy/garnet_peridot_3_idle.png"),
  garnet_peridot_3_happy: require("../assets/fairy/garnet_peridot_3_happy.png"),
  garnet_peridot_3_excited: require("../assets/fairy/garnet_peridot_3_excited.png"),
  garnet_peridot_3_thinking: require("../assets/fairy/garnet_peridot_3_thinking.png"),
  garnet_peridot_3_sleeping: require("../assets/fairy/garnet_peridot_3_sleeping.png"),

  // ── Opal ──────────────────────────────────────────────────
  opal_3_idle: require("../assets/fairy/opal_3_idle.png"),
  opal_3_happy: require("../assets/fairy/opal_3_happy.png"),
  opal_3_excited: require("../assets/fairy/opal_3_excited.png"),
  opal_3_thinking: require("../assets/fairy/opal_3_thinking.png"),
  opal_3_sleeping: require("../assets/fairy/opal_3_sleeping.png"),

  // ── Garnet Sapphire ───────────────────────────────────────
  garnet_sapphire_3_idle: require("../assets/fairy/garnet_sapphire_3_idle.png"),
  garnet_sapphire_3_happy: require("../assets/fairy/garnet_sapphire_3_happy.png"),
  garnet_sapphire_3_excited: require("../assets/fairy/garnet_sapphire_3_excited.png"),
  garnet_sapphire_3_thinking: require("../assets/fairy/garnet_sapphire_3_thinking.png"),
  garnet_sapphire_3_sleeping: require("../assets/fairy/garnet_sapphire_3_sleeping.png"),

  // ── Citrine ───────────────────────────────────────────────
  citrine_3_idle: require("../assets/fairy/citrine_3_idle.png"),
  citrine_3_happy: require("../assets/fairy/citrine_3_happy.png"),
  citrine_3_excited: require("../assets/fairy/citrine_3_excited.png"),
  citrine_3_thinking: require("../assets/fairy/citrine_3_thinking.png"),
  citrine_3_sleeping: require("../assets/fairy/citrine_3_sleeping.png"),

  // ── Topaz ─────────────────────────────────────────────────
  topaz_3_idle: require("../assets/fairy/topaz_3_idle.png"),
  topaz_3_happy: require("../assets/fairy/topaz_3_happy.png"),
  topaz_3_excited: require("../assets/fairy/topaz_3_excited.png"),
  topaz_3_thinking: require("../assets/fairy/topaz_3_thinking.png"),
  topaz_3_sleeping: require("../assets/fairy/topaz_3_sleeping.png"),
  // ... (remaining topaz stages)

  // ── Sapphire ──────────────────────────────────────────────
  sapphire_3_idle: require("../assets/fairy/sapphire_3_idle.png"),
  sapphire_3_happy: require("../assets/fairy/sapphire_3_happy.png"),
  sapphire_3_excited: require("../assets/fairy/sapphire_3_excited.png"),
  sapphire_3_thinking: require("../assets/fairy/sapphire_3_thinking.png"),
  sapphire_3_sleeping: require("../assets/fairy/sapphire_3_sleeping.png"),
  // ... (remaining sapphire stages)

  // ── Aquamarine ────────────────────────────────────────────
  aquamarine_3_idle: require("../assets/fairy/aquamarine_3_idle.png"),
  aquamarine_3_happy: require("../assets/fairy/aquamarine_3_happy.png"),
  aquamarine_3_excited: require("../assets/fairy/aquamarine_3_excited.png"),
  aquamarine_3_thinking: require("../assets/fairy/aquamarine_3_thinking.png"),
  aquamarine_3_sleeping: require("../assets/fairy/aquamarine_3_sleeping.png"),
  // ... (remaining aquamarine stages)
};

/**
 * Get the sprite for a given fairy state.
 * Falls back: exact mood → idle mood → null (triggers fallback rendering).
 */
export function getFairySprite(
  color: FairyColor,
  evolution: EvolutionStage,
  mood: FairyMood,
): ImageSourcePropType | null {
  const exact: SpriteKey = `${color}_${evolution}_${mood}`;
  if (SPRITES[exact]) return SPRITES[exact]!;

  // Fall back to idle pose for this color+evolution
  const idle: SpriteKey = `${color}_${evolution}_idle`;
  if (SPRITES[idle]) return SPRITES[idle]!;

  // Fall back to any evolution stage (nearest first, then any idle)
  const stages: EvolutionStage[] = [1, 2, 3, 4, 5];
  for (const s of stages) {
    const key: SpriteKey = `${color}_${s}_idle`;
    if (SPRITES[key]) return SPRITES[key]!;
  }

  // Absolute fallback: any sprite at all for this color
  for (const s of stages) {
    const moods: FairyMood[] = ["idle", "happy", "excited", "thinking", "sleeping"];
    for (const m of moods) {
      const key: SpriteKey = `${color}_${s}_${m}`;
      if (SPRITES[key]) return SPRITES[key]!;
    }
  }

  return null;
}

/** Check whether any real sprites have been loaded */
export function hasSpritesLoaded(): boolean {
  return Object.keys(SPRITES).length > 0;
}
