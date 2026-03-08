import { useEffect, useCallback } from "react";
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

/**
 * Crystal Fairy avatar — an animated fairy companion whose wings & dress
 * color matches the user's avatar stone. Lives on the canvas and reacts
 * to the user's grid-building actions.
 *
 * Moods: idle (gentle float), happy (bounce), excited (dance + sparkle),
 *        thinking (tilt), sleeping (still, eyes closed)
 *
 * Evolves: level 1-4 plain, 5-9 flower crown, 10-14 silver wings,
 *          15-19 gold wings + aura, 20 rainbow sparkles
 */

export type FairyMood = "idle" | "happy" | "excited" | "thinking" | "sleeping";

interface CrystalFairyProps {
  colorHex: string;
  size?: number;
  mood?: FairyMood;
  level?: number;
  message?: string | null;
  /** If true, render as static (no animation) for profile/header */
  isStatic?: boolean;
}

export function CrystalFairy({
  colorHex,
  size = 64,
  mood = "idle",
  level = 1,
  message = null,
  isStatic = false,
}: CrystalFairyProps) {
  const s = size;
  const headSize = s * 0.3;
  const bodyW = s * 0.35;
  const bodyH = s * 0.38;
  const wingW = s * 0.35;
  const wingH = s * 0.48;
  const wingColor = colorHex + "CC";
  const wingHighlight = colorHex + "66";
  const dressColor = colorHex;
  const skinColor = "#FAE8D4";
  const sparkleSize = Math.max(4, s * 0.07);

  // Evolution accessories
  const hasFlowerCrown = level >= 5;
  const hasSilverWings = level >= 10;
  const hasGoldAura = level >= 15;
  const hasRainbow = level >= 20;

  // Wing border based on evolution
  const wingBorderColor = hasGoldAura
    ? "#FFD700"
    : hasSilverWings
    ? "#C0C0C0"
    : wingHighlight;

  // --- Animations ---
  const floatY = useSharedValue(0);
  const bodyScale = useSharedValue(1);
  const wingLeftAngle = useSharedValue(-18);
  const wingRightAngle = useSharedValue(18);
  const tilt = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const bubbleOpacity = useSharedValue(0);
  const bubbleTranslateY = useSharedValue(0);

  // Idle floating animation
  useEffect(() => {
    if (isStatic) return;
    floatY.value = withRepeat(
      withSequence(
        withTiming(-s * 0.06, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    // Wing flap
    wingLeftAngle.value = withRepeat(
      withSequence(
        withTiming(-22, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(-14, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    wingRightAngle.value = withRepeat(
      withSequence(
        withTiming(22, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(14, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [isStatic]);

  // Mood reactions
  useEffect(() => {
    if (isStatic) return;

    if (mood === "happy") {
      // Bounce
      bodyScale.value = withSequence(
        withTiming(1.15, { duration: 150 }),
        withTiming(0.95, { duration: 100 }),
        withTiming(1.1, { duration: 120 }),
        withTiming(1, { duration: 150 })
      );
    } else if (mood === "excited") {
      // Dance: rapid bounce + tilt
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
    } else if (mood === "thinking") {
      tilt.value = withSequence(
        withTiming(-10, { duration: 400, easing: Easing.out(Easing.quad) }),
        withDelay(800, withTiming(0, { duration: 400 }))
      );
    }
  }, [mood, isStatic]);

  // Speech bubble animation
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

  // Eyes change based on mood
  const eyeHeight = mood === "sleeping" ? headSize * 0.04 : headSize * 0.12;
  const eyeRadius = mood === "sleeping" ? headSize * 0.02 : headSize * 0.06;
  const mouthWidth = mood === "happy" || mood === "excited" ? headSize * 0.25 : headSize * 0.18;
  const mouthHeight = mood === "happy" || mood === "excited" ? headSize * 0.12 : headSize * 0.07;

  return (
    <View style={{ width: s, height: s + (message ? s * 0.5 : 0), alignItems: "center" }}>
      {/* Speech bubble */}
      {message && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: -s * 0.1,
              backgroundColor: "rgba(240, 235, 227, 0.95)",
              borderRadius: s * 0.12,
              paddingHorizontal: s * 0.15,
              paddingVertical: s * 0.08,
              maxWidth: s * 3,
              minWidth: s * 1.2,
              zIndex: 10,
              alignItems: "center",
              // Small triangle pointer
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.08)",
            },
            bubbleAnimStyle,
          ]}
        >
          <Text
            style={{
              color: "#2C1810",
              fontSize: Math.max(9, s * 0.14),
              textAlign: "center",
              fontWeight: "500",
            }}
            numberOfLines={2}
          >
            {message}
          </Text>
        </Animated.View>
      )}

      <Animated.View style={[{ width: s, height: s, position: "relative", alignItems: "center" }, bodyAnimStyle]}>
        {/* Glow halo — pulses when excited */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: s * 0.75,
              height: s * 0.75,
              borderRadius: s * 0.375,
              backgroundColor: hasGoldAura ? "#FFD70030" : colorHex + "20",
              top: s * 0.12,
              alignSelf: "center",
            },
            glowAnimStyle,
          ]}
        />

        {/* Gold outer aura (level 15+) */}
        {hasGoldAura && (
          <View
            style={{
              position: "absolute",
              width: s * 0.9,
              height: s * 0.9,
              borderRadius: s * 0.45,
              borderWidth: 1.5,
              borderColor: "#FFD70050",
              top: s * 0.05,
              alignSelf: "center",
            }}
          />
        )}

        {/* Left wing */}
        <Animated.View
          style={[
            styles.wing,
            {
              width: wingW,
              height: wingH,
              backgroundColor: wingColor,
              borderColor: wingBorderColor,
              top: s * 0.15,
              left: s * 0.02,
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
              width: wingW,
              height: wingH,
              backgroundColor: wingColor,
              borderColor: wingBorderColor,
              top: s * 0.15,
              right: s * 0.02,
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
              width: headSize,
              height: headSize,
              borderRadius: headSize / 2,
              backgroundColor: skinColor,
              top: s * 0.06,
            },
          ]}
        >
          {/* Eyes */}
          <View style={{ flexDirection: "row", justifyContent: "center", gap: headSize * 0.22, marginTop: headSize * 0.35 }}>
            <View style={{ width: headSize * 0.12, height: eyeHeight, borderRadius: eyeRadius, backgroundColor: "#4A3728" }} />
            <View style={{ width: headSize * 0.12, height: eyeHeight, borderRadius: eyeRadius, backgroundColor: "#4A3728" }} />
          </View>
          {/* Cheek blush when happy/excited */}
          {(mood === "happy" || mood === "excited") && (
            <View style={{ flexDirection: "row", justifyContent: "center", gap: headSize * 0.35, marginTop: -headSize * 0.02 }}>
              <View style={{ width: headSize * 0.14, height: headSize * 0.08, borderRadius: headSize * 0.04, backgroundColor: "#FFB6C1", opacity: 0.6 }} />
              <View style={{ width: headSize * 0.14, height: headSize * 0.08, borderRadius: headSize * 0.04, backgroundColor: "#FFB6C1", opacity: 0.6 }} />
            </View>
          )}
          {/* Mouth */}
          <View style={{ alignItems: "center", marginTop: mood === "happy" || mood === "excited" ? headSize * 0.01 : headSize * 0.06 }}>
            <View
              style={{
                width: mouthWidth,
                height: mouthHeight,
                borderBottomLeftRadius: headSize * 0.12,
                borderBottomRightRadius: headSize * 0.12,
                borderTopLeftRadius: mood === "happy" || mood === "excited" ? headSize * 0.02 : headSize * 0.1,
                borderTopRightRadius: mood === "happy" || mood === "excited" ? headSize * 0.02 : headSize * 0.1,
                backgroundColor: mood === "happy" || mood === "excited" ? "#D4726A" : "#C9877A",
              }}
            />
          </View>
        </View>

        {/* Body / dress */}
        <View
          style={[
            styles.body,
            {
              width: bodyW,
              height: bodyH,
              backgroundColor: dressColor,
              top: s * 0.06 + headSize - 2,
              borderTopLeftRadius: bodyW * 0.3,
              borderTopRightRadius: bodyW * 0.3,
              borderBottomLeftRadius: bodyW * 0.6,
              borderBottomRightRadius: bodyW * 0.6,
            },
          ]}
        />

        {/* Crown / evolution headpiece */}
        <Text style={{ position: "absolute", top: -s * 0.02, alignSelf: "center", fontSize: s * 0.16, zIndex: 5 }}>
          {hasRainbow ? "\u{1F31F}" : hasGoldAura ? "\u{1F451}" : hasFlowerCrown ? "\u{1F33A}" : "\u2727"}
        </Text>

        {/* Sparkle dots */}
        <View style={[styles.sparkle, { width: sparkleSize, height: sparkleSize, borderRadius: sparkleSize / 2, top: s * 0.02, left: s * 0.12, backgroundColor: dressColor }]} />
        <View style={[styles.sparkle, { width: sparkleSize, height: sparkleSize, borderRadius: sparkleSize / 2, top: s * 0.1, right: s * 0.08, backgroundColor: dressColor }]} />
        <View style={[styles.sparkle, { width: sparkleSize, height: sparkleSize, borderRadius: sparkleSize / 2, bottom: s * 0.06, left: s * 0.06, backgroundColor: wingColor }]} />
        <View style={[styles.sparkle, { width: sparkleSize, height: sparkleSize, borderRadius: sparkleSize / 2, bottom: s * 0.12, right: s * 0.1, backgroundColor: dressColor }]} />

        {/* Rainbow sparkles for level 20 */}
        {hasRainbow && (
          <>
            <View style={[styles.sparkle, { width: sparkleSize * 1.2, height: sparkleSize * 1.2, borderRadius: sparkleSize * 0.6, top: s * 0.18, left: s * 0.0, backgroundColor: "#FF6B6B" }]} />
            <View style={[styles.sparkle, { width: sparkleSize * 1.2, height: sparkleSize * 1.2, borderRadius: sparkleSize * 0.6, top: s * 0.05, right: s * 0.02, backgroundColor: "#4ECDC4" }]} />
            <View style={[styles.sparkle, { width: sparkleSize * 1.2, height: sparkleSize * 1.2, borderRadius: sparkleSize * 0.6, bottom: s * 0.02, left: s * 0.18, backgroundColor: "#FFE66D" }]} />
          </>
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
