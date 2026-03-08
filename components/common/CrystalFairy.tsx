import { View, Text, StyleSheet } from "react-native";

/**
 * Crystal Fairy avatar — a small fairy whose wings & dress
 * color matches the user's avatar stone.
 */
interface CrystalFairyProps {
  colorHex: string;
  size?: number;
}

export function CrystalFairy({ colorHex, size = 64 }: CrystalFairyProps) {
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
  const sparkleSize = Math.max(4, s * 0.06);

  return (
    <View style={[styles.container, { width: s, height: s }]}>
      {/* Glow halo behind fairy */}
      <View
        style={{
          position: "absolute",
          width: s * 0.7,
          height: s * 0.7,
          borderRadius: s * 0.35,
          backgroundColor: colorHex + "20",
          top: s * 0.15,
          alignSelf: "center",
        }}
      />
      {/* Left wing */}
      <View
        style={[
          styles.wing,
          {
            width: wingW,
            height: wingH,
            backgroundColor: wingColor,
            borderColor: wingHighlight,
            top: s * 0.15,
            left: s * 0.02,
            borderRadius: wingW * 0.6,
            transform: [{ rotate: "-18deg" }],
          },
        ]}
      />
      {/* Right wing */}
      <View
        style={[
          styles.wing,
          {
            width: wingW,
            height: wingH,
            backgroundColor: wingColor,
            borderColor: wingHighlight,
            top: s * 0.15,
            right: s * 0.02,
            borderRadius: wingW * 0.6,
            transform: [{ rotate: "18deg" }],
          },
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
          <View style={{ width: headSize * 0.12, height: headSize * 0.12, borderRadius: headSize * 0.06, backgroundColor: "#4A3728" }} />
          <View style={{ width: headSize * 0.12, height: headSize * 0.12, borderRadius: headSize * 0.06, backgroundColor: "#4A3728" }} />
        </View>
        {/* Mouth */}
        <View style={{ alignItems: "center", marginTop: headSize * 0.06 }}>
          <View style={{ width: headSize * 0.2, height: headSize * 0.08, borderBottomLeftRadius: headSize * 0.1, borderBottomRightRadius: headSize * 0.1, backgroundColor: "#D4726A" }} />
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
      {/* Crown / tiara */}
      <Text style={{ position: "absolute", top: 0, alignSelf: "center", fontSize: s * 0.15, zIndex: 5 }}>
        {"\u2727"}
      </Text>
      {/* Sparkle dots */}
      <View
        style={[
          styles.sparkle,
          { width: sparkleSize, height: sparkleSize, borderRadius: sparkleSize / 2, top: s * 0.02, left: s * 0.15, backgroundColor: dressColor },
        ]}
      />
      <View
        style={[
          styles.sparkle,
          { width: sparkleSize, height: sparkleSize, borderRadius: sparkleSize / 2, top: s * 0.1, right: s * 0.1, backgroundColor: dressColor },
        ]}
      />
      <View
        style={[
          styles.sparkle,
          { width: sparkleSize, height: sparkleSize, borderRadius: sparkleSize / 2, bottom: s * 0.08, left: s * 0.08, backgroundColor: wingColor },
        ]}
      />
      <View
        style={[
          styles.sparkle,
          { width: sparkleSize, height: sparkleSize, borderRadius: sparkleSize / 2, bottom: s * 0.15, right: s * 0.12, backgroundColor: dressColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
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
    borderWidth: 1.5,
    opacity: 0.9,
  },
  sparkle: {
    position: "absolute",
    opacity: 0.75,
    zIndex: 4,
  },
});
