import React from "react";
import { View } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Ellipse,
  Path,
  G,
  Text as SvgText,
} from "react-native-svg";
import {
  FAIRY_LAND_BIOMES,
  FAIRY_LAND_STRUCTURES,
  type FairyLandBiome,
  type FairyLandStructure,
} from "../../data/fairyLand";

interface BiomeSceneProps {
  biome: FairyLandBiome;
  builtStructureIds: string[];
  fairyColorHex: string;
  width?: number;
}

const VB_W = 300;
const VB_H = 180;

/** Pre-defined positions for structures within each biome scene */
const STRUCTURE_SLOTS: Record<FairyLandBiome, Array<{ x: number; y: number }>> = {
  meadow: [{ x: 55, y: 130 }, { x: 130, y: 120 }, { x: 200, y: 135 }, { x: 260, y: 125 }],
  garden: [{ x: 50, y: 125 }, { x: 120, y: 118 }, { x: 195, y: 130 }, { x: 258, y: 122 }],
  forest: [{ x: 70, y: 125 }, { x: 155, y: 115 }, { x: 235, y: 128 }],
  crystal_cave: [{ x: 65, y: 130 }, { x: 155, y: 120 }, { x: 240, y: 130 }],
  sky_realm: [{ x: 60, y: 120 }, { x: 155, y: 110 }, { x: 245, y: 120 }],
};

function MeadowBg() {
  return (
    <G>
      <Rect x={0} y={0} width={VB_W} height={VB_H} fill="#D4EDDA" />
      <Rect x={0} y={0} width={VB_W} height={80} fill="#E8F5E9" />
      {/* Sun */}
      <Circle cx={260} cy={30} r={18} fill="#FFF9C4" opacity={0.7} />
      {/* Clouds */}
      <Ellipse cx={60} cy={25} rx={25} ry={10} fill="#FFFFFF" opacity={0.6} />
      <Ellipse cx={180} cy={35} rx={20} ry={8} fill="#FFFFFF" opacity={0.5} />
      {/* Rolling hills */}
      <Path d="M 0 140 Q 50 110, 100 130 Q 150 150, 200 125 Q 250 100, 300 135 L 300 180 L 0 180 Z" fill="#C8E6C9" />
      <Path d="M 0 150 Q 75 130, 150 145 Q 225 155, 300 140 L 300 180 L 0 180 Z" fill="#A5D6A7" opacity={0.6} />
      {/* Grass tufts */}
      <Path d="M 30 148 Q 33 138, 36 148" stroke="#66BB6A" strokeWidth="1" fill="none" />
      <Path d="M 80 142 Q 82 133, 84 142" stroke="#66BB6A" strokeWidth="1" fill="none" />
      <Path d="M 160 147 Q 163 137, 166 147" stroke="#66BB6A" strokeWidth="1" fill="none" />
      <Path d="M 240 138 Q 242 128, 244 138" stroke="#66BB6A" strokeWidth="1" fill="none" />
    </G>
  );
}

function GardenBg() {
  return (
    <G>
      <Rect x={0} y={0} width={VB_W} height={VB_H} fill="#FFF3E0" />
      <Rect x={0} y={0} width={VB_W} height={75} fill="#FFF8E1" />
      {/* Warm sun */}
      <Circle cx={250} cy={28} r={16} fill="#FFE082" opacity={0.7} />
      {/* Garden ground */}
      <Path d="M 0 135 Q 75 120, 150 132 Q 225 140, 300 128 L 300 180 L 0 180 Z" fill="#FFCC80" opacity={0.4} />
      <Path d="M 0 145 Q 100 135, 200 148 L 300 142 L 300 180 L 0 180 Z" fill="#FFE0B2" opacity={0.5} />
      {/* Small flowers */}
      <Circle cx={40} cy={148} r={3} fill="#F48FB1" opacity={0.7} />
      <Circle cx={90} cy={143} r={2.5} fill="#CE93D8" opacity={0.6} />
      <Circle cx={170} cy={150} r={3} fill="#F48FB1" opacity={0.7} />
      <Circle cx={220} cy={140} r={2} fill="#FFAB91" opacity={0.6} />
      <Circle cx={275} cy={146} r={2.5} fill="#CE93D8" opacity={0.7} />
      {/* Trellis lines */}
      <Path d="M 10 145 Q 15 125, 10 105" stroke="#A1887F" strokeWidth="0.5" fill="none" opacity={0.3} />
      <Path d="M 290 140 Q 285 120, 290 100" stroke="#A1887F" strokeWidth="0.5" fill="none" opacity={0.3} />
    </G>
  );
}

function ForestBg() {
  return (
    <G>
      <Rect x={0} y={0} width={VB_W} height={VB_H} fill="#E0F2F1" />
      {/* Dark canopy */}
      <Rect x={0} y={0} width={VB_W} height={70} fill="#B2DFDB" opacity={0.5} />
      {/* Tree trunks */}
      <Rect x={20} y={60} width={8} height={70} rx={2} fill="#795548" opacity={0.5} />
      <Rect x={100} y={50} width={10} height={80} rx={2} fill="#795548" opacity={0.45} />
      <Rect x={210} y={55} width={9} height={75} rx={2} fill="#795548" opacity={0.5} />
      <Rect x={280} y={60} width={7} height={70} rx={2} fill="#795548" opacity={0.4} />
      {/* Canopy */}
      <Ellipse cx={24} cy={55} rx={25} ry={20} fill="#4CAF50" opacity={0.5} />
      <Ellipse cx={105} cy={45} rx={30} ry={22} fill="#388E3C" opacity={0.45} />
      <Ellipse cx={215} cy={50} rx={28} ry={20} fill="#4CAF50" opacity={0.5} />
      <Ellipse cx={283} cy={55} rx={22} ry={18} fill="#388E3C" opacity={0.4} />
      {/* Forest floor */}
      <Path d="M 0 140 Q 100 130, 200 138 Q 250 142, 300 135 L 300 180 L 0 180 Z" fill="#81C784" opacity={0.5} />
      <Rect x={0} y={155} width={VB_W} height={25} fill="#A5D6A7" opacity={0.4} />
      {/* Ferns */}
      <Path d="M 50 150 Q 55 140, 60 150" stroke="#66BB6A" strokeWidth="1" fill="none" />
      <Path d="M 150 145 Q 155 135, 160 145" stroke="#66BB6A" strokeWidth="1" fill="none" />
    </G>
  );
}

function CaveBg() {
  return (
    <G>
      <Rect x={0} y={0} width={VB_W} height={VB_H} fill="#4A148C" opacity={0.3} />
      <Rect x={0} y={0} width={VB_W} height={VB_H} fill="#EDE7F6" />
      {/* Cave ceiling */}
      <Path d="M 0 0 L 0 40 Q 50 55, 100 35 Q 150 20, 200 45 Q 250 60, 300 30 L 300 0 Z" fill="#7E57C2" opacity={0.3} />
      {/* Stalactites */}
      <Path d="M 40 0 L 45 35 L 50 0 Z" fill="#9575CD" opacity={0.4} />
      <Path d="M 120 0 L 124 30 L 128 0 Z" fill="#9575CD" opacity={0.35} />
      <Path d="M 200 0 L 204 40 L 208 0 Z" fill="#9575CD" opacity={0.4} />
      <Path d="M 260 0 L 263 25 L 266 0 Z" fill="#9575CD" opacity={0.3} />
      {/* Glowing crystals in walls */}
      <Circle cx={30} cy={80} r={5} fill="#CE93D8" opacity={0.5} />
      <Circle cx={30} cy={80} r={10} fill="#CE93D8" opacity={0.15} />
      <Circle cx={270} cy={90} r={4} fill="#80CBC4" opacity={0.5} />
      <Circle cx={270} cy={90} r={8} fill="#80CBC4" opacity={0.15} />
      {/* Cave floor */}
      <Path d="M 0 150 Q 75 140, 150 152 Q 225 160, 300 145 L 300 180 L 0 180 Z" fill="#D1C4E9" opacity={0.5} />
      <Rect x={0} y={160} width={VB_W} height={20} fill="#B39DDB" opacity={0.25} />
    </G>
  );
}

function SkyBg() {
  return (
    <G>
      <Rect x={0} y={0} width={VB_W} height={VB_H} fill="#E3F2FD" />
      {/* Sky gradient feel */}
      <Rect x={0} y={0} width={VB_W} height={60} fill="#BBDEFB" opacity={0.4} />
      {/* Clouds */}
      <Ellipse cx={50} cy={30} rx={30} ry={12} fill="#FFFFFF" opacity={0.7} />
      <Ellipse cx={140} cy={20} rx={25} ry={10} fill="#FFFFFF" opacity={0.6} />
      <Ellipse cx={240} cy={35} rx={28} ry={11} fill="#FFFFFF" opacity={0.65} />
      {/* Small distant clouds */}
      <Ellipse cx={80} cy={55} rx={15} ry={6} fill="#FFFFFF" opacity={0.4} />
      <Ellipse cx={200} cy={50} rx={18} ry={7} fill="#FFFFFF" opacity={0.35} />
      {/* Floating island platform */}
      <Ellipse cx={150} cy={140} rx={120} ry={20} fill="#90CAF9" opacity={0.4} />
      <Ellipse cx={150} cy={135} rx={100} ry={15} fill="#E3F2FD" opacity={0.7} />
      <Path d="M 50 135 Q 100 120, 150 132 Q 200 140, 250 130 L 250 145 Q 200 155, 150 148 Q 100 140, 50 150 Z" fill="#BBDEFB" opacity={0.5} />
      {/* Stars/twinkles */}
      <Circle cx={30} cy={15} r={1.5} fill="#FFD54F" opacity={0.6} />
      <Circle cx={180} cy={10} r={1} fill="#FFD54F" opacity={0.5} />
      <Circle cx={270} cy={18} r={1.2} fill="#FFD54F" opacity={0.55} />
    </G>
  );
}

const BIOME_BG: Record<FairyLandBiome, () => React.JSX.Element> = {
  meadow: MeadowBg,
  garden: GardenBg,
  forest: ForestBg,
  crystal_cave: CaveBg,
  sky_realm: SkyBg,
};

function StructureSlot({
  structure,
  x,
  y,
  built,
}: {
  structure: FairyLandStructure;
  x: number;
  y: number;
  built: boolean;
}) {
  if (built) {
    return (
      <G>
        {/* Platform */}
        <Ellipse cx={x} cy={y + 14} rx={18} ry={6} fill={structure.tintColor} opacity={0.6} />
        {/* Structure glyph */}
        <SvgText
          x={x}
          y={y + 6}
          fontSize={22}
          textAnchor="middle"
          fill="#000000"
        >
          {structure.glyph}
        </SvgText>
      </G>
    );
  }
  // Placeholder — dashed outline
  return (
    <G opacity={0.3}>
      <Ellipse cx={x} cy={y + 10} rx={14} ry={5} fill="none" stroke="#999" strokeWidth="0.8" strokeDasharray="3,2" />
      <SvgText x={x} y={y + 4} fontSize={10} textAnchor="middle" fill="#999">?</SvgText>
    </G>
  );
}

export function BiomeScene({ biome, builtStructureIds, fairyColorHex, width = 300 }: BiomeSceneProps) {
  const biomeInfo = FAIRY_LAND_BIOMES[biome];
  const structures = FAIRY_LAND_STRUCTURES.filter((s) => s.biome === biome).sort((a, b) => a.order - b.order);
  const slots = STRUCTURE_SLOTS[biome];
  const BgComponent = BIOME_BG[biome];
  const aspectH = width * (VB_H / VB_W);

  return (
    <View style={{ width, height: aspectH, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "rgba(0,0,0,0.08)" }}>
      <Svg width={width} height={aspectH} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <BgComponent />

        {/* Render structures at their slots */}
        {structures.map((struct, i) => {
          const slot = slots[i % slots.length];
          return (
            <StructureSlot
              key={struct.id}
              structure={struct}
              x={slot.x}
              y={slot.y}
              built={builtStructureIds.includes(struct.id)}
            />
          );
        })}

        {/* Small fairy in the scene */}
        <G>
          <Circle cx={150} cy={105} r={8} fill={fairyColorHex} opacity={0.3} />
          <Circle cx={150} cy={100} r={5} fill={fairyColorHex} opacity={0.6} />
          {/* Tiny wings */}
          <Ellipse cx={142} cy={98} rx={5} ry={7} fill={fairyColorHex} opacity={0.25} />
          <Ellipse cx={158} cy={98} rx={5} ry={7} fill={fairyColorHex} opacity={0.25} />
        </G>
      </Svg>
    </View>
  );
}
