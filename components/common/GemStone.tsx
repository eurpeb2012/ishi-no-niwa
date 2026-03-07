import { View, StyleSheet } from "react-native";

// Per-stone visual profile: shape, colors, texture
interface GemProfile {
  // Asymmetric border radii [topLeft%, topRight%, bottomRight%, bottomLeft%] of min dimension
  shape: [number, number, number, number];
  // [base, secondary, accent] colors
  colors: [string, string, string];
  // Texture type
  texture: "smooth" | "veined" | "banded" | "speckled" | "crystalline" | "mottled";
  // Surface finish affects shine intensity
  finish: "polished" | "tumbled" | "raw" | "glassy";
  // Opacity of the secondary color zone (0-1)
  secondaryStrength: number;
}

const PROFILES: Record<string, GemProfile> = {
  rose_quartz: {
    shape: [48, 42, 50, 44],
    colors: ["#F7CAC9", "#FADCE0", "#FFFFFF"],
    texture: "smooth",
    finish: "polished",
    secondaryStrength: 0.3,
  },
  amethyst: {
    shape: [35, 50, 30, 45],
    colors: ["#9B59B6", "#7D3C98", "#E8DAEF"],
    texture: "crystalline",
    finish: "raw",
    secondaryStrength: 0.4,
  },
  clear_quartz: {
    shape: [30, 45, 35, 40],
    colors: ["#E8E8E8", "#D5D5D5", "#FFFFFF"],
    texture: "crystalline",
    finish: "glassy",
    secondaryStrength: 0.25,
  },
  tigers_eye: {
    shape: [45, 50, 48, 42],
    colors: ["#B8860B", "#8B6914", "#DAA520"],
    texture: "banded",
    finish: "polished",
    secondaryStrength: 0.45,
  },
  black_tourmaline: {
    shape: [32, 38, 28, 42],
    colors: ["#1C1C1C", "#333333", "#4A4A4A"],
    texture: "crystalline",
    finish: "raw",
    secondaryStrength: 0.3,
  },
  lapis_lazuli: {
    shape: [44, 48, 50, 40],
    colors: ["#26619C", "#1A3F6F", "#C9A96E"],
    texture: "speckled",
    finish: "polished",
    secondaryStrength: 0.35,
  },
  jade_jadeite: {
    shape: [46, 50, 44, 48],
    colors: ["#00A86B", "#1B7A4E", "#B8E0C8"],
    texture: "smooth",
    finish: "polished",
    secondaryStrength: 0.3,
  },
  carnelian: {
    shape: [48, 44, 50, 38],
    colors: ["#B31B1B", "#E25822", "#FFDAB9"],
    texture: "banded",
    finish: "polished",
    secondaryStrength: 0.35,
  },
  black_obsidian: {
    shape: [50, 46, 42, 48],
    colors: ["#0B0B0B", "#1A1A2E", "#555555"],
    texture: "smooth",
    finish: "glassy",
    secondaryStrength: 0.2,
  },
  citrine: {
    shape: [36, 44, 32, 48],
    colors: ["#E4D00A", "#CC9900", "#FFF8DC"],
    texture: "crystalline",
    finish: "glassy",
    secondaryStrength: 0.35,
  },
  garnet: {
    shape: [42, 48, 44, 38],
    colors: ["#9B111E", "#6B0A14", "#D4726A"],
    texture: "speckled",
    finish: "polished",
    secondaryStrength: 0.3,
  },
  aquamarine: {
    shape: [38, 50, 34, 44],
    colors: ["#7FFFD4", "#4FB8A5", "#E0FFFF"],
    texture: "crystalline",
    finish: "glassy",
    secondaryStrength: 0.3,
  },
  moonstone: {
    shape: [46, 50, 48, 44],
    colors: ["#F0EAD6", "#C8BFA9", "#B0C4DE"],
    texture: "smooth",
    finish: "polished",
    secondaryStrength: 0.35,
  },
  smoky_quartz: {
    shape: [34, 42, 30, 46],
    colors: ["#736357", "#5A4A3E", "#A89080"],
    texture: "crystalline",
    finish: "glassy",
    secondaryStrength: 0.3,
  },
  green_aventurine: {
    shape: [44, 48, 46, 42],
    colors: ["#568203", "#3D6B1E", "#90B060"],
    texture: "speckled",
    finish: "tumbled",
    secondaryStrength: 0.3,
  },
  malachite: {
    shape: [46, 42, 50, 44],
    colors: ["#0BDA51", "#006B3C", "#98FB98"],
    texture: "banded",
    finish: "polished",
    secondaryStrength: 0.5,
  },
  turquoise: {
    shape: [42, 48, 38, 50],
    colors: ["#40E0D0", "#1A8A7D", "#1C1C1C"],
    texture: "veined",
    finish: "tumbled",
    secondaryStrength: 0.3,
  },
  rhodonite: {
    shape: [44, 50, 42, 46],
    colors: ["#E75480", "#CC3366", "#1C1C1C"],
    texture: "veined",
    finish: "tumbled",
    secondaryStrength: 0.35,
  },
  fluorite: {
    shape: [40, 46, 36, 50],
    colors: ["#A8D8B9", "#7B68AE", "#D4F0E0"],
    texture: "banded",
    finish: "glassy",
    secondaryStrength: 0.4,
  },
  labradorite: {
    shape: [48, 44, 50, 40],
    colors: ["#6E7783", "#2E4057", "#5AAFA0"],
    texture: "mottled",
    finish: "polished",
    secondaryStrength: 0.4,
  },
  sugilite: {
    shape: [44, 48, 42, 46],
    colors: ["#8B008B", "#5E005E", "#D8BFD8"],
    texture: "mottled",
    finish: "tumbled",
    secondaryStrength: 0.3,
  },
  prehnite: {
    shape: [42, 46, 44, 50],
    colors: ["#C9E9CC", "#A0D0A0", "#F0FFF0"],
    texture: "smooth",
    finish: "glassy",
    secondaryStrength: 0.25,
  },
  amber: {
    shape: [50, 42, 46, 38],
    colors: ["#FFBF00", "#CC8400", "#FFE4B5"],
    texture: "mottled",
    finish: "polished",
    secondaryStrength: 0.35,
  },
  agate: {
    shape: [46, 44, 50, 42],
    colors: ["#B5A27F", "#8B7355", "#D4C4A8"],
    texture: "banded",
    finish: "polished",
    secondaryStrength: 0.45,
  },
  chrysanthemum_stone: {
    shape: [38, 44, 34, 48],
    colors: ["#A9A9A9", "#696969", "#F5F5F5"],
    texture: "veined",
    finish: "raw",
    secondaryStrength: 0.4,
  },
};

const DEFAULT_PROFILE: GemProfile = {
  shape: [45, 45, 45, 45],
  colors: ["#888888", "#666666", "#AAAAAA"],
  texture: "smooth",
  finish: "tumbled",
  secondaryStrength: 0.3,
};

// Natural canvas size per stone: [width, height]
export const GEM_SIZES: Record<string, [number, number]> = {
  clear_quartz:      [48, 54],
  jade_jadeite:      [46, 44],
  black_tourmaline:  [42, 52],
  amber:             [50, 40],
  rose_quartz:       [44, 46],
  amethyst:          [40, 48],
  tigers_eye:        [46, 36],
  agate:             [44, 38],
  smoky_quartz:      [36, 46],
  black_obsidian:    [42, 40],
  malachite:         [44, 36],
  green_aventurine:  [38, 40],
  lapis_lazuli:      [38, 42],
  citrine:           [34, 44],
  carnelian:         [38, 34],
  aquamarine:        [30, 44],
  moonstone:         [38, 32],
  turquoise:         [36, 30],
  labradorite:       [40, 34],
  fluorite:          [32, 38],
  garnet:            [28, 30],
  rhodonite:         [32, 26],
  prehnite:          [28, 34],
  sugilite:          [26, 28],
  chrysanthemum_stone: [32, 28],
};

const DEFAULT_SIZE: [number, number] = [38, 38];

export function getGemSize(stoneId: string): [number, number] {
  return GEM_SIZES[stoneId] || DEFAULT_SIZE;
}

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function darken(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - amt);
  const g = Math.max(0, ((n >> 8) & 0xff) - amt);
  const b = Math.max(0, (n & 0xff) - amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

interface GemStoneProps {
  stoneId: string;
  colorHex: string;
  size?: number;
  useNatural?: boolean;
  noShadow?: boolean;
}

export function GemStone({ stoneId, colorHex, size, useNatural, noShadow }: GemStoneProps) {
  const prof = PROFILES[stoneId] || DEFAULT_PROFILE;
  const [natW, natH] = getGemSize(stoneId);
  const [base, secondary, accent] = prof.colors;

  let w: number, h: number;
  if (useNatural) {
    w = natW;
    h = natH;
  } else if (size) {
    const maxDim = Math.max(natW, natH);
    const sc = size / maxDim;
    w = Math.round(natW * sc);
    h = Math.round(natH * sc);
  } else {
    w = natW;
    h = natH;
  }

  const m = Math.min(w, h);
  const [tl, tr, br, bl] = prof.shape.map((p) => (p / 100) * m);
  const dark = darken(base, 50);
  const vdark = darken(base, 80);
  const light = lighten(base, 60);

  const shineOpacity =
    prof.finish === "glassy" ? 0.7 :
    prof.finish === "polished" ? 0.55 :
    prof.finish === "tumbled" ? 0.35 : 0.15;

  const borderRadii = {
    borderTopLeftRadius: tl,
    borderTopRightRadius: tr,
    borderBottomRightRadius: br,
    borderBottomLeftRadius: bl,
  };

  return (
    <View
      style={[
        s.wrap,
        { width: w, height: h, ...borderRadii },
        !noShadow && s.shadow,
      ]}
    >
      {/* Base color fill */}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          ...borderRadii,
          backgroundColor: base,
        }}
      />

      {/* Secondary color zone - offset for natural color variation */}
      <View
        style={{
          position: "absolute",
          top: h * 0.15,
          left: w * 0.05,
          width: w * 0.6,
          height: h * 0.55,
          borderTopLeftRadius: tl * 0.8,
          borderTopRightRadius: tr * 0.6,
          borderBottomRightRadius: br * 0.7,
          borderBottomLeftRadius: bl * 0.5,
          backgroundColor: secondary,
          opacity: prof.secondaryStrength,
        }}
      />

      {/* Deep shadow at bottom */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: w,
          height: h * 0.5,
          borderBottomLeftRadius: bl,
          borderBottomRightRadius: br,
          backgroundColor: vdark,
          opacity: 0.3,
        }}
      />

      {/* ---- TEXTURE LAYERS ---- */}

      {prof.texture === "veined" && (
        <>
          <View style={{
            position: "absolute", top: h * 0.15, left: w * 0.1,
            width: w * 0.7, height: 1.5,
            backgroundColor: accent, opacity: 0.6,
            transform: [{ rotate: "25deg" }],
          }} />
          <View style={{
            position: "absolute", top: h * 0.4, left: w * 0.2,
            width: w * 0.6, height: 1,
            backgroundColor: accent, opacity: 0.45,
            transform: [{ rotate: "-18deg" }],
          }} />
          <View style={{
            position: "absolute", top: h * 0.6, left: w * 0.05,
            width: w * 0.5, height: 1,
            backgroundColor: accent, opacity: 0.35,
            transform: [{ rotate: "40deg" }],
          }} />
          <View style={{
            position: "absolute", top: h * 0.3, left: w * 0.5,
            width: w * 0.35, height: 0.8,
            backgroundColor: accent, opacity: 0.3,
            transform: [{ rotate: "-35deg" }],
          }} />
        </>
      )}

      {prof.texture === "banded" && (
        <>
          <View style={{
            position: "absolute", top: h * 0.2, left: w * 0.05,
            width: w * 0.9, height: h * 0.12,
            borderRadius: m * 0.06,
            backgroundColor: secondary, opacity: 0.45,
            transform: [{ rotate: "-3deg" }],
          }} />
          <View style={{
            position: "absolute", top: h * 0.42, left: w * 0.08,
            width: w * 0.85, height: h * 0.08,
            borderRadius: m * 0.04,
            backgroundColor: accent, opacity: 0.3,
            transform: [{ rotate: "2deg" }],
          }} />
          <View style={{
            position: "absolute", top: h * 0.6, left: w * 0.1,
            width: w * 0.75, height: h * 0.06,
            borderRadius: m * 0.03,
            backgroundColor: secondary, opacity: 0.35,
            transform: [{ rotate: "-2deg" }],
          }} />
        </>
      )}

      {prof.texture === "speckled" && (
        <>
          {/* Scattered flecks/inclusions */}
          <View style={{ position: "absolute", top: h * 0.2, left: w * 0.3,
            width: m * 0.06, height: m * 0.06, borderRadius: m * 0.03,
            backgroundColor: accent, opacity: 0.5 }} />
          <View style={{ position: "absolute", top: h * 0.45, left: w * 0.6,
            width: m * 0.05, height: m * 0.04, borderRadius: m * 0.02,
            backgroundColor: accent, opacity: 0.45 }} />
          <View style={{ position: "absolute", top: h * 0.35, left: w * 0.15,
            width: m * 0.04, height: m * 0.05, borderRadius: m * 0.02,
            backgroundColor: accent, opacity: 0.4 }} />
          <View style={{ position: "absolute", top: h * 0.6, left: w * 0.4,
            width: m * 0.07, height: m * 0.05, borderRadius: m * 0.03,
            backgroundColor: accent, opacity: 0.35 }} />
          <View style={{ position: "absolute", top: h * 0.15, left: w * 0.55,
            width: m * 0.04, height: m * 0.04, borderRadius: m * 0.02,
            backgroundColor: accent, opacity: 0.5 }} />
          <View style={{ position: "absolute", top: h * 0.7, left: w * 0.25,
            width: m * 0.05, height: m * 0.04, borderRadius: m * 0.02,
            backgroundColor: accent, opacity: 0.3 }} />
        </>
      )}

      {prof.texture === "crystalline" && (
        <>
          {/* Angular facet planes */}
          <View style={{
            position: "absolute", top: h * 0.1, left: w * 0.3,
            width: w * 0.5, height: h * 0.35,
            borderTopLeftRadius: m * 0.02,
            borderTopRightRadius: m * 0.15,
            borderBottomRightRadius: m * 0.05,
            borderBottomLeftRadius: m * 0.1,
            backgroundColor: light, opacity: 0.25,
            transform: [{ rotate: "-5deg" }],
          }} />
          <View style={{
            position: "absolute", top: h * 0.35, left: w * 0.1,
            width: w * 0.4, height: 1.5,
            backgroundColor: light, opacity: 0.5,
            transform: [{ rotate: "-15deg" }],
          }} />
          <View style={{
            position: "absolute", top: h * 0.55, left: w * 0.2,
            width: w * 0.5, height: 1,
            backgroundColor: light, opacity: 0.3,
            transform: [{ rotate: "10deg" }],
          }} />
          {/* Crystal termination highlight */}
          <View style={{
            position: "absolute", top: h * 0.05, left: w * 0.35,
            width: w * 0.3, height: h * 0.15,
            borderTopLeftRadius: m * 0.08,
            borderTopRightRadius: m * 0.12,
            borderBottomRightRadius: m * 0.02,
            borderBottomLeftRadius: m * 0.03,
            backgroundColor: accent, opacity: 0.3,
          }} />
        </>
      )}

      {prof.texture === "mottled" && (
        <>
          {/* Irregular color patches */}
          <View style={{
            position: "absolute", top: h * 0.2, left: w * 0.15,
            width: w * 0.35, height: h * 0.3,
            borderRadius: m * 0.15,
            backgroundColor: secondary, opacity: 0.3,
            transform: [{ rotate: "15deg" }],
          }} />
          <View style={{
            position: "absolute", top: h * 0.5, left: w * 0.4,
            width: w * 0.4, height: h * 0.25,
            borderRadius: m * 0.12,
            backgroundColor: accent, opacity: 0.25,
            transform: [{ rotate: "-10deg" }],
          }} />
          <View style={{
            position: "absolute", top: h * 0.1, left: w * 0.5,
            width: w * 0.25, height: h * 0.2,
            borderRadius: m * 0.1,
            backgroundColor: accent, opacity: 0.2,
          }} />
        </>
      )}

      {prof.texture === "smooth" && (
        <>
          {/* Subtle dome highlight */}
          <View style={{
            position: "absolute", top: h * 0.08, left: w * 0.12,
            width: w * 0.6, height: h * 0.45,
            borderRadius: m * 0.3,
            backgroundColor: light, opacity: 0.2,
          }} />
        </>
      )}

      {/* ---- HIGHLIGHTS & SHINE ---- */}

      {/* Main highlight - upper area */}
      <View
        style={{
          position: "absolute",
          top: h * 0.08,
          left: w * 0.15,
          width: w * 0.55,
          height: h * 0.35,
          borderTopLeftRadius: tl * 0.6,
          borderTopRightRadius: tr * 0.8,
          borderBottomRightRadius: br * 0.3,
          borderBottomLeftRadius: bl * 0.4,
          backgroundColor: light,
          opacity: prof.finish === "raw" ? 0.1 : 0.2,
        }}
      />

      {/* Primary shine spot */}
      <View
        style={{
          position: "absolute",
          top: h * 0.12,
          left: w * 0.2,
          width: m * 0.2,
          height: m * 0.15,
          borderRadius: m * 0.08,
          backgroundColor: "#FFFFFF",
          opacity: shineOpacity,
          transform: [{ rotate: "-10deg" }],
        }}
      />

      {/* Secondary shine */}
      <View
        style={{
          position: "absolute",
          top: h * 0.26,
          left: w * 0.35,
          width: m * 0.08,
          height: m * 0.06,
          borderRadius: m * 0.04,
          backgroundColor: "#FFFFFF",
          opacity: shineOpacity * 0.5,
        }}
      />

      {/* Edge catch light */}
      {(prof.finish === "polished" || prof.finish === "glassy") && (
        <View
          style={{
            position: "absolute",
            bottom: h * 0.15,
            right: w * 0.12,
            width: m * 0.07,
            height: m * 0.04,
            borderRadius: m * 0.03,
            backgroundColor: "#FFFFFF",
            opacity: 0.2,
          }}
        />
      )}

      {/* Rim / edge definition */}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          ...borderRadii,
          borderWidth: m > 28 ? 1 : 0.5,
          borderColor: dark,
          opacity: 0.25,
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position: "relative",
    overflow: "hidden",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
});
