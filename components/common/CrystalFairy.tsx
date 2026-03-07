import { View, StyleSheet } from "react-native";

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
  const headSize = s * 0.28;
  const bodyW = s * 0.3;
  const bodyH = s * 0.35;
  const wingW = s * 0.32;
  const wingH = s * 0.45;
  const wingColor = colorHex + "88";
  const wingHighlight = colorHex + "44";
  const dressColor = colorHex;
  const skinColor = "#FAE8D4";

  return (
    <View style={[styles.container, { width: s, height: s }]}>
      {/* Left wing */}
      <View
        style={[
          styles.wing,
          styles.wingLeft,
          {
            width: wingW,
            height: wingH,
            backgroundColor: wingColor,
            borderColor: wingHighlight,
            top: s * 0.18,
            left: s * 0.04,
            borderRadius: wingW * 0.6,
            transform: [{ rotate: "-15deg" }],
          },
        ]}
      />
      {/* Right wing */}
      <View
        style={[
          styles.wing,
          styles.wingRight,
          {
            width: wingW,
            height: wingH,
            backgroundColor: wingColor,
            borderColor: wingHighlight,
            top: s * 0.18,
            right: s * 0.04,
            borderRadius: wingW * 0.6,
            transform: [{ rotate: "15deg" }],
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
            top: s * 0.08,
          },
        ]}
      />
      {/* Body / dress */}
      <View
        style={[
          styles.body,
          {
            width: bodyW,
            height: bodyH,
            backgroundColor: dressColor,
            top: s * 0.08 + headSize - 2,
            borderTopLeftRadius: bodyW * 0.3,
            borderTopRightRadius: bodyW * 0.3,
            borderBottomLeftRadius: bodyW * 0.6,
            borderBottomRightRadius: bodyW * 0.6,
          },
        ]}
      />
      {/* Sparkle dots */}
      <View
        style={[
          styles.sparkle,
          { top: s * 0.05, left: s * 0.2, backgroundColor: dressColor },
        ]}
      />
      <View
        style={[
          styles.sparkle,
          { top: s * 0.12, right: s * 0.15, backgroundColor: dressColor },
        ]}
      />
      <View
        style={[
          styles.sparkle,
          { bottom: s * 0.1, left: s * 0.12, backgroundColor: wingColor },
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
    borderColor: "rgba(0,0,0,0.08)",
  },
  body: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  wing: {
    position: "absolute",
    zIndex: 1,
    borderWidth: 1,
    opacity: 0.85,
  },
  wingLeft: {},
  wingRight: {},
  sparkle: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
    zIndex: 4,
  },
});
