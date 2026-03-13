import { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import type { EvolutionStage, CrystalStage, FairyColor } from "../../stores/fairyStore";
import { FAIRY_COLORS } from "../../stores/fairyStore";
import { getFairySprite } from "../../data/fairySprites";

/**
 * Crystal Fairy avatar — hi-res PNG sprite approach.
 *
 * Renders pre-made artwork (Takae's watercolor style) as Image sprites
 * with Reanimated floating/bounce/tilt animations and speech bubbles.
 *
 * When no sprite is available for a given state, renders a tinted
 * placeholder glyph so the app never breaks.
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

/** Resolve FairyColor key from hex, for sprite lookup */
function colorFromHex(hex: string): FairyColor {
  for (const [key, val] of Object.entries(FAIRY_COLORS)) {
    if (val.hex === hex) return key as FairyColor;
  }
  return "amethyst";
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
  const activeMood: FairyMood = isSleeping ? "sleeping" : mood;

  // ── Animations (kept from original — these work great with Image) ──

  const floatY = useSharedValue(0);
  const bodyScale = useSharedValue(1);
  const tilt = useSharedValue(0);
  const bubbleOpacity = useSharedValue(0);
  const bubbleTranslateY = useSharedValue(0);

  // Floating bob
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

  // Mood reactions
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
    } else if (activeMood === "thinking") {
      tilt.value = withSequence(
        withTiming(-8, { duration: 400, easing: Easing.out(Easing.quad) }),
        withDelay(800, withTiming(0, { duration: 400 })),
      );
    }
  }, [activeMood, isStatic, isSleeping]);

  // Speech bubble
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

  const bubbleAnimStyle = useAnimatedStyle(() => ({
    opacity: bubbleOpacity.value,
    transform: [{ translateY: bubbleTranslateY.value }],
  }));

  // ── Sprite resolution ──

  const colorKey = colorFromHex(colorHex);
  const sprite = getFairySprite(colorKey, evolutionStage, activeMood);

  // ── Render ──

  return (
    <View style={{ width: s, height: s + (message ? s * 0.5 : 0), alignItems: "center" }}>
      {message && (
        <Animated.View style={[styles.bubble, { maxWidth: s * 3, minWidth: s * 1.2 }, bubbleAnimStyle]}>
          <Text style={[styles.bubbleText, { fontSize: Math.max(9, s * 0.14) }]} numberOfLines={2}>
            {message}
          </Text>
        </Animated.View>
      )}
      <Animated.View style={[{ width: s, height: s }, bodyAnimStyle]}>
        {sprite ? (
          <Image
            source={sprite}
            style={{ width: s, height: s }}
            resizeMode="contain"
          />
        ) : (
          <FairyPlaceholder
            size={s}
            colorHex={colorHex}
            evolutionStage={evolutionStage}
            mood={activeMood}
          />
        )}
      </Animated.View>
    </View>
  );
}

/**
 * Placeholder fairy shown until real sprites are added.
 * Uses the evolution glyph + color tint so it's clear what stage/color is active.
 * This is intentionally minimal — just enough to not break layouts.
 */
function FairyPlaceholder({
  size,
  colorHex,
  evolutionStage,
  mood,
}: {
  size: number;
  colorHex: string;
  evolutionStage: EvolutionStage;
  mood: FairyMood;
}) {
  const glyphs: Record<EvolutionStage, string> = {
    1: "\u2727",        // ✧ seed
    2: "\uD83C\uDF31",  // 🌱 bud
    3: "\uD83C\uDF3A",  // 🌺 bloom
    4: "\uD83D\uDC8E",  // 💎 crystal
    5: "\uD83C\uDF1F",  // 🌟 guardian
  };

  const moodOverlay: Record<FairyMood, string> = {
    idle: "",
    happy: "\u2728",     // ✨
    excited: "\uD83C\uDF1F", // 🌟
    thinking: "\uD83D\uDCAD", // 💭
    sleeping: "\uD83D\uDCA4", // 💤
  };

  return (
    <View style={[styles.placeholder, { width: size, height: size }]}>
      <View style={[styles.placeholderCircle, {
        width: size * 0.7,
        height: size * 0.7,
        borderRadius: size * 0.35,
        backgroundColor: colorHex + "25",
        borderColor: colorHex + "40",
      }]}>
        <Text style={{ fontSize: size * 0.3, textAlign: "center" }}>
          {glyphs[evolutionStage]}
        </Text>
        {moodOverlay[mood] ? (
          <Text style={{ fontSize: size * 0.12, position: "absolute", top: 2, right: 2 }}>
            {moodOverlay[mood]}
          </Text>
        ) : null}
      </View>
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
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderCircle: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
});
