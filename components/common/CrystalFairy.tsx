import { useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Circle,
  Ellipse,
  Path,
  G,
  Rect,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import type { EvolutionStage, CrystalStage } from "../../stores/fairyStore";
import { ALL_OUTFITS, type OutfitStyle } from "../../data/fairyOutfits";

/**
 * Crystal Fairy avatar — SVG watercolor kawaii style.
 * Inspired by Takae's concept art: soft translucent layers, flowing hair,
 * petal/butterfly wings, chibi proportions, big expressive eyes.
 */

export type FairyMood = "idle" | "happy" | "excited" | "thinking" | "sleeping";

interface CrystalFairyProps {
  colorHex: string;
  accentHex?: string;
  size?: number;
  mood?: FairyMood;
  level?: number;
  message?: string | null;
  isStatic?: boolean;
  evolutionStage?: EvolutionStage;
  crystalStage?: CrystalStage;
  isSleeping?: boolean;
  equippedOutfits?: Record<string, string>;
}

/** Lighten a hex color by mixing with white */
function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.min(255, Math.round(r + (255 - r) * amount));
  const ng = Math.min(255, Math.round(g + (255 - g) * amount));
  const nb = Math.min(255, Math.round(b + (255 - b) * amount));
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

/** Darken a hex color */
function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.max(0, Math.round(r * (1 - amount)));
  const ng = Math.max(0, Math.round(g * (1 - amount)));
  const nb = Math.max(0, Math.round(b * (1 - amount)));
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

function getOutfitStyle(outfitId: string | undefined): OutfitStyle | null {
  if (!outfitId) return null;
  return ALL_OUTFITS.find((o) => o.id === outfitId)?.style || null;
}

/**
 * Generate SVG path for a petal/butterfly wing shape.
 * cx,cy = attachment point (shoulder), direction: -1 left, +1 right
 */
function wingPath(
  cx: number, cy: number,
  w: number, h: number,
  dir: number,
  shape: string,
  evo: number,
): string {
  const dx = dir * w;
  const dy = -h * 0.3;
  const tipX = cx + dx;
  const tipY = cy + dy;

  if (shape === "butterfly") {
    // Upper lobe
    const upperCP1x = cx + dx * 0.3;
    const upperCP1y = cy - h * 0.7;
    const upperCP2x = tipX;
    const upperCP2y = cy - h * 0.65;
    // Lower lobe
    const lowerTipX = cx + dx * 0.8;
    const lowerTipY = cy + h * 0.35;
    const lowerCP1x = cx + dx * 0.9;
    const lowerCP1y = cy + h * 0.05;
    const lowerCP2x = cx + dx * 0.6;
    const lowerCP2y = cy + h * 0.4;
    return `M ${cx} ${cy} C ${upperCP1x} ${upperCP1y}, ${upperCP2x} ${upperCP2y}, ${tipX} ${tipY}
            C ${tipX} ${cy - h * 0.1}, ${cx + dx * 0.5} ${cy}, ${cx + dx * 0.5} ${cy}
            C ${lowerCP1x} ${lowerCP1y}, ${lowerCP1x} ${lowerCP2y}, ${lowerTipX} ${lowerTipY}
            C ${lowerCP2x} ${lowerCP2y}, ${cx + dx * 0.15} ${cy + h * 0.15}, ${cx} ${cy} Z`;
  }

  if (shape === "crystal") {
    // Angular faceted wing
    const p1x = cx + dx * 0.15;
    const p1y = cy - h * 0.6;
    const p2x = cx + dx * 0.7;
    const p2y = cy - h * 0.7;
    const p3x = tipX;
    const p3y = cy - h * 0.2;
    const p4x = cx + dx * 0.6;
    const p4y = cy + h * 0.2;
    return `M ${cx} ${cy} L ${p1x} ${p1y} L ${p2x} ${p2y} L ${p3x} ${p3y} L ${p4x} ${p4y} Z`;
  }

  if (shape === "feather") {
    // Multi-layered feather wing (more curves)
    const cp1x = cx + dx * 0.2;
    const cp1y = cy - h * 0.85;
    const cp2x = tipX * 1.05;
    const cp2y = cy - h * 0.5;
    const cp3x = tipX;
    const cp3y = cy + h * 0.1;
    const cp4x = cx + dx * 0.3;
    const cp4y = cy + h * 0.25;
    return `M ${cx} ${cy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tipX} ${tipY}
            C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${cx} ${cy} Z`;
  }

  if (shape === "petal") {
    // Soft petal shape — teardrop
    const cp1x = cx + dx * 0.1;
    const cp1y = cy - h * 0.75;
    const cp2x = tipX;
    const cp2y = cy - h * 0.55;
    const cp3x = tipX;
    const cp3y = cy + h * 0.1;
    const cp4x = cx + dx * 0.15;
    const cp4y = cy + h * 0.2;
    return `M ${cx} ${cy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tipX} ${tipY}
            C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${cx} ${cy} Z`;
  }

  // Default: round wings
  const cp1x = cx + dx * 0.15;
  const cp1y = cy - h * 0.65;
  const cp2x = tipX;
  const cp2y = cy - h * 0.45;
  const cp3x = tipX;
  const cp3y = cy + h * 0.15;
  const cp4x = cx + dx * 0.2;
  const cp4y = cy + h * 0.2;
  return `M ${cx} ${cy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tipX} ${tipY}
          C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${cx} ${cy} Z`;
}

/** Hair strand path */
function hairStrandPath(
  cx: number, baseY: number,
  length: number, dir: number,
  curve: number, width: number,
): string {
  const endX = cx + dir * width * 0.8;
  const endY = baseY + length;
  const cp1x = cx + dir * curve * 0.4;
  const cp1y = baseY + length * 0.4;
  const cp2x = endX + dir * curve * 0.3;
  const cp2y = baseY + length * 0.7;
  return `M ${cx - dir * width * 0.15} ${baseY}
          C ${cp1x - dir * width * 0.15} ${cp1y}, ${cp2x - dir * width * 0.15} ${cp2y}, ${endX - dir * width * 0.2} ${endY}
          L ${endX + dir * width * 0.2} ${endY}
          C ${cp2x + dir * width * 0.15} ${cp2y}, ${cp1x + dir * width * 0.15} ${cp1y}, ${cx + dir * width * 0.15} ${baseY} Z`;
}

/** Crystal gem shape path */
function crystalPath(cx: number, cy: number, w: number, h: number): string {
  // Faceted gem shape
  return `M ${cx} ${cy - h * 0.5}
          L ${cx + w * 0.45} ${cy - h * 0.15}
          L ${cx + w * 0.3} ${cy + h * 0.5}
          L ${cx - w * 0.3} ${cy + h * 0.5}
          L ${cx - w * 0.45} ${cy - h * 0.15} Z`;
}

/** Crown shape */
function crownPath(cx: number, cy: number, w: number, h: number): string {
  return `M ${cx - w * 0.5} ${cy + h * 0.3}
          L ${cx - w * 0.45} ${cy - h * 0.2}
          L ${cx - w * 0.25} ${cy + h * 0.05}
          L ${cx} ${cy - h * 0.5}
          L ${cx + w * 0.25} ${cy + h * 0.05}
          L ${cx + w * 0.45} ${cy - h * 0.2}
          L ${cx + w * 0.5} ${cy + h * 0.3} Z`;
}

export function CrystalFairy({
  colorHex,
  accentHex,
  size = 64,
  mood = "idle",
  level = 1,
  message = null,
  isStatic = false,
  evolutionStage = 1,
  crystalStage = 1,
  isSleeping = false,
  equippedOutfits = {},
}: CrystalFairyProps) {
  const s = size;
  const activeMood = isSleeping ? "sleeping" : mood;
  const accent = accentHex || lighten(colorHex, 0.6);

  // Outfit styles
  const wingsOutfit = getOutfitStyle(equippedOutfits.wings);
  const dressOutfit = getOutfitStyle(equippedOutfits.dress);
  const crownOutfit = getOutfitStyle(equippedOutfits.crown);
  const accessoryOutfit = getOutfitStyle(equippedOutfits.accessory);

  const wingShapeName = wingsOutfit?.wingShape || "round";

  // --- SVG viewBox is 200x200 for consistent proportions ---
  const vb = 200;
  const cx = vb / 2; // center x

  // Scale by evolution
  const evoMul = 0.7 + (evolutionStage - 1) * 0.075;

  // Dimensions (in viewBox units)
  const headR = 28 * evoMul;
  const headCY = 62;
  const bodyW = 36 * evoMul;
  const bodyH = 42 * evoMul;
  const bodyCY = headCY + headR + bodyH * 0.35;
  const shoulderY = headCY + headR * 0.6;
  const wingW = (42 + evolutionStage * 8) * evoMul;
  const wingH = (50 + evolutionStage * 6) * evoMul;

  // Colors
  const wingColor = wingsOutfit?.colorOverride || colorHex;
  const dressColor = dressOutfit?.colorOverride || colorHex;
  const hairColor = colorHex;
  const hairLight = lighten(colorHex, 0.3);
  const hairDark = darken(colorHex, 0.15);
  const skinColor = "#FAE8D8";
  const skinShadow = "#F0D4BC";
  const cheekColor = "#FFB6C1";
  const eyeColor = "#3D2C2C";
  const mouthColor = activeMood === "happy" || activeMood === "excited" ? "#D4726A" : "#C9877A";

  const hasFlowerCrown = evolutionStage >= 3;
  const hasCrystalWings = evolutionStage >= 4;
  const hasGoldAura = evolutionStage >= 5;

  // Crystal dimensions
  const crystalW = 8 + crystalStage * 3;
  const crystalH = 10 + crystalStage * 3.5;
  const crystalCY = bodyCY + bodyH * 0.1;
  const crystalGlow = crystalStage >= 4;

  // Sparkle positions
  const numSparkles = Math.min(evolutionStage + 2, 8);

  // --- Animations ---
  const floatY = useSharedValue(0);
  const bodyScale = useSharedValue(1);
  const tilt = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const bubbleOpacity = useSharedValue(0);
  const bubbleTranslateY = useSharedValue(0);

  useEffect(() => {
    if (isStatic) return;
    if (isSleeping) {
      floatY.value = withRepeat(
        withSequence(
          withTiming(-s * 0.02, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        ), -1, true,
      );
      return;
    }
    const dur = 1200 + evolutionStage * 200;
    floatY.value = withRepeat(
      withSequence(
        withTiming(-s * 0.06, { duration: dur, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: dur, easing: Easing.inOut(Easing.ease) }),
      ), -1, true,
    );
  }, [isStatic, isSleeping, evolutionStage]);

  useEffect(() => {
    if (isStatic || isSleeping) return;
    if (activeMood === "happy") {
      bodyScale.value = withSequence(
        withTiming(1.12, { duration: 150 }),
        withTiming(0.96, { duration: 100 }),
        withTiming(1.08, { duration: 120 }),
        withTiming(1, { duration: 150 }),
      );
    } else if (activeMood === "excited") {
      bodyScale.value = withSequence(
        withTiming(1.18, { duration: 100 }),
        withTiming(0.92, { duration: 80 }),
        withTiming(1.15, { duration: 100 }),
        withTiming(1, { duration: 150 }),
      );
      tilt.value = withSequence(
        withTiming(-6, { duration: 100 }),
        withTiming(6, { duration: 100 }),
        withTiming(-4, { duration: 100 }),
        withTiming(0, { duration: 150 }),
      );
      glowScale.value = withSequence(
        withTiming(1.4, { duration: 300 }),
        withTiming(1, { duration: 500 }),
      );
    } else if (activeMood === "thinking") {
      tilt.value = withSequence(
        withTiming(-8, { duration: 400, easing: Easing.out(Easing.quad) }),
        withDelay(800, withTiming(0, { duration: 400 })),
      );
    }
  }, [activeMood, isStatic, isSleeping]);

  useEffect(() => {
    if (message && !isStatic) {
      bubbleOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(2800, withTiming(0, { duration: 400 })),
      );
      bubbleTranslateY.value = withSequence(
        withTiming(-4, { duration: 200 }),
        withDelay(2800, withTiming(0, { duration: 400 })),
      );
    } else {
      bubbleOpacity.value = 0;
    }
  }, [message, isStatic]);

  const bodyAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: isStatic ? 0 : floatY.value },
      { scale: bodyScale.value },
      { rotate: `${tilt.value}deg` },
    ],
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const bubbleAnimStyle = useAnimatedStyle(() => ({
    opacity: bubbleOpacity.value,
    transform: [{ translateY: bubbleTranslateY.value }],
  }));

  // Memoize SVG content since it's heavy
  const svgContent = useMemo(() => {
    // Eye parameters
    const eyeW = activeMood === "sleeping" ? headR * 0.28 : headR * 0.22;
    const eyeH = activeMood === "sleeping" ? headR * 0.06 : headR * 0.26;
    const eyeGap = headR * 0.38;
    const eyeY = headCY - headR * 0.05;
    const pupilR = headR * 0.08;

    // Mouth
    const mouthW = (activeMood === "happy" || activeMood === "excited") ? headR * 0.22 : headR * 0.15;
    const mouthH = (activeMood === "happy" || activeMood === "excited") ? headR * 0.12 : headR * 0.06;
    const mouthY = headCY + headR * 0.25;

    return (
      <Svg width={s} height={s} viewBox={`0 0 ${vb} ${vb}`}>
        <Defs>
          {/* Wing gradient */}
          <RadialGradient id="wingGrad" cx="30%" cy="30%" r="70%">
            <Stop offset="0%" stopColor={lighten(wingColor, 0.4)} stopOpacity="0.9" />
            <Stop offset="60%" stopColor={wingColor} stopOpacity="0.55" />
            <Stop offset="100%" stopColor={wingColor} stopOpacity="0.2" />
          </RadialGradient>
          {/* Hair gradient */}
          <LinearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={hairLight} stopOpacity="0.95" />
            <Stop offset="100%" stopColor={hairDark} stopOpacity="0.85" />
          </LinearGradient>
          {/* Dress gradient */}
          <LinearGradient id="dressGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={lighten(dressColor, 0.15)} stopOpacity="0.95" />
            <Stop offset="100%" stopColor={dressColor} stopOpacity="0.85" />
          </LinearGradient>
          {/* Crystal gradient */}
          <LinearGradient id="crystalGrad" x1="0" y1="0" x2="0.5" y2="1">
            <Stop offset="0%" stopColor={lighten(colorHex, 0.5)} stopOpacity="1" />
            <Stop offset="50%" stopColor={colorHex} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={darken(colorHex, 0.2)} stopOpacity="0.95" />
          </LinearGradient>
          {/* Glow */}
          <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <Stop offset="70%" stopColor={accent} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={accent} stopOpacity="0" />
          </RadialGradient>
          {/* Skin */}
          <RadialGradient id="skinGrad" cx="40%" cy="35%" r="60%">
            <Stop offset="0%" stopColor={skinColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={skinShadow} stopOpacity="1" />
          </RadialGradient>
          {/* Crystal glow */}
          {crystalGlow && (
            <RadialGradient id="crystalGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={colorHex} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={colorHex} stopOpacity="0" />
            </RadialGradient>
          )}
          {/* Gold aura */}
          {hasGoldAura && (
            <RadialGradient id="goldAura" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFD700" stopOpacity="0" />
              <Stop offset="70%" stopColor="#FFD700" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#FFD700" stopOpacity="0.2" />
            </RadialGradient>
          )}
        </Defs>

        {/* Background glow */}
        <Circle cx={cx} cy={cx * 0.85} r={80} fill="url(#glowGrad)" />

        {/* Gold aura (stage 5) */}
        {hasGoldAura && (
          <Circle cx={cx} cy={cx * 0.85} r={88} fill="url(#goldAura)" />
        )}

        {/* === WINGS === */}
        {/* Left wing */}
        <Path
          d={wingPath(cx - headR * 0.3, shoulderY, wingW, wingH, -1, wingShapeName, evolutionStage)}
          fill="url(#wingGrad)"
          opacity={0.8}
        />
        {/* Wing vein/detail lines */}
        {evolutionStage >= 3 && (
          <Path
            d={`M ${cx - headR * 0.3} ${shoulderY}
                Q ${cx - wingW * 0.4} ${shoulderY - wingH * 0.35}, ${cx - wingW * 0.7} ${shoulderY - wingH * 0.25}`}
            stroke={lighten(wingColor, 0.3)}
            strokeWidth="0.8"
            fill="none"
            opacity={0.5}
          />
        )}
        {evolutionStage >= 4 && (
          <Path
            d={`M ${cx - headR * 0.3} ${shoulderY}
                Q ${cx - wingW * 0.3} ${shoulderY - wingH * 0.5}, ${cx - wingW * 0.55} ${shoulderY - wingH * 0.45}`}
            stroke={lighten(wingColor, 0.4)}
            strokeWidth="0.6"
            fill="none"
            opacity={0.4}
          />
        )}

        {/* Right wing */}
        <Path
          d={wingPath(cx + headR * 0.3, shoulderY, wingW, wingH, 1, wingShapeName, evolutionStage)}
          fill="url(#wingGrad)"
          opacity={0.8}
        />
        {evolutionStage >= 3 && (
          <Path
            d={`M ${cx + headR * 0.3} ${shoulderY}
                Q ${cx + wingW * 0.4} ${shoulderY - wingH * 0.35}, ${cx + wingW * 0.7} ${shoulderY - wingH * 0.25}`}
            stroke={lighten(wingColor, 0.3)}
            strokeWidth="0.8"
            fill="none"
            opacity={0.5}
          />
        )}
        {evolutionStage >= 4 && (
          <Path
            d={`M ${cx + headR * 0.3} ${shoulderY}
                Q ${cx + wingW * 0.3} ${shoulderY - wingH * 0.5}, ${cx + wingW * 0.55} ${shoulderY - wingH * 0.45}`}
            stroke={lighten(wingColor, 0.4)}
            strokeWidth="0.6"
            fill="none"
            opacity={0.4}
          />
        )}

        {/* === HAIR (behind head) === */}
        {/* Main hair volume */}
        <Ellipse
          cx={cx}
          cy={headCY - headR * 0.1}
          rx={headR * 1.25}
          ry={headR * 1.1}
          fill="url(#hairGrad)"
        />

        {/* Side hair strands (stage 3+) */}
        {evolutionStage >= 3 && (
          <>
            <Path
              d={hairStrandPath(cx - headR * 0.7, headCY + headR * 0.3, headR * 1.4, -1, headR * 0.6, headR * 0.35)}
              fill={hairColor}
              opacity={0.7}
            />
            <Path
              d={hairStrandPath(cx + headR * 0.7, headCY + headR * 0.3, headR * 1.4, 1, headR * 0.6, headR * 0.35)}
              fill={hairColor}
              opacity={0.7}
            />
          </>
        )}
        {/* Longer back strands (stage 4+) */}
        {evolutionStage >= 4 && (
          <>
            <Path
              d={hairStrandPath(cx - headR * 0.5, headCY + headR * 0.5, headR * 1.8, -1, headR * 0.8, headR * 0.25)}
              fill={hairDark}
              opacity={0.5}
            />
            <Path
              d={hairStrandPath(cx + headR * 0.5, headCY + headR * 0.5, headR * 1.8, 1, headR * 0.8, headR * 0.25)}
              fill={hairDark}
              opacity={0.5}
            />
          </>
        )}

        {/* === HEAD === */}
        <Circle cx={cx} cy={headCY} r={headR} fill="url(#skinGrad)" />

        {/* Bangs / fringe */}
        <Path
          d={`M ${cx - headR * 0.9} ${headCY - headR * 0.3}
              Q ${cx - headR * 0.5} ${headCY - headR * 1.2}, ${cx} ${headCY - headR * 0.85}
              Q ${cx + headR * 0.5} ${headCY - headR * 1.2}, ${cx + headR * 0.9} ${headCY - headR * 0.3}
              Q ${cx + headR * 0.3} ${headCY - headR * 0.5}, ${cx} ${headCY - headR * 0.35}
              Q ${cx - headR * 0.3} ${headCY - headR * 0.5}, ${cx - headR * 0.9} ${headCY - headR * 0.3} Z`}
          fill={hairColor}
          opacity={0.9}
        />
        {/* Side bangs */}
        <Path
          d={`M ${cx - headR * 0.85} ${headCY - headR * 0.25}
              Q ${cx - headR * 1.0} ${headCY}, ${cx - headR * 0.75} ${headCY + headR * 0.2}
              Q ${cx - headR * 0.6} ${headCY}, ${cx - headR * 0.7} ${headCY - headR * 0.25} Z`}
          fill={hairColor}
          opacity={0.75}
        />
        <Path
          d={`M ${cx + headR * 0.85} ${headCY - headR * 0.25}
              Q ${cx + headR * 1.0} ${headCY}, ${cx + headR * 0.75} ${headCY + headR * 0.2}
              Q ${cx + headR * 0.6} ${headCY}, ${cx + headR * 0.7} ${headCY - headR * 0.25} Z`}
          fill={hairColor}
          opacity={0.75}
        />

        {/* === EYES === */}
        {activeMood === "sleeping" ? (
          <>
            {/* Closed eyes — curved lines */}
            <Path
              d={`M ${cx - eyeGap - eyeW * 0.5} ${eyeY} Q ${cx - eyeGap} ${eyeY + headR * 0.1}, ${cx - eyeGap + eyeW * 0.5} ${eyeY}`}
              stroke={eyeColor}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={`M ${cx + eyeGap - eyeW * 0.5} ${eyeY} Q ${cx + eyeGap} ${eyeY + headR * 0.1}, ${cx + eyeGap + eyeW * 0.5} ${eyeY}`}
              stroke={eyeColor}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            {/* Left eye */}
            <Ellipse cx={cx - eyeGap} cy={eyeY} rx={eyeW * 0.5} ry={eyeH * 0.5} fill={eyeColor} />
            {/* Eye highlight (top-left sparkle) */}
            <Circle cx={cx - eyeGap - eyeW * 0.12} cy={eyeY - eyeH * 0.15} r={pupilR} fill="#FFFFFF" />
            <Circle cx={cx - eyeGap + eyeW * 0.15} cy={eyeY + eyeH * 0.1} r={pupilR * 0.5} fill="#FFFFFF" opacity={0.6} />
            {/* Tiny eyelash */}
            {evolutionStage >= 3 && (
              <Path
                d={`M ${cx - eyeGap + eyeW * 0.4} ${eyeY - eyeH * 0.4}
                    Q ${cx - eyeGap + eyeW * 0.6} ${eyeY - eyeH * 0.7}, ${cx - eyeGap + eyeW * 0.7} ${eyeY - eyeH * 0.55}`}
                stroke={eyeColor}
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            )}

            {/* Right eye */}
            <Ellipse cx={cx + eyeGap} cy={eyeY} rx={eyeW * 0.5} ry={eyeH * 0.5} fill={eyeColor} />
            <Circle cx={cx + eyeGap - eyeW * 0.12} cy={eyeY - eyeH * 0.15} r={pupilR} fill="#FFFFFF" />
            <Circle cx={cx + eyeGap + eyeW * 0.15} cy={eyeY + eyeH * 0.1} r={pupilR * 0.5} fill="#FFFFFF" opacity={0.6} />
            {evolutionStage >= 3 && (
              <Path
                d={`M ${cx + eyeGap - eyeW * 0.4} ${eyeY - eyeH * 0.4}
                    Q ${cx + eyeGap - eyeW * 0.6} ${eyeY - eyeH * 0.7}, ${cx + eyeGap - eyeW * 0.7} ${eyeY - eyeH * 0.55}`}
                stroke={eyeColor}
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            )}
          </>
        )}

        {/* Blush cheeks */}
        <Ellipse
          cx={cx - headR * 0.55}
          cy={headCY + headR * 0.15}
          rx={headR * 0.18}
          ry={headR * 0.1}
          fill={cheekColor}
          opacity={(activeMood === "happy" || activeMood === "excited") ? 0.6 : 0.3}
        />
        <Ellipse
          cx={cx + headR * 0.55}
          cy={headCY + headR * 0.15}
          rx={headR * 0.18}
          ry={headR * 0.1}
          fill={cheekColor}
          opacity={(activeMood === "happy" || activeMood === "excited") ? 0.6 : 0.3}
        />

        {/* Mouth */}
        {(activeMood === "happy" || activeMood === "excited") ? (
          <Path
            d={`M ${cx - mouthW * 0.5} ${mouthY}
                Q ${cx} ${mouthY + mouthH * 2.5}, ${cx + mouthW * 0.5} ${mouthY}`}
            stroke={mouthColor}
            strokeWidth="1.3"
            fill={mouthColor}
            fillOpacity={0.3}
            strokeLinecap="round"
          />
        ) : (
          <Ellipse cx={cx} cy={mouthY} rx={mouthW * 0.35} ry={mouthH * 0.5} fill={mouthColor} opacity={0.7} />
        )}

        {/* Tiny nose */}
        <Circle cx={cx} cy={headCY + headR * 0.08} r={headR * 0.04} fill={skinShadow} opacity={0.5} />

        {/* === BODY / DRESS === */}
        {/* Arms */}
        <Path
          d={`M ${cx - bodyW * 0.45} ${bodyCY - bodyH * 0.25}
              Q ${cx - bodyW * 0.8} ${bodyCY}, ${cx - bodyW * 0.5} ${bodyCY + bodyH * 0.15}`}
          stroke={skinColor}
          strokeWidth={bodyW * 0.12}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${cx + bodyW * 0.45} ${bodyCY - bodyH * 0.25}
              Q ${cx + bodyW * 0.8} ${bodyCY}, ${cx + bodyW * 0.5} ${bodyCY + bodyH * 0.15}`}
          stroke={skinColor}
          strokeWidth={bodyW * 0.12}
          fill="none"
          strokeLinecap="round"
        />
        {/* Hands (small circles) */}
        <Circle cx={cx - bodyW * 0.5} cy={bodyCY + bodyH * 0.15} r={bodyW * 0.08} fill={skinColor} />
        <Circle cx={cx + bodyW * 0.5} cy={bodyCY + bodyH * 0.15} r={bodyW * 0.08} fill={skinColor} />

        {/* Dress body */}
        <Path
          d={`M ${cx - bodyW * 0.3} ${bodyCY - bodyH * 0.4}
              Q ${cx - bodyW * 0.35} ${bodyCY - bodyH * 0.2}, ${cx - bodyW * 0.55} ${bodyCY + bodyH * 0.4}
              Q ${cx} ${bodyCY + bodyH * 0.55}, ${cx + bodyW * 0.55} ${bodyCY + bodyH * 0.4}
              Q ${cx + bodyW * 0.35} ${bodyCY - bodyH * 0.2}, ${cx + bodyW * 0.3} ${bodyCY - bodyH * 0.4}
              Q ${cx} ${bodyCY - bodyH * 0.45}, ${cx - bodyW * 0.3} ${bodyCY - bodyH * 0.4} Z`}
          fill="url(#dressGrad)"
        />
        {/* Dress ruffle/hem */}
        <Path
          d={`M ${cx - bodyW * 0.55} ${bodyCY + bodyH * 0.38}
              Q ${cx - bodyW * 0.35} ${bodyCY + bodyH * 0.55}, ${cx - bodyW * 0.15} ${bodyCY + bodyH * 0.42}
              Q ${cx} ${bodyCY + bodyH * 0.58}, ${cx + bodyW * 0.15} ${bodyCY + bodyH * 0.42}
              Q ${cx + bodyW * 0.35} ${bodyCY + bodyH * 0.55}, ${cx + bodyW * 0.55} ${bodyCY + bodyH * 0.38}`}
          stroke={darken(dressColor, 0.1)}
          strokeWidth="0.8"
          fill="none"
          opacity={0.5}
        />
        {/* Collar / neckline detail */}
        <Path
          d={`M ${cx - bodyW * 0.2} ${bodyCY - bodyH * 0.38}
              Q ${cx} ${bodyCY - bodyH * 0.3}, ${cx + bodyW * 0.2} ${bodyCY - bodyH * 0.38}`}
          stroke={lighten(dressColor, 0.3)}
          strokeWidth="1"
          fill="none"
          opacity={0.6}
        />

        {/* Dress pattern overlay for non-solid outfits */}
        {dressOutfit && dressOutfit.pattern === "starry" && (
          <>
            <Circle cx={cx - bodyW * 0.15} cy={bodyCY} r={1.5} fill="#FFFFFF" opacity={0.5} />
            <Circle cx={cx + bodyW * 0.2} cy={bodyCY - bodyH * 0.1} r={1} fill="#FFFFFF" opacity={0.4} />
            <Circle cx={cx} cy={bodyCY + bodyH * 0.2} r={1.2} fill="#FFFFFF" opacity={0.45} />
          </>
        )}

        {/* Feet (tiny) */}
        <Ellipse cx={cx - bodyW * 0.15} cy={bodyCY + bodyH * 0.48} rx={bodyW * 0.12} ry={bodyW * 0.06} fill={skinColor} />
        <Ellipse cx={cx + bodyW * 0.15} cy={bodyCY + bodyH * 0.48} rx={bodyW * 0.12} ry={bodyW * 0.06} fill={skinColor} />

        {/* === CRYSTAL HELD === */}
        {crystalGlow && (
          <Circle cx={cx} cy={crystalCY} r={crystalW * 1.5} fill="url(#crystalGlow)" />
        )}
        <Path
          d={crystalPath(cx, crystalCY, crystalW, crystalH)}
          fill="url(#crystalGrad)"
          stroke={lighten(colorHex, 0.3)}
          strokeWidth="0.6"
        />
        {/* Crystal facet highlight */}
        <Path
          d={`M ${cx} ${crystalCY - crystalH * 0.5}
              L ${cx + crystalW * 0.15} ${crystalCY - crystalH * 0.15}
              L ${cx - crystalW * 0.15} ${crystalCY - crystalH * 0.1} Z`}
          fill="#FFFFFF"
          opacity={0.35}
        />

        {/* === CROWN / HEADPIECE === */}
        {evolutionStage >= 4 ? (
          // Crystal tiara
          <G>
            <Path
              d={crownPath(cx, headCY - headR * 0.95, headR * 0.7, headR * 0.4)}
              fill={hasGoldAura ? "#FFD700" : lighten(colorHex, 0.3)}
              opacity={0.85}
              stroke={hasGoldAura ? "#DAA520" : darken(colorHex, 0.1)}
              strokeWidth="0.5"
            />
            {/* Center gem on crown */}
            <Circle cx={cx} cy={headCY - headR * 1.15} r={headR * 0.08} fill={colorHex} />
          </G>
        ) : evolutionStage >= 3 ? (
          // Flower crown
          <G opacity={0.85}>
            <Circle cx={cx - headR * 0.3} cy={headCY - headR * 0.9} r={headR * 0.12} fill={cheekColor} />
            <Circle cx={cx} cy={headCY - headR * 0.98} r={headR * 0.14} fill={lighten(colorHex, 0.4)} />
            <Circle cx={cx + headR * 0.3} cy={headCY - headR * 0.9} r={headR * 0.12} fill={cheekColor} />
            {/* Tiny leaves */}
            <Ellipse cx={cx - headR * 0.15} cy={headCY - headR * 0.85} rx={headR * 0.08} ry={headR * 0.04} fill="#7CB87C" opacity={0.6} />
            <Ellipse cx={cx + headR * 0.15} cy={headCY - headR * 0.85} rx={headR * 0.08} ry={headR * 0.04} fill="#7CB87C" opacity={0.6} />
          </G>
        ) : evolutionStage >= 2 ? (
          // Tiny sprout
          <Path
            d={`M ${cx} ${headCY - headR * 0.95}
                Q ${cx - headR * 0.15} ${headCY - headR * 1.3}, ${cx - headR * 0.05} ${headCY - headR * 1.15}
                M ${cx} ${headCY - headR * 0.95}
                Q ${cx + headR * 0.15} ${headCY - headR * 1.3}, ${cx + headR * 0.05} ${headCY - headR * 1.15}`}
            stroke="#7CB87C"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        ) : null}

        {/* === ACCESSORY === */}
        {accessoryOutfit && (
          <Circle
            cx={cx + bodyW * 0.55}
            cy={bodyCY - bodyH * 0.1}
            r={bodyW * 0.1}
            fill={lighten(colorHex, 0.3)}
            stroke={colorHex}
            strokeWidth="0.5"
            opacity={0.8}
          />
        )}

        {/* === SPARKLES === */}
        {Array.from({ length: numSparkles }).map((_, i) => {
          const angle = (i / numSparkles) * Math.PI * 2 + 0.5;
          const radius = 70 + evolutionStage * 5;
          const sx = cx + Math.cos(angle) * radius;
          const sy = cx * 0.85 + Math.sin(angle) * radius;
          const sr = 1.5 + (evolutionStage >= 3 ? 0.8 : 0);
          return (
            <G key={i}>
              <Circle cx={sx} cy={sy} r={sr} fill={colorHex} opacity={0.6} />
              {/* Four-point star sparkle for higher evolutions */}
              {evolutionStage >= 4 && (
                <>
                  <Rect x={sx - 0.4} y={sy - sr * 1.5} width={0.8} height={sr * 3} rx={0.4} fill={colorHex} opacity={0.35} />
                  <Rect x={sx - sr * 1.5} y={sy - 0.4} width={sr * 3} height={0.8} rx={0.4} fill={colorHex} opacity={0.35} />
                </>
              )}
            </G>
          );
        })}

        {/* Sleeping zzz */}
        {isSleeping && (
          <>
            <G opacity={0.5}>
              <Ellipse cx={cx + headR * 0.8} cy={headCY - headR * 0.6} rx={3} ry={2.5} fill="none" stroke={colorHex} strokeWidth="0.8" />
              <Ellipse cx={cx + headR * 1.1} cy={headCY - headR * 0.9} rx={4} ry={3} fill="none" stroke={colorHex} strokeWidth="0.7" />
              <Ellipse cx={cx + headR * 1.4} cy={headCY - headR * 1.2} rx={5} ry={3.5} fill="none" stroke={colorHex} strokeWidth="0.6" />
            </G>
          </>
        )}
      </Svg>
    );
  }, [activeMood, evolutionStage, crystalStage, colorHex, s, wingShapeName, dressColor, isSleeping, hasGoldAura, accent]);

  // Stage 1 (Seed Sprite) — simplified orb
  if (evolutionStage === 1) {
    return (
      <View style={{ width: s, height: s + (message ? s * 0.5 : 0), alignItems: "center" }}>
        {message && (
          <Animated.View
            style={[styles.bubble, { maxWidth: s * 3, minWidth: s * 1.2 }, bubbleAnimStyle]}
          >
            <Text style={[styles.bubbleText, { fontSize: Math.max(9, s * 0.14) }]} numberOfLines={2}>
              {message}
            </Text>
          </Animated.View>
        )}
        <Animated.View style={[{ width: s, height: s }, bodyAnimStyle]}>
          <Svg width={s} height={s} viewBox={`0 0 ${vb} ${vb}`}>
            <Defs>
              <RadialGradient id="seedGlow" cx="45%" cy="40%" r="55%">
                <Stop offset="0%" stopColor={lighten(colorHex, 0.5)} stopOpacity="0.9" />
                <Stop offset="50%" stopColor={colorHex} stopOpacity="0.6" />
                <Stop offset="100%" stopColor={colorHex} stopOpacity="0.15" />
              </RadialGradient>
            </Defs>
            {/* Outer glow */}
            <Circle cx={cx} cy={cx} r={50} fill={accent} opacity={0.3} />
            {/* Main orb */}
            <Circle cx={cx} cy={cx} r={30} fill="url(#seedGlow)" />
            {/* Inner bright core */}
            <Circle cx={cx - 5} cy={cx - 5} r={12} fill={lighten(colorHex, 0.5)} opacity={0.7} />
            {/* Faint wing buds */}
            <Ellipse cx={cx - 30} cy={cx + 5} rx={15} ry={20} fill={colorHex} opacity={0.15} />
            <Ellipse cx={cx + 30} cy={cx + 5} rx={15} ry={20} fill={colorHex} opacity={0.15} />
            {/* Tiny crystal */}
            <Path d={crystalPath(cx, cx + 28, 6, 8)} fill={colorHex} opacity={0.7} />
            {/* Sparkles */}
            <Circle cx={cx - 35} cy={cx - 25} r={2} fill={colorHex} opacity={0.5} />
            <Circle cx={cx + 30} cy={cx + 30} r={1.5} fill={colorHex} opacity={0.4} />
          </Svg>
        </Animated.View>
      </View>
    );
  }

  // Stages 2-5 — full fairy
  return (
    <View style={{ width: s, height: s + (message ? s * 0.5 : 0), alignItems: "center" }}>
      {message && (
        <Animated.View
          style={[styles.bubble, { maxWidth: s * 3, minWidth: s * 1.2 }, bubbleAnimStyle]}
        >
          <Text style={[styles.bubbleText, { fontSize: Math.max(9, s * 0.14) }]} numberOfLines={2}>
            {message}
          </Text>
        </Animated.View>
      )}
      <Animated.View style={[{ width: s, height: s }, bodyAnimStyle]}>
        {svgContent}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    top: -10,
    backgroundColor: "rgba(255, 248, 245, 0.95)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  bubbleText: {
    color: "#3D2C2C",
    textAlign: "center",
    fontWeight: "500",
  },
});
