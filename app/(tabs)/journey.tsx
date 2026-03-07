import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useProgressionStore } from "../../stores/progressionStore";
import { useCanvasStore } from "../../stores/canvasStore";
import { useStoneStore } from "../../stores/stoneStore";
import { GemStone } from "../../components/common/GemStone";
import { SponsoredAd } from "../../components/common/SponsoredAd";
import { getAdForPlacement } from "../../data/mockAds";
import { XP_TABLE, XP_REWARDS } from "../../types";

// Blue-toned stone IDs for the weekly challenge
const BLUE_STONES = [
  "lapis_lazuli",
  "aquamarine",
  "turquoise",
  "labradorite",
];

export default function JourneyScreen() {
  const { t, i18n } = useTranslation();
  const progress = useProgressionStore((s) => s.progress);
  const addXP = useProgressionStore((s) => s.addXP);
  const unlockStone = useProgressionStore((s) => s.unlockStone);
  const setDailyIntention = useProgressionStore((s) => s.setDailyIntention);
  const updateStreak = useProgressionStore((s) => s.updateStreak);
  const savedGrids = useCanvasStore((s) => s.savedGrids);
  const allStones = useStoneStore((s) => s.stones);
  const [dailyReward, setDailyReward] = useState<string | null>(null);
  const isJp = i18n.language === "jp";

  // Daily login gem reward
  const claimDailyGem = useCallback(() => {
    const locked = allStones.filter((s) => !progress.stonesUnlocked.includes(s.id));
    const pool = locked.length > 0 ? locked : allStones;
    const randomStone = pool[Math.floor(Math.random() * pool.length)];
    unlockStone(randomStone.id);
    addXP(XP_REWARDS.NEW_STONE_USED);
    setDailyReward(randomStone.id);
  }, [allStones, progress.stonesUnlocked, unlockStone, addXP]);

  // XP progress to next level
  const sortedLevels = Object.entries(XP_TABLE)
    .map(([lvl, xp]) => ({ level: Number(lvl), xp }))
    .sort((a, b) => a.xp - b.xp);

  const currentLevelEntry =
    sortedLevels.filter((l) => l.xp <= progress.xpTotal).pop() ||
    sortedLevels[0];
  const nextLevelEntry = sortedLevels.find((l) => l.xp > progress.xpTotal);
  const xpInLevel = progress.xpTotal - currentLevelEntry.xp;
  const xpForNext = nextLevelEntry
    ? nextLevelEntry.xp - currentLevelEntry.xp
    : 1;
  const progressPercent = Math.min(xpInLevel / xpForNext, 1);
  const levelTitle = t(`levels.${progress.level}`) || `Level ${progress.level}`;

  // Skill tree progress based on actual stats
  const stoneWisdomProgress = Math.min(
    5,
    Math.floor(progress.stonesUnlocked.length / 5)
  );
  const gridMasteryProgress = Math.min(
    5,
    Math.floor(progress.gridsCompletedCount / 3)
  );
  const spiritualPathProgress = Math.min(
    5,
    Math.floor(progress.guidedSessionsCount / 2)
  );

  // Weekly challenge: check if any saved grid uses only blue stones
  const blueGridCount = savedGrids.filter((grid) =>
    grid.placements.length > 0 &&
    grid.placements.every((p) => BLUE_STONES.includes(p.stoneId))
  ).length;

  const handleDailyIntention = () => {
    if (!progress.dailyIntentionToday) {
      setDailyIntention(true);
      addXP(XP_REWARDS.DAILY_INTENTION);
      updateStreak();
    }
  };

  const dailyAd = getAdForPlacement("daily_intention");

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
            style={[
              styles.xpBarFill,
              { width: `${progressPercent * 100}%` },
            ]}
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

      {/* Daily Login Gem Reward */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isJp ? "毎日のクリスタル" : "Daily Crystal"}
        </Text>
        {dailyReward ? (
          <View style={styles.rewardCard}>
            <GemStone
              stoneId={dailyReward}
              colorHex={allStones.find((s) => s.id === dailyReward)?.color_hex || "#888"}
              size={48}
            />
            <Text style={styles.rewardText}>
              {isJp ? "新しい石を獲得！" : "You received a new stone!"}
            </Text>
            <Text style={styles.rewardName}>
              {isJp
                ? allStones.find((s) => s.id === dailyReward)?.name_jp
                : allStones.find((s) => s.id === dailyReward)?.name_en}
            </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.rewardButton} onPress={claimDailyGem}>
            <Text style={styles.rewardButtonText}>
              {isJp ? "今日のクリスタルを受け取る" : "Claim Today's Crystal"}
            </Text>
          </TouchableOpacity>
        )}
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

        {/* Ad after daily intention */}
        {progress.dailyIntentionToday && (
          <View style={styles.adWrap}>
            <SponsoredAd ad={dailyAd} placement="daily_intention" />
          </View>
        )}
      </View>

      {/* Skill Trees */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("journey.skillTrees")}</Text>
        {[
          {
            key: "stoneWisdom",
            label: t("journey.stoneWisdom"),
            progress: stoneWisdomProgress,
            max: 5,
            detail: `${progress.stonesUnlocked.length} / ${allStones.length}`,
          },
          {
            key: "gridMastery",
            label: t("journey.gridMastery"),
            progress: gridMasteryProgress,
            max: 5,
            detail: `${progress.gridsCompletedCount} grids`,
          },
          {
            key: "spiritualPath",
            label: t("journey.spiritualPath"),
            progress: spiritualPathProgress,
            max: 5,
            detail: `${progress.guidedSessionsCount} sessions`,
          },
        ].map((tree) => (
          <View key={tree.key} style={styles.skillRow}>
            <View style={styles.skillInfo}>
              <Text style={styles.skillLabel}>{tree.label}</Text>
              <Text style={styles.skillDetail}>{tree.detail}</Text>
            </View>
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
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsGrid}>
          <StatBox
            label="Grids Created"
            value={progress.gridsCompletedCount}
          />
          <StatBox
            label="Stones Unlocked"
            value={progress.stonesUnlocked.length}
          />
          <StatBox label="Best Streak" value={progress.longestStreakDays} />
          <StatBox
            label="Achievements"
            value={progress.achievements.length}
          />
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {[
          { id: "first_grid", label: "First Grid", desc: "Complete your first crystal grid" },
          { id: "five_stones", label: "Stone Collector", desc: "Unlock 5 different stones" },
          { id: "week_streak", label: "Week Warrior", desc: "Maintain a 7-day streak" },
          { id: "ten_grids", label: "Grid Master", desc: "Complete 10 grids" },
          { id: "all_stones", label: "Complete Collection", desc: "Unlock all 24 stones" },
        ].map((ach) => {
          const earned = progress.achievements.includes(ach.id);
          return (
            <View
              key={ach.id}
              style={[styles.achievementCard, earned && styles.achievementEarned]}
            >
              <Text style={styles.achievementIcon}>
                {earned ? "★" : "☆"}
              </Text>
              <View style={styles.achievementInfo}>
                <Text
                  style={[
                    styles.achievementLabel,
                    earned && styles.achievementLabelEarned,
                  ]}
                >
                  {ach.label}
                </Text>
                <Text style={styles.achievementDesc}>{ach.desc}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Weekly Challenge */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("journey.weeklyChallenge")}</Text>
        <View style={styles.challengeCard}>
          <Text style={styles.challengeName}>Blue Harmony</Text>
          <Text style={styles.challengeDesc}>
            Build a grid using only blue-toned stones (Lapis Lazuli,
            Aquamarine, Turquoise, or Labradorite)
          </Text>
          <View style={styles.challengeProgressRow}>
            <View style={styles.challengeBar}>
              <View
                style={[
                  styles.challengeBarFill,
                  { width: `${Math.min(blueGridCount, 1) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.challengeProgress}>
              {Math.min(blueGridCount, 1)} / 1
            </Text>
          </View>
          {blueGridCount >= 1 && (
            <Text style={styles.challengeComplete}>Challenge Complete!</Text>
          )}
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
  rewardCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary + "60",
  },
  rewardText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  rewardName: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  rewardButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  rewardButtonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
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
  adWrap: {
    marginTop: spacing.md,
  },
  skillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  skillInfo: {
    flex: 1,
  },
  skillLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
  skillDetail: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 1,
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
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.5,
  },
  achievementEarned: {
    opacity: 1,
    borderColor: colors.primary,
  },
  achievementIcon: {
    fontSize: fontSize.xl,
    color: colors.primary,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementLabel: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  achievementLabelEarned: {
    color: colors.textPrimary,
  },
  achievementDesc: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
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
    lineHeight: 20,
  },
  challengeProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  challengeBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    overflow: "hidden",
  },
  challengeBarFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  challengeProgress: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  challengeComplete: {
    color: colors.success,
    fontSize: fontSize.sm,
    fontWeight: "600",
    marginTop: spacing.sm,
    textAlign: "center",
  },
});
