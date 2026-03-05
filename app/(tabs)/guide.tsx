import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useStoneStore } from "../../stores/stoneStore";
import { useCanvasStore } from "../../stores/canvasStore";
import type { IntentionId } from "../../types";
import templates from "../../data/templates.json";

const INTENTIONS: IntentionId[] = [
  "love",
  "prosperity",
  "healing",
  "protection",
  "spiritual",
  "calm",
  "career",
  "courage",
];

export default function GuideScreen() {
  const { t } = useTranslation();
  const stones = useStoneStore((s) => s.stones);
  const [selectedIntention, setSelectedIntention] = useState<IntentionId | null>(null);

  const recommendedStones = selectedIntention
    ? stones.filter((s) => s.intentions.includes(selectedIntention)).slice(0, 5)
    : [];

  const canvas = useCanvasStore();
  const centerStone = recommendedStones[0];
  const supportStones = recommendedStones.slice(1);

  const handlePlaceForMe = () => {
    if (!recommendedStones.length) return;
    // Pick a template that fits the stone count
    const stoneCount = recommendedStones.length;
    const bestTemplate =
      templates.find((t) => t.point_count === stoneCount && t.required_tier === "free") ||
      templates.find((t) => t.point_count <= stoneCount && t.point_count > 0 && t.required_tier === "free") ||
      templates[0];

    canvas.clearCanvas();
    canvas.setTemplate(bestTemplate.id);
    canvas.setIntention(selectedIntention);
    canvas.setGridName(`${selectedIntention} Grid`);

    // Place stones on template points
    const points = bestTemplate.points;
    recommendedStones.forEach((stone, i) => {
      if (i < points.length) {
        canvas.addPlacement({
          stoneId: stone.id,
          x: points[i].x,
          y: points[i].y,
          rotation: 0,
        });
      }
    });

    router.navigate("/(tabs)/garden");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>{t("guide.title")}</Text>
      <Text style={styles.subtitle}>{t("guide.whatFocus")}</Text>

      {/* Intention Picker */}
      <View style={styles.intentionGrid}>
        {INTENTIONS.map((intention) => (
          <TouchableOpacity
            key={intention}
            style={[
              styles.intentionCard,
              selectedIntention === intention && styles.intentionActive,
            ]}
            onPress={() =>
              setSelectedIntention(
                selectedIntention === intention ? null : intention
              )
            }
          >
            <Text
              style={[
                styles.intentionText,
                selectedIntention === intention && styles.intentionTextActive,
              ]}
            >
              {t(`intentions.${intention}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recommendation */}
      {selectedIntention && centerStone && (
        <View style={styles.recommendation}>
          <Text style={styles.recTitle}>{t("guide.recommendation")}</Text>

          <View style={styles.centerStoneCard}>
            <View
              style={[
                styles.stoneDot,
                { backgroundColor: centerStone.color_hex },
              ]}
            />
            <Text style={styles.recLabel}>{t("guide.centerStone")}</Text>
            <Text style={styles.stoneName}>{centerStone.name_en}</Text>
            <Text style={styles.stoneNameJp}>{centerStone.name_jp}</Text>
          </View>

          <Text style={styles.recLabel}>{t("guide.supportStones")}</Text>
          <View style={styles.supportRow}>
            {supportStones.map((stone) => (
              <View key={stone.id} style={styles.supportCard}>
                <View
                  style={[
                    styles.smallDot,
                    { backgroundColor: stone.color_hex },
                  ]}
                />
                <Text style={styles.supportName}>{stone.name_en}</Text>
                <Text style={styles.supportNameJp}>{stone.name_jp}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.placeButton} onPress={handlePlaceForMe}>
            <Text style={styles.placeButtonText}>
              {t("guide.placeForMe")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Guided Sessions Preview */}
      <View style={styles.sessionsSection}>
        <Text style={styles.sectionTitle}>{t("guide.guidedSessions")}</Text>
        {["Morning Clarity", "Evening Calm", "Heart Opening", "Protection Shield"].map(
          (name) => (
            <TouchableOpacity key={name} style={styles.sessionCard}>
              <Text style={styles.sessionName}>{name}</Text>
              <Text style={styles.sessionMeta}>
                {t("guide.sessionMinutes", { minutes: 10 })}
              </Text>
            </TouchableOpacity>
          )
        )}
        <Text style={styles.comingSoon}>Full guided sessions in v1.1</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  intentionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  intentionCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  intentionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  intentionText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  intentionTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  recommendation: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  recTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  recLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  centerStoneCard: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  stoneDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: spacing.sm,
  },
  stoneName: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  stoneNameJp: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  supportRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  supportCard: {
    flex: 1,
    alignItems: "center",
  },
  smallDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: spacing.xs,
  },
  supportName: {
    color: colors.textPrimary,
    fontSize: fontSize.xs,
    fontWeight: "500",
    textAlign: "center",
  },
  supportNameJp: {
    color: colors.textMuted,
    fontSize: 9,
    textAlign: "center",
  },
  placeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  placeButtonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  sessionsSection: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sessionCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  sessionName: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
  sessionMeta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  comingSoon: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: spacing.sm,
  },
});
