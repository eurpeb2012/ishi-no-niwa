/**
 * Fairy Land — an evolving world powered by crystal energy.
 * Energy from grids feeds the fairy, which builds structures in fairy land.
 * Inspired by Takae's concept art: fairy house, crystal garden, crystal aquarium.
 */

export type FairyLandBiome = "meadow" | "garden" | "forest" | "crystal_cave" | "sky_realm";

export interface FairyLandStructure {
  id: string;
  name_en: string;
  name_jp: string;
  desc_en: string;
  desc_jp: string;
  biome: FairyLandBiome;
  /** Energy cost to build */
  energyCost: number;
  /** Required evolution stage */
  minEvolution: 1 | 2 | 3 | 4 | 5;
  /** Order within biome */
  order: number;
  /** Visual glyph */
  glyph: string;
  /** Background color tint for the structure area */
  tintColor: string;
}

export const FAIRY_LAND_BIOMES: Record<FairyLandBiome, {
  name_en: string;
  name_jp: string;
  desc_en: string;
  desc_jp: string;
  bgColor: string;
  unlockEnergy: number;
  glyph: string;
}> = {
  meadow: {
    name_en: "Crystal Meadow",
    name_jp: "クリスタルの草原",
    desc_en: "A gentle meadow where your fairy begins her journey",
    desc_jp: "妖精が旅を始める穏やかな草原",
    bgColor: "#E8F5E9",
    unlockEnergy: 0,
    glyph: "\u{1F33F}",
  },
  garden: {
    name_en: "Crystal Garden",
    name_jp: "クリスタル庭園",
    desc_en: "A lush garden blooming with crystal flowers",
    desc_jp: "クリスタルの花が咲き誇る豊かな庭園",
    bgColor: "#FFF3E0",
    unlockEnergy: 50,
    glyph: "\u{1F338}",
  },
  forest: {
    name_en: "Enchanted Forest",
    name_jp: "魔法の森",
    desc_en: "An ancient forest glowing with crystal light",
    desc_jp: "クリスタルの光で輝く古代の森",
    bgColor: "#E0F2F1",
    unlockEnergy: 150,
    glyph: "\u{1F332}",
  },
  crystal_cave: {
    name_en: "Crystal Cave",
    name_jp: "クリスタルの洞窟",
    desc_en: "A hidden cavern filled with precious crystals",
    desc_jp: "貴重なクリスタルで満たされた隠れた洞窟",
    bgColor: "#EDE7F6",
    unlockEnergy: 300,
    glyph: "\u{1F48E}",
  },
  sky_realm: {
    name_en: "Sky Realm",
    name_jp: "天空の領域",
    desc_en: "A floating paradise among the clouds",
    desc_jp: "雲の間に浮かぶ楽園",
    bgColor: "#E3F2FD",
    unlockEnergy: 500,
    glyph: "\u2601",
  },
};

export const FAIRY_LAND_STRUCTURES: FairyLandStructure[] = [
  // Meadow (starter biome)
  {
    id: "fairy_house",
    name_en: "Fairy House",
    name_jp: "妖精の家",
    desc_en: "A cozy hobbit-hole home for your fairy",
    desc_jp: "妖精のための居心地の良い小さな家",
    biome: "meadow",
    energyCost: 10,
    minEvolution: 1,
    order: 1,
    glyph: "\u{1F3E0}",
    tintColor: "#D7CCC8",
  },
  {
    id: "crystal_lamp",
    name_en: "Crystal Lamp",
    name_jp: "クリスタルランプ",
    desc_en: "A glowing lamp that lights the path",
    desc_jp: "道を照らす光るランプ",
    biome: "meadow",
    energyCost: 8,
    minEvolution: 1,
    order: 2,
    glyph: "\u{1F4A1}",
    tintColor: "#FFF8E1",
  },
  {
    id: "flower_patch",
    name_en: "Flower Patch",
    name_jp: "お花畑",
    desc_en: "A colorful patch of crystal flowers",
    desc_jp: "カラフルなクリスタルの花畑",
    biome: "meadow",
    energyCost: 12,
    minEvolution: 1,
    order: 3,
    glyph: "\u{1F33C}",
    tintColor: "#FCE4EC",
  },
  {
    id: "stepping_stones",
    name_en: "Crystal Path",
    name_jp: "クリスタルの小道",
    desc_en: "Polished crystal stepping stones",
    desc_jp: "磨かれたクリスタルの飛び石",
    biome: "meadow",
    energyCost: 15,
    minEvolution: 1,
    order: 4,
    glyph: "\u{1FABE}",
    tintColor: "#ECEFF1",
  },

  // Garden
  {
    id: "crystal_fountain",
    name_en: "Crystal Fountain",
    name_jp: "クリスタルの噴水",
    desc_en: "A shimmering fountain that heals the fairy",
    desc_jp: "妖精を癒すきらめく噴水",
    biome: "garden",
    energyCost: 25,
    minEvolution: 2,
    order: 1,
    glyph: "\u26F2",
    tintColor: "#E0F7FA",
  },
  {
    id: "rose_arbor",
    name_en: "Rose Quartz Arbor",
    name_jp: "ローズクォーツのアーチ",
    desc_en: "A beautiful archway made of rose quartz",
    desc_jp: "ローズクォーツで作られた美しいアーチ",
    biome: "garden",
    energyCost: 30,
    minEvolution: 2,
    order: 2,
    glyph: "\u{1F339}",
    tintColor: "#FCE4EC",
  },
  {
    id: "butterfly_grove",
    name_en: "Butterfly Grove",
    name_jp: "蝶の木立",
    desc_en: "Crystal butterflies dance in this grove",
    desc_jp: "クリスタルの蝶が舞う木立",
    biome: "garden",
    energyCost: 35,
    minEvolution: 2,
    order: 3,
    glyph: "\u{1F98B}",
    tintColor: "#F3E5F5",
  },
  {
    id: "wishing_well",
    name_en: "Crystal Wishing Well",
    name_jp: "クリスタルの願い井戸",
    desc_en: "Toss a crystal and make a wish",
    desc_jp: "クリスタルを投げて願いを込めて",
    biome: "garden",
    energyCost: 40,
    minEvolution: 2,
    order: 4,
    glyph: "\u{1FA99}",
    tintColor: "#E8EAF6",
  },

  // Forest
  {
    id: "ancient_tree",
    name_en: "Crystal Tree",
    name_jp: "クリスタルの木",
    desc_en: "An ancient tree with crystal leaves",
    desc_jp: "クリスタルの葉を持つ古代の木",
    biome: "forest",
    energyCost: 50,
    minEvolution: 3,
    order: 1,
    glyph: "\u{1F333}",
    tintColor: "#C8E6C9",
  },
  {
    id: "mushroom_ring",
    name_en: "Fairy Ring",
    name_jp: "フェアリーリング",
    desc_en: "A magical circle of glowing mushrooms",
    desc_jp: "光るキノコの魔法の輪",
    biome: "forest",
    energyCost: 45,
    minEvolution: 3,
    order: 2,
    glyph: "\u{1F344}",
    tintColor: "#FFF9C4",
  },
  {
    id: "crystal_pond",
    name_en: "Crystal Pond",
    name_jp: "クリスタルの池",
    desc_en: "A tranquil pond reflecting crystal light",
    desc_jp: "クリスタルの光を映す静かな池",
    biome: "forest",
    energyCost: 55,
    minEvolution: 3,
    order: 3,
    glyph: "\u{1F4A7}",
    tintColor: "#E0F7FA",
  },

  // Crystal Cave
  {
    id: "amethyst_cluster",
    name_en: "Amethyst Cluster",
    name_jp: "アメジストクラスター",
    desc_en: "A massive cluster of amethyst crystals",
    desc_jp: "巨大なアメジストクリスタルの群生",
    biome: "crystal_cave",
    energyCost: 70,
    minEvolution: 4,
    order: 1,
    glyph: "\u{1F48E}",
    tintColor: "#E1BEE7",
  },
  {
    id: "crystal_aquarium",
    name_en: "Crystal Aquarium",
    name_jp: "クリスタル水槽",
    desc_en: "A magical terrarium filled with crystal life",
    desc_jp: "クリスタルの生命で満たされた魔法のテラリウム",
    biome: "crystal_cave",
    energyCost: 80,
    minEvolution: 4,
    order: 2,
    glyph: "\u{1F41F}",
    tintColor: "#B2EBF2",
  },
  {
    id: "gem_throne",
    name_en: "Gem Throne",
    name_jp: "宝石の玉座",
    desc_en: "A throne carved from a single giant gem",
    desc_jp: "一つの巨大な宝石から彫られた玉座",
    biome: "crystal_cave",
    energyCost: 100,
    minEvolution: 4,
    order: 3,
    glyph: "\u{1FA91}",
    tintColor: "#FFE0B2",
  },

  // Sky Realm
  {
    id: "cloud_palace",
    name_en: "Cloud Palace",
    name_jp: "雲の宮殿",
    desc_en: "A palace floating among the clouds",
    desc_jp: "雲の間に浮かぶ宮殿",
    biome: "sky_realm",
    energyCost: 120,
    minEvolution: 5,
    order: 1,
    glyph: "\u{1F3F0}",
    tintColor: "#E3F2FD",
  },
  {
    id: "rainbow_bridge",
    name_en: "Rainbow Bridge",
    name_jp: "虹の橋",
    desc_en: "A bridge of light connecting realms",
    desc_jp: "領域を繋ぐ光の橋",
    biome: "sky_realm",
    energyCost: 150,
    minEvolution: 5,
    order: 2,
    glyph: "\u{1F308}",
    tintColor: "#FFF9C4",
  },
  {
    id: "star_garden",
    name_en: "Star Garden",
    name_jp: "星の庭",
    desc_en: "A garden of stars that grants wishes",
    desc_jp: "願いを叶える星の庭",
    biome: "sky_realm",
    energyCost: 200,
    minEvolution: 5,
    order: 3,
    glyph: "\u{1F31F}",
    tintColor: "#FFF3E0",
  },
];

/** Get structures available for building (by evolution stage) */
export function getAvailableStructures(evolutionStage: number): FairyLandStructure[] {
  return FAIRY_LAND_STRUCTURES.filter((s) => s.minEvolution <= evolutionStage);
}

/** Get structures grouped by biome */
export function getStructuresByBiome(): Record<FairyLandBiome, FairyLandStructure[]> {
  const result: Record<FairyLandBiome, FairyLandStructure[]> = {
    meadow: [],
    garden: [],
    forest: [],
    crystal_cave: [],
    sky_realm: [],
  };
  for (const s of FAIRY_LAND_STRUCTURES) {
    result[s.biome].push(s);
  }
  // Sort by order within each biome
  for (const biome of Object.keys(result) as FairyLandBiome[]) {
    result[biome].sort((a, b) => a.order - b.order);
  }
  return result;
}
