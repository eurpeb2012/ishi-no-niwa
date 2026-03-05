import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useProgressionStore } from "../../stores/progressionStore";
import { XP_TABLE, XP_REWARDS } from "../../types";

export default function JourneyScreen() {
  const { t } = useTranslation();
  const progress = useProgressionStore((s) => s.progress);
  const addXP = useProgressionStore((s) => s.addXP);
  const setDailyIntention = useProgressionStore((s) => s.setDailyIntention);
  const updateStreak = useProgressionStore((s) => s.updateStreak);

  // Calculate XP progress to next level
  const sortedLevels = Object.entries(XP_TABLE)
    .map(([lvl, xp]) => ({ level: Number(lvl), xp }))
    .sort((a, b) => a.xp - b.xp);

  const currentLevelEntry = sortedLevels.filter(
    (l) => l.xp <= progress.xpTotal
  ).pop() || sortedLevels[0];

  const nextLevelEntry = sortedLevels.find(
    (l) => l.xp > progress.xpTotal
  );

  const xpInLevel = progress.xpTotal - currentLevelEntry.xp;
  const xpForNext = nextLevelEntry
    ? nextLevelEntry.xp - currentLevelEntry.xp
    : 1;
  const progressPercent = Math.min(xpInLevel / xpForNext, 1);

  const levelTitle = t(`levels.${progress.level}`) || `Level ${progress.level}`;

  const handleDailyIntention = () => {
    if (!progress.dailyIntentionToday) {
      setDailyIntention(true);
      addXP(XP_REWARDS.DAILY_INTENTION);
      updateStreak();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>{t("journey.title")}</Text>

      {/* Level Card */}
      <View style={styles.levelCard}>
        <Text style={styles.levelTitle}>{levelTitle}</Text>
        <Text style={styles.levelNumber}>
          {t("journey.level")} {progress.level}
        </Text>
        <View style={styles.xpBarBg}>
          <View
            style={[styles.xpBarFill, { width: `${progressPercent * 100}%` }]}
          />
        </View>
        <Text style={styles.xpText}>
          {progress.xpTotal} {t("journey.xp")}
          {nextLevelEntry ? ` / ${nextLevelEntry.xp}` : ""}
        </Text>
        <Text style={styles.streakText}>
          {progress.currentStreakDays} {t("journey.streak")}
        </Text>
      </View>

      {/* Daily Intention */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("journey.dailyIntention")}</Text>
        <TouchableOpacity
          style={[
            styles.intentionButton,
            progress.dailyIntentionToday && styles.intentionDone,
          ]}
          onPress={handleDailyIntention}
          disabled={progress.dailyIntentionToday}
        >
          <Text
            style={[
              styles.intentionButtonText,
              progress.dailyIntentionToday && styles.intentionDoneText,
            ]}
          >
            {progress.dailyIntentionToday
              ? t("journey.intentionComplete")
              : t("journey.setIntention")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Skill Trees */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("journey.skillTrees")}</Text>
        {[
          { key: "stoneWisdom", label: t("journey.stoneWisdom"), progress: 0, max: 5 },
          { key: "gridMastery", label: t("journey.gridMastery"), progress: 0, max: 5 },
          { key: "spiritualPath", label: t("journey.spiritualPath"), progress: 0, max: 5 },
        ].map((tree) => (
          <View key={tree.key} style={styles.skillRow}>
            <Text style={styles.skillLabel}>{tree.label}</Text>
            <View style={styles.skillDots}>
              {Array.from({ length: tree.max }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.skillDot,
                    i < tree.progress && styles.skillDotFilled,
                  ]}
                />
              ))}
            </View>
          </View>
        ))}
        <Text style={styles.comingSoon}>
          Full skill trees coming in v1.2
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsGrid}>
          <StatBox label="Grids Created" value={progress.gridsCompletedCount} />
          <StatBox label="Stones Unlocked" value={progress.stonesUnlocked.length} />
          <StatBox label="Best Streak" value={progress.longestStreakDays} />
          <StatBox label="Achievements" value={progress.achievements.length} />
        </View>
      </View>

      {/* Weekly Challenge */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("journey.weeklyChallenge")}</Text>
        <View style={styles.challengeCard}>
          <Text style={styles.challengeName}>Blue Harmony</Text>
          <Text style={styles.challengeDesc}>
            Build a grid using only blue-toned stones
          </Text>
          <Text style={styles.challengeProgress}>0 / 1</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
    marginBottom: spacing.lg,
  },
  levelCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.primary,
  },
  levelNumber: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  xpBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  xpBarFill: {
    height: 8,
    backgroundColor: colors.xp,
    borderRadius: 4,
  },
  xpText: {
    color: colors.xp,
    fontSize: fontSize.sm,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  streakText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  intentionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  intentionDone: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.success,
  },
  intentionButtonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  intentionDoneText: {
    color: colors.success,
  },
  skillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  skillLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
  skillDots: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  skillDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skillDotFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  comingSoon: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: spacing.sm,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  challengeCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  challengeName: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  challengeDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  challengeProgress: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
});
