import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
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

/**
 * Crystal Fairy avatar — evolves through 5 stages based on player level.
 * Holds a crystal that upgrades from rough chip → radiant crystal as
 * the player completes more grids.
 *
 * Evolution stages:
 *   1 — Seed Sprite: tiny glowing orb with faint wing outlines
 *   2 — Bud Fairy: small chibi, simple wings, tiny rough crystal
 *   3 — Bloom Fairy: mini mascot, petal wings, polished crystal
 *   4 — Crystal Fairy: full fairy, ornate wings, faceted crystal, sparkles
 *   5 — Guardian Spirit: detailed fairy, large wings, radiant crystal, aura
 */

export type FairyMood = "idle" | "happy" | "excited" | "thinking" | "sleeping";

/** Crystal glyph and size multiplier per crystal stage */
const CRYSTAL_VISUALS: Record<CrystalStage, { glyph: string; sizeMul: number; glow: boolean }> = {
  1: { glyph: "\u25C6", sizeMul: 0.10, glow: false },     // small diamond
  2: { glyph: "\u25C8", sizeMul: 0.12, glow: false },     // diamond in box
  3: { glyph: "\u2666", sizeMul: 0.14, glow: false },     // diamond suit
  4: { glyph: "\u{1F48E}", sizeMul: 0.16, glow: true },   // gem emoji
  5: { glyph: "\u{1F48E}", sizeMul: 0.20, glow: true },   // gem emoji large
};

interface CrystalFairyProps {
  colorHex: string;
  size?: number;
  mood?: FairyMood;
  level?: number;
  message?: string | null;
  isStatic?: boolean;
  evolutionStage?: EvolutionStage;
  crystalStage?: CrystalStage;
  /** Whether fairy is sleeping (away for too long) */
  isSleeping?: boolean;
}

export function CrystalFairy({
  colorHex,
  size = 64,
  mood = "idle",
  level = 1,
  message = null,
  isStatic = false,
  evolutionStage = 1,
  crystalStage = 1,
  isSleeping = false,
}: CrystalFairyProps) {
  const s = size;
  const activeMood = isSleeping ? "sleeping" : mood;

  // Scale body parts by evolution stage
  const evoScale = 0.6 + (evolutionStage - 1) * 0.1; // 0.6 → 1.0
  const headSize = s * 0.3 * evoScale;
  const bodyW = s * 0.35 * evoScale;
  const bodyH = s * 0.38 * evoScale;
  const wingW = s * 0.35 * (0.7 + (evolutionStage - 1) * 0.15);
  const wingH = s * 0.48 * (0.7 + (evolutionStage - 1) * 0.15);
  const wingColor = colorHex + "CC";
  const wingHighlight = colorHex + "66";
  const dressColor = colorHex;
  const skinColor = "#FAE8D4";
  const sparkleSize = Math.max(4, s * 0.07);

  // Evolution visuals
  const hasFlowerCrown = evolutionStage >= 3;
  const hasSilverWings = evolutionStage >= 4;
  const hasGoldAura = evolutionStage >= 5;
  const hasRainbow = evolutionStage >= 5 && level >= 20;
  const hasSparkleTrail = evolutionStage >= 4;
  const numSparkles = Math.min(evolutionStage + 1, 6);

  const wingBorderColor = hasGoldAura
    ? "#FFD700"
    : hasSilverWings
    ? "#C0C0C0"
    : wingHighlight;

  // Crystal held by fairy
  const crystalVis = CRYSTAL_VISUALS[crystalStage];
  const crystalSize = s * crystalVis.sizeMul;

  // --- Animations ---
  const floatY = useSharedValue(0);
  const bodyScale = useSharedValue(1);
  const wingLeftAngle = useSharedValue(-18);
  const wingRightAngle = useSharedValue(18);
  const tilt = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const bubbleOpacity = useSharedValue(0);
  const bubbleTranslateY = useSharedValue(0);

  useEffect(() => {
    if (isStatic) return;
    if (isSleeping) {
      // Gentle slow breathing
      floatY.value = withRepeat(
        withSequence(
          withTiming(-s * 0.02, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      return;
    }
    // Float speed varies by evolution (higher = more graceful, slower)
    const floatDuration = 1200 + evolutionStage * 200;
    floatY.value = withRepeat(
      withSequence(
        withTiming(-s * 0.06, { duration: floatDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: floatDuration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    const flapDuration = 600 + evolutionStage * 100;
    wingLeftAngle.value = withRepeat(
      withSequence(
        withTiming(-22, { duration: flapDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-14, { duration: flapDuration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    wingRightAngle.value = withRepeat(
      withSequence(
        withTiming(22, { duration: flapDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(14, { duration: flapDuration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [isStatic, isSleeping, evolutionStage]);

  useEffect(() => {
    if (isStatic || isSleeping) return;
    if (activeMood === "happy") {
      bodyScale.value = withSequence(
        withTiming(1.15, { duration: 150 }),
        withTiming(0.95, { duration: 100 }),
        withTiming(1.1, { duration: 120 }),
        withTiming(1, { duration: 150 })
      );
    } else if (activeMood === "excited") {
      bodyScale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withTiming(0.9, { duration: 80 }),
        withTiming(1.2, { duration: 100 }),
        withTiming(0.9, { duration: 80 }),
        withTiming(1.15, { duration: 100 }),
        withTiming(1, { duration: 150 })
      );
      tilt.value = withSequence(
        withTiming(-8, { duration: 100 }),
        withTiming(8, { duration: 100 }),
        withTiming(-6, { duration: 100 }),
        withTiming(6, { duration: 100 }),
        withTiming(0, { duration: 150 })
      );
      glowScale.value = withSequence(
        withTiming(1.5, { duration: 300 }),
        withTiming(1, { duration: 500 })
      );
    } else if (activeMood === "thinking") {
      tilt.value = withSequence(
        withTiming(-10, { duration: 400, easing: Easing.out(Easing.quad) }),
        withDelay(800, withTiming(0, { duration: 400 }))
      );
    }
  }, [activeMood, isStatic, isSleeping]);

  useEffect(() => {
    if (message && !isStatic) {
      bubbleOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(2800, withTiming(0, { duration: 400 }))
      );
      bubbleTranslateY.value = withSequence(
        withTiming(-4, { duration: 200 }),
        withDelay(2800, withTiming(0, { duration: 400 }))
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

  const leftWingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wingLeftAngle.value}deg` }],
  }));

  const rightWingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wingRightAngle.value}deg` }],
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const bubbleAnimStyle = useAnimatedStyle(() => ({
    opacity: bubbleOpacity.value,
    transform: [{ translateY: bubbleTranslateY.value }],
  }));

  const eyeHeight = activeMood === "sleeping" ? headSize * 0.04 : headSize * 0.12;
  const eyeRadius = activeMood === "sleeping" ? headSize * 0.02 : headSize * 0.06;
  const mouthWidth = activeMood === "happy" || activeMood === "excited" ? headSize * 0.25 : headSize * 0.18;
  const mouthHeight = activeMood === "happy" || activeMood === "excited" ? headSize * 0.12 : headSize * 0.07;

  // Stage 1 (Seed Sprite) — simplified orb rendering
  if (evolutionStage === 1) {
    return (
      <View style={{ width: s, height: s + (message ? s * 0.5 : 0), alignItems: "center" }}>
        {message && (
          <Animated.View
            style={[
              {
                position: "absolute", top: -s * 0.1,
                backgroundColor: "rgba(240, 235, 227, 0.95)",
                borderRadius: s * 0.12, paddingHorizontal: s * 0.15, paddingVertical: s * 0.08,
                maxWidth: s * 3, minWidth: s * 1.2, zIndex: 10, alignItems: "center",
                borderWidth: 1, borderColor: "rgba(0,0,0,0.08)",
              },
              bubbleAnimStyle,
            ]}
          >
            <Text style={{ color: "#2C1810", fontSize: Math.max(9, s * 0.14), textAlign: "center", fontWeight: "500" }} numberOfLines={2}>
              {message}
            </Text>
          </Animated.View>
        )}
        <Animated.View style={[{ width: s, height: s, alignItems: "center", justifyContent: "center" }, bodyAnimStyle]}>
          {/* Glowing orb */}
          <View style={{
            width: s * 0.4, height: s * 0.4, borderRadius: s * 0.2,
            backgroundColor: colorHex + "60",
            borderWidth: 2, borderColor: colorHex + "40",
            alignItems: "center", justifyContent: "center",
          }}>
            <View style={{
              width: s * 0.2, height: s * 0.2, borderRadius: s * 0.1,
              backgroundColor: colorHex,
            }} />
            {/* Tiny crystal */}
            <Text style={{ position: "absolute", bottom: -s * 0.08, fontSize: crystalSize }}>
              {crystalVis.glyph}
            </Text>
          </View>
          {/* Faint wing outlines */}
          <View style={{
            position: "absolute", width: s * 0.22, height: s * 0.28,
            borderRadius: s * 0.12, borderWidth: 1, borderColor: colorHex + "40",
            left: s * 0.1, top: s * 0.25,
          }} />
          <View style={{
            position: "absolute", width: s * 0.22, height: s * 0.28,
            borderRadius: s * 0.12, borderWidth: 1, borderColor: colorHex + "40",
            right: s * 0.1, top: s * 0.25,
          }} />
          {/* Sparkles */}
          <View style={[styles.sparkle, { width: sparkleSize, height: sparkleSize, borderRadius: sparkleSize / 2, top: s * 0.15, left: s * 0.2, backgroundColor: colorHex }]} />
          <View style={[styles.sparkle, { width: sparkleSize, height: sparkleSize, borderRadius: sparkleSize / 2, bottom: s * 0.2, right: s * 0.2, backgroundColor: colorHex }]} />
        </Animated.View>
      </View>
    );
  }

  // Stages 2-5 — full fairy rendering
  return (
    <View style={{ width: s, height: s + (message ? s * 0.5 : 0), alignItems: "center" }}>
      {message && (
        <Animated.View
          style={[
            {
              position: "absolute", top: -s * 0.1,
              backgroundColor: "rgba(240, 235, 227, 0.95)",
              borderRadius: s * 0.12, paddingHorizontal: s * 0.15, paddingVertical: s * 0.08,
              maxWidth: s * 3, minWidth: s * 1.2, zIndex: 10, alignItems: "center",
              borderWidth: 1, borderColor: "rgba(0,0,0,0.08)",
            },
            bubbleAnimStyle,
          ]}
        >
          <Text style={{ color: "#2C1810", fontSize: Math.max(9, s * 0.14), textAlign: "center", fontWeight: "500" }} numberOfLines={2}>
            {message}
          </Text>
        </Animated.View>
      )}

      <Animated.View style={[{ width: s, height: s, position: "relative", alignItems: "center" }, bodyAnimStyle]}>
        {/* Glow halo */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: s * 0.75, height: s * 0.75,
              borderRadius: s * 0.375,
              backgroundColor: hasGoldAura ? "#FFD70030" : colorHex + "20",
              top: s * 0.12, alignSelf: "center",
            },
            glowAnimStyle,
          ]}
        />

        {/* Gold outer aura (stage 5) */}
        {hasGoldAura && (
          <View style={{
            position: "absolute", width: s * 0.9, height: s * 0.9,
            borderRadius: s * 0.45, borderWidth: 1.5, borderColor: "#FFD70050",
            top: s * 0.05, alignSelf: "center",
          }} />
        )}

        {/* Left wing */}
        <Animated.View
          style={[
            styles.wing,
            {
              width: wingW, height: wingH,
              backgroundColor: wingColor, borderColor: wingBorderColor,
              top: s * 0.15, left: s * 0.02,
              borderRadius: wingW * 0.6,
              borderWidth: hasSilverWings ? 2 : 1.5,
            },
            leftWingStyle,
          ]}
        />
        {/* Right wing */}
        <Animated.View
          style={[
            styles.wing,
            {
              width: wingW, height: wingH,
              backgroundColor: wingColor, borderColor: wingBorderColor,
              top: s * 0.15, right: s * 0.02,
              borderRadius: wingW * 0.6,
              borderWidth: hasSilverWings ? 2 : 1.5,
            },
            rightWingStyle,
          ]}
        />

        {/* Head */}
        <View
          style={[
            styles.head,
            {
              width: headSize, height: headSize,
              borderRadius: headSize / 2,
              backgroundColor: isSleeping ? "#EAD8CA" : skinColor,
              top: s * 0.06,
            },
          ]}
        >
          <View style={{ flexDirection: "row", justifyContent: "center", gap: headSize * 0.22, marginTop: headSize * 0.35 }}>
            <View style={{ width: headSize * 0.12, height: eyeHeight, borderRadius: eyeRadius, backgroundColor: "#4A3728" }} />
            <View style={{ width: headSize * 0.12, height: eyeHeight, borderRadius: eyeRadius, backgroundColor: "#4A3728" }} />
          </View>
          {(activeMood === "happy" || activeMood === "excited") && (
            <View style={{ flexDirection: "row", justifyContent: "center", gap: headSize * 0.35, marginTop: -headSize * 0.02 }}>
              <View style={{ width: headSize * 0.14, height: headSize * 0.08, borderRadius: headSize * 0.04, backgroundColor: "#FFB6C1", opacity: 0.6 }} />
              <View style={{ width: headSize * 0.14, height: headSize * 0.08, borderRadius: headSize * 0.04, backgroundColor: "#FFB6C1", opacity: 0.6 }} />
            </View>
          )}
          <View style={{ alignItems: "center", marginTop: activeMood === "happy" || activeMood === "excited" ? headSize * 0.01 : headSize * 0.06 }}>
            <View
              style={{
                width: mouthWidth, height: mouthHeight,
                borderBottomLeftRadius: headSize * 0.12,
                borderBottomRightRadius: headSize * 0.12,
                borderTopLeftRadius: activeMood === "happy" || activeMood === "excited" ? headSize * 0.02 : headSize * 0.1,
                borderTopRightRadius: activeMood === "happy" || activeMood === "excited" ? headSize * 0.02 : headSize * 0.1,
                backgroundColor: activeMood === "happy" || activeMood === "excited" ? "#D4726A" : "#C9877A",
              }}
            />
          </View>
        </View>

        {/* Body / dress */}
        <View
          style={[
            styles.body,
            {
              width: bodyW, height: bodyH,
              backgroundColor: dressColor,
              top: s * 0.06 + headSize - 2,
              borderTopLeftRadius: bodyW * 0.3,
              borderTopRightRadius: bodyW * 0.3,
              borderBottomLeftRadius: bodyW * 0.6,
              borderBottomRightRadius: bodyW * 0.6,
            },
          ]}
        />

        {/* Crystal held by fairy — positioned at body center-bottom */}
        <View style={{
          position: "absolute",
          alignSelf: "center",
          top: s * 0.06 + headSize + bodyH * 0.3,
          zIndex: 5,
        }}>
          <Text style={{
            fontSize: crystalSize,
            textShadowColor: crystalVis.glow ? colorHex + "80" : "transparent",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: crystalVis.glow ? 6 : 0,
          }}>
            {crystalVis.glyph}
          </Text>
        </View>

        {/* Crown / evolution headpiece */}
        <Text style={{ position: "absolute", top: -s * 0.02, alignSelf: "center", fontSize: s * 0.16, zIndex: 5 }}>
          {hasRainbow ? "\u{1F31F}" : hasGoldAura ? "\u{1F451}" : hasFlowerCrown ? "\u{1F33A}" : evolutionStage >= 2 ? "\u{1F331}" : "\u2727"}
        </Text>

        {/* Sparkle dots — more sparkles at higher evolution */}
        {Array.from({ length: numSparkles }).map((_, i) => {
          const angle = (i / numSparkles) * Math.PI * 2;
          const radius = s * 0.38;
          const sx = s * 0.5 + Math.cos(angle) * radius - sparkleSize / 2;
          const sy = s * 0.4 + Math.sin(angle) * radius - sparkleSize / 2;
          const sparkleColor = hasRainbow
            ? ["#FF6B6B", "#4ECDC4", "#FFE66D", "#9B59B6", "#3498DB", "#E74C3C"][i % 6]
            : dressColor;
          return (
            <View
              key={i}
              style={[styles.sparkle, {
                width: sparkleSize * (hasSparkleTrail ? 1.2 : 1),
                height: sparkleSize * (hasSparkleTrail ? 1.2 : 1),
                borderRadius: sparkleSize * 0.6,
                left: sx, top: sy,
                backgroundColor: sparkleColor,
              }]}
            />
          );
        })}

        {/* Sleeping Zzz */}
        {isSleeping && (
          <Text style={{
            position: "absolute", top: -s * 0.05, right: s * 0.05,
            fontSize: s * 0.14, color: colorHex + "80", zIndex: 10,
          }}>
            zzz
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  body: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },
  wing: {
    position: "absolute",
    zIndex: 1,
    opacity: 0.9,
  },
  sparkle: {
    position: "absolute",
    opacity: 0.75,
    zIndex: 4,
  },
});
