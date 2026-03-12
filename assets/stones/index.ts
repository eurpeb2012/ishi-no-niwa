/**
 * Photo-realistic crystal sprite mapping.
 * Each sprite was extracted from Takae's crystal reference images
 * with transparent backgrounds.
 *
 * Usage: import { STONE_SPRITES } from "../../assets/stones";
 *        const src = STONE_SPRITES[stoneId];
 *        if (src) <Image source={src} ... />
 */

// Static requires — React Native bundler needs these at compile time
const sprites = {
  rose_quartz: require("./gem1_17.png"),       // raw rose quartz chunk
  amethyst: require("./gem1_01.png"),           // amethyst crystal cluster
  clear_quartz: require("./gem2_00.png"),       // clear quartz points
  tigers_eye: require("./gem2_02.png"),         // polished tiger's eye slab
  black_tourmaline: require("./gem2_06.png"),   // black tourmaline crystals
  lapis_lazuli: require("./gem1_04.png"),       // lapis lazuli tumbled
  jade_jadeite: require("./gem1_13.png"),       // green jade polished
  carnelian: require("./gem2_20.png"),          // red/orange crystal cluster
  black_obsidian: require("./gem1_19.png"),     // black obsidian raw
  citrine: require("./gem2_05.png"),            // citrine cluster
  garnet: require("./gem1_27.png"),             // red faceted garnet
  aquamarine: require("./gem2_09.png"),         // aquamarine faceted
  moonstone: require("./gem1_47.png"),          // moonstone cabochon
  smoky_quartz: require("./gem1_05.png"),       // smoky quartz sphere
  green_aventurine: require("./gem1_21.png"),   // green faceted emerald-type
  malachite: require("./gem2_01.png"),          // raw malachite cluster
  turquoise: require("./gem2_04.png"),          // turquoise raw
  rhodonite: require("./gem2_22.png"),          // rhodonite sphere
  fluorite: require("./gem1_39.png"),           // fluorite crystal cluster
  labradorite: require("./gem1_44.png"),        // labradorite/fire opal
  sugilite: require("./gem2_07.png"),           // purple faceted gem
  prehnite: require("./gem2_03.png"),           // celestite/blue geode
  amber: require("./gem1_52.png"),              // golden raw citrine/amber
  agate: require("./gem1_00.png"),              // banded agate slice
  chrysanthemum_stone: require("./gem1_64.png"), // gray mineral specimen
} as const;

export type SpriteStoneId = keyof typeof sprites;

export const STONE_SPRITES: Record<string, any> = sprites;

/** Check if a photo sprite exists for a given stone ID */
export function hasSprite(stoneId: string): boolean {
  return stoneId in sprites;
}
