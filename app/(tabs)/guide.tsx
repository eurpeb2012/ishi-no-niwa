import { useState, useEffect, useRef } from "react";
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
import { useResponsive } from "../../hooks/useResponsive";
import { useStoneStore } from "../../stores/stoneStore";
import { useCanvasStore } from "../../stores/canvasStore";
import { useProgressionStore } from "../../stores/progressionStore";
import { GemStone } from "../../components/common/GemStone";
import { SponsoredAd } from "../../components/common/SponsoredAd";
import { getAdForPlacement } from "../../data/mockAds";
import { useInsightStore } from "../../stores/insightStore";
import { getCurrentMoonPhase, getDailyCrystal, getAllMoonPhases } from "../../data/moonPhases";
import { XP_REWARDS } from "../../types";
import type { IntentionId, GridTemplate } from "../../types";
import templates from "../../data/templates.json";

const INTENTIONS: IntentionId[] = [
  "love", "prosperity", "healing", "protection",
  "spiritual", "calm", "career", "courage",
];

const SESSION_DATA = [
  { name_en: "Morning Clarity", name_jp: "朝の明晰", minutes: 10, intention: "spiritual" },
  { name_en: "Evening Calm", name_jp: "夕べの静寂", minutes: 15, intention: "calm" },
  { name_en: "Heart Opening", name_jp: "ハートオープニング", minutes: 10, intention: "love" },
  { name_en: "Protection Shield", name_jp: "守護の盾", minutes: 12, intention: "protection" },
  { name_en: "Abundance Flow", name_jp: "豊穣の流れ", minutes: 10, intention: "prosperity" },
  { name_en: "Inner Courage", name_jp: "内なる勇気", minutes: 8, intention: "courage" },
];

const SHAPE_GLYPHS: Record<string, string> = {
  triangle: "\u25B3", square: "\u25A1", circle: "\u25CB", diamond: "\u25C7",
  pentagon: "\u2B1F", cross: "\u271A", vesica: "\u2A38", hexagram: "\u2721",
  infinity: "\u221E", star: "\u2606", hexagonal: "\u2B21", wave: "\u223F",
  spiral: "\u0040", ring: "\u25CE", sacred: "\u2699", freeform: "\u2022",
};

export default function GuideScreen() {
  const { t, i18n } = useTranslation();
  const { contentPadding, isTablet, isDesktop, fontScale } = useResponsive();
  const stones = useStoneStore((s) => s.stones);
  const getStone = useStoneStore((s) => s.getStone);
  const generateInsights = useInsightStore((s) => s.generateInsights);
  const trackIntention = useInsightStore((s) => s.trackIntention);
  const topStones = useInsightStore((s) => s.getTopStones)(3);
  const [insights, setInsights] = useState<string[]>([]);
  const [selectedIntention, setSelectedIntention] = useState<IntentionId | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<GridTemplate | null>(null);
  const [showAllMoons, setShowAllMoons] = useState(false);

  // Meditation timer
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerDuration, setTimerDuration] = useState(300); // 5 min default
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setInsights(generateInsights());
  }, []);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev >= timerDuration) {
            clearInterval(timerRef.current!);
            setTimerActive(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, timerDuration]);

  const canvas = useCanvasStore();
  const addXP = useProgressionStore((s) => s.addXP);
  const incrementSessions = useProgressionStore((s) => s.incrementSessions);

  const moonPhase = getCurrentMoonPhase();
  const dailyCrystal = getDailyCrystal();
  const dailyStone = getStone(dailyCrystal.stoneId);

  const matchingTemplates = selectedIntention
    ? (templates as GridTemplate[]).filter(
        (tmpl) => tmpl.intentions.includes(selectedIntention) && tmpl.point_count > 0
      )
    : [];

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
    canvas.setGridName(`${t(`intentions.${selectedIntention}`)} - ${selectedTemplate.name_en}`);
    const points = selectedTemplate.points;
    recommendedStones.forEach((stone, i) => {
      if (i < points.length) {
        canvas.addPlacement({ stoneId: stone.id, x: points[i].x, y: points[i].y, rotation: 0 });
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
    canvas.setGridName(`${t(`intentions.${selectedIntention}`)} - ${selectedTemplate.name_en}`);
    router.navigate("/(tabs)/garden");
  };

  const handleStartSession = (session: (typeof SESSION_DATA)[0]) => {
    setSelectedIntention(session.intention as IntentionId);
    setSelectedTemplate(null);
    setTimerDuration(session.minutes * 60);
    setTimerSeconds(0);
    setTimerActive(true);
    addXP(XP_REWARDS.COMPLETE_SESSION);
    incrementSessions();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const sessionAd = getAdForPlacement("session_end");
  const isJp = i18n.language === "jp";
  const allMoons = getAllMoonPhases();

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingHorizontal: contentPadding }]}>
      <Text style={[styles.title, (isTablet || isDesktop) && { fontSize: 32 }]}>{t("guide.title")}</Text>

      {/* Moon Phase Card */}
      <View style={styles.moonCard}>
        <View style={styles.moonHeader}>
          <Text style={styles.moonGlyph}>{moonPhase.glyph}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.moonName}>
              {t("guide.moonPhase")}: {isJp ? moonPhase.name_jp : moonPhase.name_en}
            </Text>
            <Text style={styles.moonDesc}>
              {isJp ? moonPhase.description_jp : moonPhase.description_en}
            </Text>
          </View>
        </View>

        {/* Moon cycle display */}
        <TouchableOpacity onPress={() => setShowAllMoons(!showAllMoons)}>
          <View style={styles.moonCycle}>
            {allMoons.map((m) => (
              <Text
                key={m.phase}
                style={[styles.moonCycleGlyph, m.phase === moonPhase.phase && styles.moonCycleActive]}
              >
                {m.glyph}
              </Text>
            ))}
          </View>
        </TouchableOpacity>

        {showAllMoons && (
          <View style={styles.moonList}>
            {allMoons.map((m) => (
              <View key={m.phase} style={styles.moonListItem}>
                <Text style={styles.moonListGlyph}>{m.glyph}</Text>
                <Text style={styles.moonListName}>{isJp ? m.name_jp : m.name_en}</Text>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {m.recommendedStones.slice(0, 2).map((sid) => {
                    const s = getStone(sid);
                    return s ? (
                      <GemStone key={sid} stoneId={s.id} colorHex={s.color_hex} size={16} />
                    ) : null;
                  })}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Daily Crystal */}
      {dailyStone && (
        <View style={styles.dailyCrystalCard}>
          <Text style={styles.sectionTitle}>{t("guide.dailyCrystal")}</Text>
          <View style={styles.dailyCrystalRow}>
            <GemStone stoneId={dailyStone.id} colorHex={dailyStone.color_hex} size={48} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.dailyStoneName}>
                {isJp ? dailyStone.name_jp : dailyStone.name_en}
              </Text>
              <Text style={styles.dailyReason}>
                {isJp ? dailyCrystal.reason_jp : dailyCrystal.reason_en}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Meditation Timer */}
      {timerActive && (
        <View style={styles.timerCard}>
          <Text style={styles.timerTitle}>{t("guide.meditationTimer")}</Text>
          <Text style={styles.timerDisplay}>
            {formatTime(timerSeconds)} / {formatTime(timerDuration)}
          </Text>
          <View style={styles.timerBar}>
            <View style={[styles.timerBarFill, { width: `${(timerSeconds / timerDuration) * 100}%` }]} />
          </View>
          <TouchableOpacity
            style={styles.timerButton}
            onPress={() => { setTimerActive(false); setTimerSeconds(0); }}
          >
            <Text style={styles.timerButtonText}>{t("guide.stopTimer")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 1: Intention Picker */}
      <Text style={styles.subtitle}>{t("guide.whatFocus")}</Text>
      <View style={styles.intentionGrid}>
        {INTENTIONS.map((intention) => (
          <TouchableOpacity
            key={intention}
            style={[styles.intentionCard, selectedIntention === intention && styles.intentionActive]}
            onPress={() => {
              const next = selectedIntention === intention ? null : intention;
              setSelectedIntention(next);
              setSelectedTemplate(null);
              if (next) trackIntention(next);
            }}
          >
            <Text style={[styles.intentionText, selectedIntention === intention && styles.intentionTextActive]}>
              {t(`intentions.${intention}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Step 2: Shape Picker */}
      {selectedIntention && matchingTemplates.length > 0 && (
        <View style={styles.shapeSection}>
          <Text style={styles.sectionTitle}>{t("guide.chooseShape")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shapeRow}>
            {matchingTemplates.map((tmpl) => (
              <TouchableOpacity
                key={tmpl.id}
                style={[styles.shapeCard, selectedTemplate?.id === tmpl.id && styles.shapeCardActive]}
                onPress={() => setSelectedTemplate(selectedTemplate?.id === tmpl.id ? null : tmpl)}
              >
                <Text style={styles.shapeGlyph}>{SHAPE_GLYPHS[tmpl.geometry_type] || "\u25CF"}</Text>
                <Text style={[styles.shapeName, selectedTemplate?.id === tmpl.id && styles.shapeNameActive]}>
                  {isJp ? tmpl.name_jp : tmpl.name_en}
                </Text>
                <Text style={styles.shapePoints}>{tmpl.point_count} pts</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Step 3: Recommendation */}
      {selectedIntention && selectedTemplate && centerStone && (
        <View style={styles.recommendation}>
          <Text style={styles.recTitle}>{t("guide.recommendation")}</Text>
          <View style={styles.centerStoneCard}>
            <GemStone stoneId={centerStone.id} colorHex={centerStone.color_hex} size={56} />
            <Text style={styles.recLabel}>{t("guide.centerStone")}</Text>
            <Text style={styles.stoneName}>{isJp ? centerStone.name_jp : centerStone.name_en}</Text>
          </View>
          {supportStones.length > 0 && (
            <>
              <Text style={styles.recLabel}>{t("guide.supportStones")}</Text>
              <View style={styles.supportRow}>
                {supportStones.map((stone) => (
                  <View key={stone.id} style={styles.supportCard}>
                    <GemStone stoneId={stone.id} colorHex={stone.color_hex} size={36} />
                    <Text style={styles.supportName}>{isJp ? stone.name_jp : stone.name_en}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
          <Text style={styles.hint}>
            {isJp ? "庭で自由に石を追加・削除できます" : "You can add or remove stones freely in the garden"}
          </Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.placeButton} onPress={handlePlaceForMe}>
              <Text style={styles.placeButtonText}>{t("guide.placeForMe")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.customizeButton} onPress={handleCustomize}>
              <Text style={styles.customizeButtonText}>{t("guide.customize")}</Text>
            </TouchableOpacity>
          </View>
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
              <Text style={styles.sessionName}>{isJp ? session.name_jp : session.name_en}</Text>
              <Text style={styles.sessionIntention}>{t(`intentions.${session.intention}`)}</Text>
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
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.lg },

  // Moon phase
  moonCard: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.primary + "40",
  },
  moonHeader: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  moonGlyph: { fontSize: 36 },
  moonName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600" },
  moonDesc: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs, lineHeight: 18 },
  moonCycle: {
    flexDirection: "row", justifyContent: "space-between", marginTop: spacing.md,
    paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border,
  },
  moonCycleGlyph: { fontSize: 20, opacity: 0.4 },
  moonCycleActive: { opacity: 1, fontSize: 24 },
  moonList: { marginTop: spacing.sm, gap: spacing.xs },
  moonListItem: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  moonListGlyph: { fontSize: 16, width: 24, textAlign: "center" },
  moonListName: { color: colors.textSecondary, fontSize: fontSize.xs, flex: 1 },

  // Daily crystal
  dailyCrystalCard: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border,
  },
  dailyCrystalRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.sm },
  dailyStoneName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600" },
  dailyReason: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs },

  // Timer
  timerCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg,
    marginBottom: spacing.lg, alignItems: "center", borderWidth: 1, borderColor: colors.primary,
  },
  timerTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600", marginBottom: spacing.sm },
  timerDisplay: { color: colors.primary, fontSize: fontSize.title, fontWeight: "700", marginBottom: spacing.md },
  timerBar: {
    width: "100%", height: 4, backgroundColor: colors.background, borderRadius: 2,
    overflow: "hidden", marginBottom: spacing.md,
  },
  timerBarFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  timerButton: {
    backgroundColor: colors.error, borderRadius: borderRadius.md,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.xl,
  },
  timerButtonText: { color: "#fff", fontSize: fontSize.md, fontWeight: "600" },

  // Intentions
  intentionGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.xl },
  intentionCard: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  intentionActive: { borderColor: colors.primary, backgroundColor: colors.surface },
  intentionText: { color: colors.textSecondary, fontSize: fontSize.sm },
  intentionTextActive: { color: colors.primary, fontWeight: "600" },

  // Shape
  shapeSection: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: "600", color: colors.textPrimary, marginBottom: spacing.sm },
  shapeRow: { gap: spacing.sm, paddingVertical: spacing.xs },
  shapeCard: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, padding: spacing.md,
    alignItems: "center", minWidth: 90, borderWidth: 1, borderColor: colors.border,
  },
  shapeCardActive: { borderColor: colors.primary, backgroundColor: colors.surface },
  shapeGlyph: { fontSize: 28, color: colors.textMuted, marginBottom: spacing.xs },
  shapeName: { color: colors.textSecondary, fontSize: fontSize.xs, fontWeight: "500", textAlign: "center" },
  shapeNameActive: { color: colors.primary },
  shapePoints: { color: colors.textMuted, fontSize: 9, marginTop: 2 },

  // Recommendation
  recommendation: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.lg, padding: spacing.lg,
    marginBottom: spacing.xl, gap: spacing.md,
  },
  recTitle: { fontSize: fontSize.lg, fontWeight: "600", color: colors.textPrimary },
  recLabel: { fontSize: fontSize.xs, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 1 },
  centerStoneCard: { alignItems: "center", paddingVertical: spacing.md, gap: spacing.xs },
  stoneName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600" },
  supportRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  supportCard: { alignItems: "center", gap: spacing.xs, minWidth: 60 },
  supportName: { color: colors.textPrimary, fontSize: fontSize.xs, fontWeight: "500", textAlign: "center" },
  hint: { color: colors.textMuted, fontSize: fontSize.xs, fontStyle: "italic", textAlign: "center" },
  actionRow: { flexDirection: "row", gap: spacing.sm },
  placeButton: {
    flex: 1, backgroundColor: colors.primary, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: "center",
  },
  placeButtonText: { color: colors.buttonText, fontSize: fontSize.md, fontWeight: "600" },
  customizeButton: {
    flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: "center", borderWidth: 1, borderColor: colors.primary,
  },
  customizeButtonText: { color: colors.primary, fontSize: fontSize.md, fontWeight: "600" },

  // Insights
  insightsSection: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.lg, padding: spacing.lg,
    marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.primary + "40",
  },
  insightCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md,
    marginTop: spacing.sm, borderLeftWidth: 3, borderLeftColor: colors.primary,
  },
  insightText: { color: colors.textSecondary, fontSize: fontSize.sm, fontStyle: "italic", lineHeight: 20 },
  topStonesRow: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },

  // Sessions
  sessionsSection: { gap: spacing.sm },
  sessionCard: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, padding: spacing.md,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderWidth: 1, borderColor: colors.border,
  },
  sessionName: { color: colors.textPrimary, fontSize: fontSize.md },
  sessionIntention: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  sessionMeta: { color: colors.textMuted, fontSize: fontSize.sm },
  adSection: { marginTop: spacing.xl },
});
