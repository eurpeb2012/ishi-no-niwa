import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useResponsive } from "../../hooks/useResponsive";
import { useProgressionStore } from "../../stores/progressionStore";
import { useCanvasStore } from "../../stores/canvasStore";
import { useStoneStore } from "../../stores/stoneStore";
import { useJournalStore, type Mood } from "../../stores/journalStore";
import { GemStone } from "../../components/common/GemStone";
import { SponsoredAd } from "../../components/common/SponsoredAd";
import { getAdForPlacement } from "../../data/mockAds";
import { XP_TABLE, XP_REWARDS } from "../../types";

const BLUE_STONES = ["lapis_lazuli", "aquamarine", "turquoise", "labradorite"];
const MOOD_OPTIONS: { mood: Mood; glyph: string }[] = [
  { mood: "wonderful", glyph: "\u2728" },
  { mood: "good", glyph: "\u263A" },
  { mood: "neutral", glyph: "\u25CB" },
  { mood: "low", glyph: "\u2601" },
  { mood: "stressed", glyph: "\u26A1" },
];

const ALL_ACHIEVEMENTS = [
  { id: "first_grid", label_en: "First Grid", label_jp: "初めての陣", desc_en: "Complete your first crystal grid", desc_jp: "初めてのクリスタルグリッドを完成" },
  { id: "five_stones", label_en: "Stone Collector", label_jp: "石の収集家", desc_en: "Unlock 5 different stones", desc_jp: "5つの石を解放" },
  { id: "week_streak", label_en: "Week Warrior", label_jp: "一週間の戦士", desc_en: "Maintain a 7-day streak", desc_jp: "7日間連続を達成" },
  { id: "ten_grids", label_en: "Grid Master", label_jp: "陣の達人", desc_en: "Complete 10 grids", desc_jp: "10の陣を完成" },
  { id: "all_stones", label_en: "Complete Collection", label_jp: "完全コレクション", desc_en: "Unlock all 24 stones", desc_jp: "全24石を解放" },
  { id: "moon_watcher", label_en: "Moon Watcher", label_jp: "月の観察者", desc_en: "Check the moon phase 7 times", desc_jp: "月相を7回確認" },
  { id: "journal_5", label_en: "Reflective Soul", label_jp: "振り返りの魂", desc_en: "Write 5 journal entries", desc_jp: "ジャーナルを5回記録" },
  { id: "chakra_balance", label_en: "Chakra Harmony", label_jp: "チャクラの調和", desc_en: "Use stones from all 7 chakras", desc_jp: "全7チャクラの石を使用" },
  { id: "share_grid", label_en: "Community Spirit", label_jp: "コミュニティの精神", desc_en: "Share a grid with the community", desc_jp: "コミュニティにグリッドを共有" },
  { id: "month_streak", label_en: "Dedication Master", label_jp: "献身の達人", desc_en: "Maintain a 30-day streak", desc_jp: "30日間連続を達成" },
];

const ALL_CHALLENGES = [
  { id: "blue_harmony", name_en: "Blue Harmony", name_jp: "青の調和", desc_en: "Build a grid using only blue-toned stones", desc_jp: "青系の石だけでグリッドを作成", target: 1, checkStones: BLUE_STONES },
  { id: "heart_chakra", name_en: "Heart Chakra Focus", name_jp: "ハートチャクラ集中", desc_en: "Use 3 heart chakra stones in one grid", desc_jp: "1つのグリッドでハートチャクラの石を3つ使用", target: 1, checkStones: ["rose_quartz", "jade_jadeite", "rhodonite", "green_aventurine", "malachite", "prehnite"] },
  { id: "five_in_week", name_en: "Weekly Creator", name_jp: "週間クリエイター", desc_en: "Create 5 grids this week", desc_jp: "今週5つのグリッドを作成", target: 5, checkStones: null },
  { id: "all_24", name_en: "Master Collector", name_jp: "マスターコレクター", desc_en: "Use all 24 stones at least once", desc_jp: "全24石を少なくとも1回使用", target: 24, checkStones: null },
];

export default function JourneyScreen() {
  const { t, i18n } = useTranslation();
  const { contentPadding, isTablet, isDesktop } = useResponsive();
  const progress = useProgressionStore((s) => s.progress);
  const addXP = useProgressionStore((s) => s.addXP);
  const unlockStone = useProgressionStore((s) => s.unlockStone);
  const setDailyIntention = useProgressionStore((s) => s.setDailyIntention);
  const updateStreak = useProgressionStore((s) => s.updateStreak);
  const savedGrids = useCanvasStore((s) => s.savedGrids);
  const allStones = useStoneStore((s) => s.stones);

  const journalEntries = useJournalStore((s) => s.entries);
  const addJournalEntry = useJournalStore((s) => s.addEntry);
  const moodTrend = useJournalStore((s) => s.getMoodTrend)();

  const [dailyReward, setDailyReward] = useState<string | null>(null);
  const [showJournal, setShowJournal] = useState(false);
  const [journalMood, setJournalMood] = useState<Mood | null>(null);
  const [journalNote, setJournalNote] = useState("");

  const isJp = i18n.language === "jp";

  const claimDailyGem = useCallback(() => {
    const locked = allStones.filter((s) => !progress.stonesUnlocked.includes(s.id));
    const pool = locked.length > 0 ? locked : allStones;
    const randomStone = pool[Math.floor(Math.random() * pool.length)];
    unlockStone(randomStone.id);
    addXP(XP_REWARDS.NEW_STONE_USED);
    setDailyReward(randomStone.id);
  }, [allStones, progress.stonesUnlocked, unlockStone, addXP]);

  const handleSaveJournal = () => {
    if (!journalMood) return;
    addJournalEntry({
      date: new Date().toISOString().split("T")[0],
      mood: journalMood,
      note: journalNote,
      stonesUsed: [],
    });
    addXP(5);
    setJournalMood(null);
    setJournalNote("");
    setShowJournal(false);
  };

  const sortedLevels = Object.entries(XP_TABLE)
    .map(([lvl, xp]) => ({ level: Number(lvl), xp }))
    .sort((a, b) => a.xp - b.xp);

  const currentLevelEntry = sortedLevels.filter((l) => l.xp <= progress.xpTotal).pop() || sortedLevels[0];
  const nextLevelEntry = sortedLevels.find((l) => l.xp > progress.xpTotal);
  const xpInLevel = progress.xpTotal - currentLevelEntry.xp;
  const xpForNext = nextLevelEntry ? nextLevelEntry.xp - currentLevelEntry.xp : 1;
  const progressPercent = Math.min(xpInLevel / xpForNext, 1);
  const levelTitle = t(`levels.${progress.level}`) || `Level ${progress.level}`;

  const stoneWisdomProgress = Math.min(5, Math.floor(progress.stonesUnlocked.length / 5));
  const gridMasteryProgress = Math.min(5, Math.floor(progress.gridsCompletedCount / 3));
  const spiritualPathProgress = Math.min(5, Math.floor(progress.guidedSessionsCount / 2));

  const blueGridCount = savedGrids.filter((grid) =>
    grid.placements.length > 0 && grid.placements.every((p) => BLUE_STONES.includes(p.stoneId))
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
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingHorizontal: contentPadding }]}>
      <Text style={[styles.title, (isTablet || isDesktop) && { fontSize: 32 }]}>{t("journey.title")}</Text>

      {/* Streak Banner */}
      {progress.currentStreakDays >= 3 && (
        <View style={styles.streakBanner}>
          <Text style={styles.streakBannerGlyph}>
            {progress.currentStreakDays >= 30 ? "\u{1F525}" : progress.currentStreakDays >= 7 ? "\u2B50" : "\u2728"}
          </Text>
          <Text style={styles.streakBannerText}>
            {progress.currentStreakDays} {t("journey.streak")}!
          </Text>
        </View>
      )}

      {/* Level Card */}
      <View style={styles.levelCard}>
        <Text style={styles.levelTitle}>{levelTitle}</Text>
        <Text style={styles.levelNumber}>{t("journey.level")} {progress.level}</Text>
        <View style={styles.xpBarBg}>
          <View style={[styles.xpBarFill, { width: `${progressPercent * 100}%` }]} />
        </View>
        <Text style={styles.xpText}>
          {progress.xpTotal} {t("journey.xp")}{nextLevelEntry ? ` / ${nextLevelEntry.xp}` : ""}
        </Text>
        <Text style={styles.streakText}>
          {progress.currentStreakDays} {t("journey.streak")} · {isJp ? "最高" : "Best"}: {progress.longestStreakDays}
        </Text>
      </View>

      {/* Daily Login Gem Reward */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{isJp ? "毎日のクリスタル" : "Daily Crystal"}</Text>
        {dailyReward ? (
          <View style={styles.rewardCard}>
            <GemStone
              stoneId={dailyReward}
              colorHex={allStones.find((s) => s.id === dailyReward)?.color_hex || "#888"}
              size={48}
            />
            <Text style={styles.rewardText}>{isJp ? "新しい石を獲得！" : "You received a new stone!"}</Text>
            <Text style={styles.rewardName}>
              {isJp ? allStones.find((s) => s.id === dailyReward)?.name_jp : allStones.find((s) => s.id === dailyReward)?.name_en}
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

      {/* Crystal Journal */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("journey.journal")}</Text>
          <TouchableOpacity onPress={() => setShowJournal(!showJournal)}>
            <Text style={styles.addButton}>{showJournal ? t("common.cancel") : t("journey.addEntry")}</Text>
          </TouchableOpacity>
        </View>

        {showJournal && (
          <View style={styles.journalForm}>
            <Text style={styles.journalLabel}>{t("journey.mood")}</Text>
            <View style={styles.moodRow}>
              {MOOD_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.mood}
                  style={[styles.moodButton, journalMood === opt.mood && styles.moodButtonActive]}
                  onPress={() => setJournalMood(opt.mood)}
                >
                  <Text style={styles.moodGlyph}>{opt.glyph}</Text>
                  <Text style={[styles.moodLabel, journalMood === opt.mood && styles.moodLabelActive]}>
                    {t(`moods.${opt.mood}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.journalInput}
              placeholder={t("journey.journalNote")}
              placeholderTextColor={colors.textMuted}
              value={journalNote}
              onChangeText={setJournalNote}
              multiline
            />
            <TouchableOpacity
              style={[styles.journalSaveButton, !journalMood && { opacity: 0.4 }]}
              onPress={handleSaveJournal}
              disabled={!journalMood}
            >
              <Text style={styles.journalSaveText}>{t("common.save")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Mood trend */}
        {moodTrend.some((m) => m.count > 0) && (
          <View style={styles.moodTrendCard}>
            <Text style={styles.moodTrendTitle}>{t("journey.moodTrend")}</Text>
            <View style={styles.moodTrendRow}>
              {moodTrend.filter((m) => m.count > 0).map((m) => (
                <View key={m.mood} style={styles.moodTrendItem}>
                  <Text style={styles.moodTrendGlyph}>
                    {MOOD_OPTIONS.find((o) => o.mood === m.mood)?.glyph}
                  </Text>
                  <Text style={styles.moodTrendCount}>{m.count}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent entries */}
        {journalEntries.slice(0, 3).map((entry) => (
          <View key={entry.id} style={styles.journalEntryCard}>
            <Text style={styles.journalEntryGlyph}>
              {MOOD_OPTIONS.find((o) => o.mood === entry.mood)?.glyph}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.journalEntryDate}>{entry.date}</Text>
              {entry.note ? <Text style={styles.journalEntryNote}>{entry.note}</Text> : null}
            </View>
          </View>
        ))}
      </View>

      {/* Daily Intention */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("journey.dailyIntention")}</Text>
        <TouchableOpacity
          style={[styles.intentionButton, progress.dailyIntentionToday && styles.intentionDone]}
          onPress={handleDailyIntention}
          disabled={progress.dailyIntentionToday}
        >
          <Text style={[styles.intentionButtonText, progress.dailyIntentionToday && styles.intentionDoneText]}>
            {progress.dailyIntentionToday ? t("journey.intentionComplete") : t("journey.setIntention")}
          </Text>
        </TouchableOpacity>
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
          { key: "stoneWisdom", label: t("journey.stoneWisdom"), progress: stoneWisdomProgress, max: 5, detail: `${progress.stonesUnlocked.length} / ${allStones.length}` },
          { key: "gridMastery", label: t("journey.gridMastery"), progress: gridMasteryProgress, max: 5, detail: `${progress.gridsCompletedCount} grids` },
          { key: "spiritualPath", label: t("journey.spiritualPath"), progress: spiritualPathProgress, max: 5, detail: `${progress.guidedSessionsCount} sessions` },
        ].map((tree) => (
          <View key={tree.key} style={styles.skillRow}>
            <View style={styles.skillInfo}>
              <Text style={styles.skillLabel}>{tree.label}</Text>
              <Text style={styles.skillDetail}>{tree.detail}</Text>
            </View>
            <View style={styles.skillDots}>
              {Array.from({ length: tree.max }).map((_, i) => (
                <View key={i} style={[styles.skillDot, i < tree.progress && styles.skillDotFilled]} />
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsGrid}>
          <StatBox label={isJp ? "作成した陣" : "Grids Created"} value={progress.gridsCompletedCount} />
          <StatBox label={isJp ? "解放した石" : "Stones Unlocked"} value={progress.stonesUnlocked.length} />
          <StatBox label={isJp ? "最高連続" : "Best Streak"} value={progress.longestStreakDays} />
          <StatBox label={isJp ? "ジャーナル" : "Journal Entries"} value={journalEntries.length} />
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("journey.achievements")}</Text>
        {ALL_ACHIEVEMENTS.map((ach) => {
          const earned = progress.achievements.includes(ach.id);
          return (
            <View key={ach.id} style={[styles.achievementCard, earned && styles.achievementEarned]}>
              <Text style={styles.achievementIcon}>{earned ? "\u2605" : "\u2606"}</Text>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementLabel, earned && styles.achievementLabelEarned]}>
                  {isJp ? ach.label_jp : ach.label_en}
                </Text>
                <Text style={styles.achievementDesc}>{isJp ? ach.desc_jp : ach.desc_en}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Challenges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("journey.challenges")}</Text>
        {ALL_CHALLENGES.map((ch) => {
          let completed = 0;
          if (ch.id === "blue_harmony") completed = Math.min(blueGridCount, ch.target);
          else if (ch.id === "five_in_week") completed = Math.min(progress.gridsCompletedCount, ch.target);
          else if (ch.id === "all_24") completed = progress.stonesUnlocked.length;
          else if (ch.id === "heart_chakra") {
            completed = savedGrids.filter((g) =>
              g.placements.filter((p) => ch.checkStones?.includes(p.stoneId)).length >= 3
            ).length > 0 ? 1 : 0;
          }
          const pct = Math.min(completed / ch.target, 1);
          return (
            <View key={ch.id} style={styles.challengeCard}>
              <Text style={styles.challengeName}>{isJp ? ch.name_jp : ch.name_en}</Text>
              <Text style={styles.challengeDesc}>{isJp ? ch.desc_jp : ch.desc_en}</Text>
              <View style={styles.challengeProgressRow}>
                <View style={styles.challengeBar}>
                  <View style={[styles.challengeBarFill, { width: `${pct * 100}%` }]} />
                </View>
                <Text style={styles.challengeProgress}>{completed} / {ch.target}</Text>
              </View>
              {pct >= 1 && (
                <Text style={styles.challengeComplete}>
                  {isJp ? "チャレンジ達成！" : "Challenge Complete!"}
                </Text>
              )}
            </View>
          );
        })}
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
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.textPrimary, marginBottom: spacing.lg },

  // Streak banner
  streakBanner: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm,
    backgroundColor: colors.primary + "20", borderRadius: borderRadius.md, padding: spacing.sm,
    marginBottom: spacing.md,
  },
  streakBannerGlyph: { fontSize: 20 },
  streakBannerText: { color: colors.primary, fontSize: fontSize.md, fontWeight: "700" },

  // Level
  levelCard: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.lg, padding: spacing.lg,
    alignItems: "center", marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border,
  },
  levelTitle: { fontSize: fontSize.xl, fontWeight: "700", color: colors.primary },
  levelNumber: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md },
  xpBarBg: { width: "100%", height: 8, backgroundColor: colors.background, borderRadius: 4, overflow: "hidden" },
  xpBarFill: { height: 8, backgroundColor: colors.xp, borderRadius: 4 },
  xpText: { color: colors.xp, fontSize: fontSize.sm, fontWeight: "600", marginTop: spacing.xs },
  streakText: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.xs },

  // Daily reward
  rewardCard: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, padding: spacing.lg,
    alignItems: "center", gap: spacing.sm, borderWidth: 1, borderColor: colors.primary + "60",
  },
  rewardText: { color: colors.primary, fontSize: fontSize.md, fontWeight: "600" },
  rewardName: { color: colors.textSecondary, fontSize: fontSize.sm },
  rewardButton: {
    backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: "center",
  },
  rewardButtonText: { color: colors.background, fontSize: fontSize.md, fontWeight: "600" },

  // Journal
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  addButton: { color: colors.primary, fontSize: fontSize.sm, fontWeight: "600" },
  journalForm: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, padding: spacing.md,
    marginTop: spacing.sm, gap: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  journalLabel: { color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: "600" },
  moodRow: { flexDirection: "row", gap: spacing.xs },
  moodButton: {
    flex: 1, alignItems: "center", paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.border,
  },
  moodButtonActive: { borderColor: colors.primary, backgroundColor: colors.surface },
  moodGlyph: { fontSize: 20 },
  moodLabel: { color: colors.textMuted, fontSize: 8, marginTop: 2 },
  moodLabelActive: { color: colors.primary, fontWeight: "600" },
  journalInput: {
    backgroundColor: colors.surface, borderRadius: borderRadius.sm, padding: spacing.sm,
    color: colors.textPrimary, fontSize: fontSize.sm, minHeight: 60,
    borderWidth: 1, borderColor: colors.border,
  },
  journalSaveButton: {
    backgroundColor: colors.primary, borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm, alignItems: "center",
  },
  journalSaveText: { color: colors.background, fontSize: fontSize.sm, fontWeight: "600" },
  moodTrendCard: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, padding: spacing.md,
    marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  moodTrendTitle: { color: colors.textMuted, fontSize: fontSize.xs, marginBottom: spacing.xs },
  moodTrendRow: { flexDirection: "row", gap: spacing.lg, justifyContent: "center" },
  moodTrendItem: { alignItems: "center" },
  moodTrendGlyph: { fontSize: 20 },
  moodTrendCount: { color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: "600" },
  journalEntryCard: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.sm, padding: spacing.sm,
    marginTop: spacing.xs, borderWidth: 1, borderColor: colors.border,
  },
  journalEntryGlyph: { fontSize: 18 },
  journalEntryDate: { color: colors.textMuted, fontSize: fontSize.xs },
  journalEntryNote: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 1 },

  // Sections
  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: "600", color: colors.textPrimary, marginBottom: spacing.md },

  // Intention
  intentionButton: {
    backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: "center",
  },
  intentionDone: { backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.success },
  intentionButtonText: { color: colors.background, fontSize: fontSize.md, fontWeight: "600" },
  intentionDoneText: { color: colors.success },
  adWrap: { marginTop: spacing.md },

  // Skills
  skillRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  skillInfo: { flex: 1 },
  skillLabel: { color: colors.textPrimary, fontSize: fontSize.md },
  skillDetail: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 1 },
  skillDots: { flexDirection: "row", gap: spacing.xs },
  skillDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border,
  },
  skillDotFilled: { backgroundColor: colors.primary, borderColor: colors.primary },

  // Stats
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  statBox: {
    flex: 1, minWidth: "45%", backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md, padding: spacing.md, alignItems: "center",
    borderWidth: 1, borderColor: colors.border,
  },
  statValue: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.primary },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.xs, textAlign: "center" },

  // Achievements
  achievementCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, padding: spacing.md,
    marginBottom: spacing.xs, gap: spacing.md, borderWidth: 1, borderColor: colors.border, opacity: 0.5,
  },
  achievementEarned: { opacity: 1, borderColor: colors.primary },
  achievementIcon: { fontSize: fontSize.xl, color: colors.primary },
  achievementInfo: { flex: 1 },
  achievementLabel: { color: colors.textMuted, fontSize: fontSize.md, fontWeight: "600" },
  achievementLabelEarned: { color: colors.textPrimary },
  achievementDesc: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },

  // Challenges
  challengeCard: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  challengeName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600" },
  challengeDesc: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs, lineHeight: 20 },
  challengeProgressRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.md },
  challengeBar: { flex: 1, height: 6, backgroundColor: colors.background, borderRadius: 3, overflow: "hidden" },
  challengeBarFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  challengeProgress: { color: colors.primary, fontSize: fontSize.sm, fontWeight: "600" },
  challengeComplete: { color: colors.success, fontSize: fontSize.sm, fontWeight: "600", marginTop: spacing.sm, textAlign: "center" },
});
