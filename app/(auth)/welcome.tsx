import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { GemStone } from "../../components/common/GemStone";

// Sample grid arrangement for the hero visual
const HERO_STONES = [
  { id: "rose_quartz", color: "#F7CAC9", x: 0.5, y: 0.28 },
  { id: "amethyst", color: "#9B59B6", x: 0.28, y: 0.5 },
  { id: "clear_quartz", color: "#E8E4E0", x: 0.72, y: 0.5 },
  { id: "moonstone", color: "#C5D0E6", x: 0.36, y: 0.72 },
  { id: "citrine", color: "#F0C75E", x: 0.64, y: 0.72 },
  { id: "jade_jadeite", color: "#5B8C5A", x: 0.5, y: 0.5 },
];

export default function WelcomeScreen() {
  const { i18n } = useTranslation();
  const isJp = i18n.language === "jp";

  const toggleLanguage = () => {
    i18n.changeLanguage(isJp ? "en" : "jp");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.langToggle} onPress={toggleLanguage}>
        <Text style={styles.langText}>{isJp ? "EN" : "JP"}</Text>
      </TouchableOpacity>

      {/* Hero crystal grid visual */}
      <View style={styles.gridVisual}>
        {HERO_STONES.map((stone) => (
          <View
            key={stone.id}
            style={{
              position: "absolute",
              left: `${stone.x * 100}%`,
              top: `${stone.y * 100}%`,
              marginLeft: -18,
              marginTop: -18,
            }}
          >
            <GemStone stoneId={stone.id} colorHex={stone.color} size={36} />
          </View>
        ))}
        {/* Connection lines via thin views */}
        {[0, 1, 2, 3, 4].map((i) => {
          const from = HERO_STONES[i];
          const to = HERO_STONES[5]; // center jade
          return (
            <View
              key={`line-${i}`}
              style={{
                position: "absolute",
                left: `${Math.min(from.x, to.x) * 100}%`,
                top: `${Math.min(from.y, to.y) * 100}%`,
                width: 1,
                height: 1,
                borderWidth: 0.5,
                borderColor: colors.primary + "30",
              }}
            />
          );
        })}
      </View>

      {/* Title */}
      <Text style={styles.title}>
        {isJp ? "石の庭" : "Ishi no Niwa"}
      </Text>
      <Text style={styles.subtitle}>
        {isJp ? "石の庭 — Stone Garden" : "Stone Garden"}
      </Text>
      <Text style={styles.tagline}>
        {isJp
          ? "聖なる石を並べて、あなたのパターンを見つけましょう"
          : "Arrange sacred stones. Discover your pattern. Find your balance."}
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              {isJp ? "アカウントを作成" : "Create Account"}
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              {isJp ? "ログイン" : "Sign In"}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  langToggle: {
    position: "absolute",
    top: 56,
    right: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "700",
    letterSpacing: 1,
  },
  gridVisual: {
    width: 200,
    height: 200,
    position: "relative",
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 2,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  tagline: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  actions: {
    marginTop: spacing.xxl,
    width: "100%",
    maxWidth: 300,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.buttonText,
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
});
