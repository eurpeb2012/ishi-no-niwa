import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useStoneStore } from "../../stores/stoneStore";
import { useCanvasStore } from "../../stores/canvasStore";
import { useProgressionStore } from "../../stores/progressionStore";
import { GemStone } from "../../components/common/GemStone";
import { SponsoredAd } from "../../components/common/SponsoredAd";
import { getAdForPlacement } from "../../data/mockAds";
import { useInsightStore } from "../../stores/insightStore";
import { XP_REWARDS } from "../../types";
import type { IntentionId, GridTemplate } from "../../types";
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

const SESSION_DATA = [
  { name_en: "Morning Clarity", name_jp: "朝の明晰", minutes: 10, intention: "spiritual" },
  { name_en: "Evening Calm", name_jp: "夕べの静寂", minutes: 15, intention: "calm" },
  { name_en: "Heart Opening", name_jp: "ハートオープニング", minutes: 10, intention: "love" },
  { name_en: "Protection Shield", name_jp: "守護の盾", minutes: 12, intention: "protection" },
  { name_en: "Abundance Flow", name_jp: "豊穣の流れ", minutes: 10, intention: "prosperity" },
  { name_en: "Inner Courage", name_jp: "内なる勇気", minutes: 8, intention: "courage" },
];

// Shape preview: simple text glyph per geometry type
const SHAPE_GLYPHS: Record<string, string> = {
  triangle: "\u25B3",
  square: "\u25A1",
  circle: "\u25CB",
  diamond: "\u25C7",
  pentagon: "\u2B1F",
  cross: "\u271A",
  vesica: "\u2A38",
  hexagram: "\u2721",
  infinity: "\u221E",
  star: "\u2606",
  hexagonal: "\u2B21",
  wave: "\u223F",
  spiral: "\u0040",
  ring: "\u25CE",
  sacred: "\u2699",
  freeform: "\u2022",
};

export default function GuideScreen() {
  const { t, i18n } = useTranslation();
  const stones = useStoneStore((s) => s.stones);
  const generateInsights = useInsightStore((s) => s.generateInsights);
  const trackIntention = useInsightStore((s) => s.trackIntention);
  const topStones = useInsightStore((s) => s.getTopStones)(3);
  const [insights, setInsights] = useState<string[]>([]);
  const [selectedIntention, setSelectedIntention] =
    useState<IntentionId | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<GridTemplate | null>(null);

  useEffect(() => {
    setInsights(generateInsights());
  }, []);

  const canvas = useCanvasStore();
  const addXP = useProgressionStore((s) => s.addXP);
  const incrementSessions = useProgressionStore((s) => s.incrementSessions);

  // Filter templates that match the selected intention
  const matchingTemplates = selectedIntention
    ? (templates as GridTemplate[]).filter(
        (tmpl) =>
          tmpl.intentions.includes(selectedIntention) && tmpl.point_count > 0
      )
    : [];

  // Recommended stones for the intention
  const recommendedStones = selectedIntention
    ? stones
        .filter((s) => s.intentions.includes(selectedIntention))
        .slice(0, selectedTemplate ? selectedTemplate.point_count : 5)
    : [];

  const centerStone = recommendedStones[0];
  const supportStones = recommendedStones.slice(1);

  const handlePlaceForMe = () => {
    if (!recommendedStones.length || !selectedTemplate) return;

    canvas.clearCanvas();
    canvas.setTemplate(selectedTemplate.id);
    canvas.setIntention(selectedIntention);
    canvas.setGridName(
      `${t(`intentions.${selectedIntention}`)} - ${selectedTemplate.name_en}`
    );

    const points = selectedTemplate.points;
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

    addXP(XP_REWARDS.COMPLETE_SESSION);
    incrementSessions();
    router.navigate("/(tabs)/garden");
  };

  const handleCustomize = () => {
    if (!selectedTemplate) return;

    canvas.clearCanvas();
    canvas.setTemplate(selectedTemplate.id);
    canvas.setIntention(selectedIntention);
    canvas.setGridName(
      `${t(`intentions.${selectedIntention}`)} - ${selectedTemplate.name_en}`
    );
    // Navigate to garden with empty template — user places stones themselves
    router.navigate("/(tabs)/garden");
  };

  const handleStartSession = (session: (typeof SESSION_DATA)[0]) => {
    setSelectedIntention(session.intention as IntentionId);
    setSelectedTemplate(null);

    const msg =
      i18n.language === "jp"
        ? `${session.name_jp}セッションを開始します（${session.minutes}分）`
        : `Starting ${session.name_en} session (${session.minutes} min)`;

    if (Platform.OS === "web") {
      if (typeof window !== "undefined") window.alert(msg);
    } else {
      Alert.alert(session.name_en, msg);
    }
  };

  const sessionAd = getAdForPlacement("session_end");
  const isJp = i18n.language === "jp";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>{t("guide.title")}</Text>
      <Text style={styles.subtitle}>{t("guide.whatFocus")}</Text>

      {/* Step 1: Intention Picker */}
      <View style={styles.intentionGrid}>
        {INTENTIONS.map((intention) => (
          <TouchableOpacity
            key={intention}
            style={[
              styles.intentionCard,
              selectedIntention === intention && styles.intentionActive,
            ]}
            onPress={() => {
              const next = selectedIntention === intention ? null : intention;
              setSelectedIntention(next);
              setSelectedTemplate(null);
              if (next) trackIntention(next);
            }}
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

      {/* Step 2: Shape Picker (sub-list per intention) */}
      {selectedIntention && matchingTemplates.length > 0 && (
        <View style={styles.shapeSection}>
          <Text style={styles.sectionTitle}>{t("guide.chooseShape")}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shapeRow}
          >
            {matchingTemplates.map((tmpl) => (
              <TouchableOpacity
                key={tmpl.id}
                style={[
                  styles.shapeCard,
                  selectedTemplate?.id === tmpl.id && styles.shapeCardActive,
                ]}
                onPress={() =>
                  setSelectedTemplate(
                    selectedTemplate?.id === tmpl.id ? null : tmpl
                  )
                }
              >
                <Text style={styles.shapeGlyph}>
                  {SHAPE_GLYPHS[tmpl.geometry_type] || "\u25CF"}
                </Text>
                <Text
                  style={[
                    styles.shapeName,
                    selectedTemplate?.id === tmpl.id && styles.shapeNameActive,
                  ]}
                >
                  {isJp ? tmpl.name_jp : tmpl.name_en}
                </Text>
                <Text style={styles.shapePoints}>
                  {tmpl.point_count} pts
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Step 3: Stone Recommendation + Actions */}
      {selectedIntention && selectedTemplate && centerStone && (
        <View style={styles.recommendation}>
          <Text style={styles.recTitle}>{t("guide.recommendation")}</Text>

          <View style={styles.centerStoneCard}>
            <GemStone
              stoneId={centerStone.id}
              colorHex={centerStone.color_hex}
              size={56}
            />
            <Text style={styles.recLabel}>{t("guide.centerStone")}</Text>
            <Text style={styles.stoneName}>
              {isJp ? centerStone.name_jp : centerStone.name_en}
            </Text>
          </View>

          {supportStones.length > 0 && (
            <>
              <Text style={styles.recLabel}>{t("guide.supportStones")}</Text>
              <View style={styles.supportRow}>
                {supportStones.map((stone) => (
                  <View key={stone.id} style={styles.supportCard}>
                    <GemStone
                      stoneId={stone.id}
                      colorHex={stone.color_hex}
                      size={36}
                    />
                    <Text style={styles.supportName}>
                      {isJp ? stone.name_jp : stone.name_en}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Text style={styles.hint}>
            {isJp
              ? "庭で自由に石を追加・削除できます"
              : "You can add or remove stones freely in the garden"}
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.placeButton}
              onPress={handlePlaceForMe}
            >
              <Text style={styles.placeButtonText}>
                {t("guide.placeForMe")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.customizeButton}
              onPress={handleCustomize}
            >
              <Text style={styles.customizeButtonText}>
                {t("guide.customize")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>
            {isJp ? "あなたの傾向" : "Your Crystal Insights"}
          </Text>
          {insights.map((msg, i) => (
            <View key={i} style={styles.insightCard}>
              <Text style={styles.insightText}>{msg}</Text>
            </View>
          ))}
          {topStones.length > 0 && (
            <View style={styles.topStonesRow}>
              <Text style={styles.recLabel}>
                {isJp ? "よく使う石" : "MOST USED STONES"}
              </Text>
              <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.xs }}>
                {topStones.map((ts) => {
                  const stone = stones.find((s) => s.id === ts.id);
                  if (!stone) return null;
                  return (
                    <View key={ts.id} style={{ alignItems: "center" }}>
                      <GemStone stoneId={stone.id} colorHex={stone.color_hex} size={28} />
                      <Text style={{ color: colors.textMuted, fontSize: 9, marginTop: 2 }}>
                        {isJp ? stone.name_jp : stone.name_en} ({ts.uses})
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Guided Sessions */}
      <View style={styles.sessionsSection}>
        <Text style={styles.sectionTitle}>{t("guide.guidedSessions")}</Text>
        {SESSION_DATA.map((session) => (
          <TouchableOpacity
            key={session.name_en}
            style={styles.sessionCard}
            onPress={() => handleStartSession(session)}
          >
            <View>
              <Text style={styles.sessionName}>
                {isJp ? session.name_jp : session.name_en}
              </Text>
              <Text style={styles.sessionIntention}>
                {t(`intentions.${session.intention}`)}
              </Text>
            </View>
            <Text style={styles.sessionMeta}>
              {t("guide.sessionMinutes", { minutes: session.minutes })}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Session Ad */}
      <View style={styles.adSection}>
        <SponsoredAd ad={sessionAd} placement="session_end" />
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
  shapeSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  shapeRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  shapeCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    minWidth: 90,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shapeCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  shapeGlyph: {
    fontSize: 28,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  shapeName: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: "500",
    textAlign: "center",
  },
  shapeNameActive: {
    color: colors.primary,
  },
  shapePoints: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 2,
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
    gap: spacing.xs,
  },
  stoneName: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  supportRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  supportCard: {
    alignItems: "center",
    gap: spacing.xs,
    minWidth: 60,
  },
  supportName: {
    color: colors.textPrimary,
    fontSize: fontSize.xs,
    fontWeight: "500",
    textAlign: "center",
  },
  hint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontStyle: "italic",
    textAlign: "center",
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  placeButton: {
    flex: 1,
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
  customizeButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  customizeButtonText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  insightsSection: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary + "40",
  },
  insightCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  insightText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontStyle: "italic",
    lineHeight: 20,
  },
  topStonesRow: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sessionsSection: {
    gap: spacing.sm,
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
  sessionIntention: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  sessionMeta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  adSection: {
    marginTop: spacing.xl,
  },
});
