import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useCanvasStore } from "../../stores/canvasStore";
import { useStoneStore } from "../../stores/stoneStore";
import { GemStone } from "../../components/common/GemStone";

type Tab = "gallery" | "shared" | "workshops";

// Mock community grids for the gallery
const COMMUNITY_GRIDS = [
  { id: "c1", author: "Sakura", authorJp: "さくら", name: "Heart Harmony", nameJp: "心の調和", intention: "love", likes: 42, stones: ["rose_quartz", "rhodonite", "moonstone"] },
  { id: "c2", author: "Kenji", authorJp: "健二", name: "Focus Grid", nameJp: "集中の陣", intention: "career", likes: 31, stones: ["fluorite", "lapis_lazuli", "citrine"] },
  { id: "c3", author: "Yuki", authorJp: "雪", name: "Protection Circle", nameJp: "守護の輪", intention: "protection", likes: 28, stones: ["black_tourmaline", "smoky_quartz", "black_obsidian"] },
  { id: "c4", author: "Hana", authorJp: "花", name: "Moonlight Calm", nameJp: "月光の静寂", intention: "calm", likes: 55, stones: ["amethyst", "moonstone", "prehnite"] },
  { id: "c5", author: "Ryo", authorJp: "涼", name: "Abundance Flow", nameJp: "豊穣の流れ", intention: "prosperity", likes: 37, stones: ["citrine", "green_aventurine", "tigers_eye"] },
  { id: "c6", author: "Mika", authorJp: "美花", name: "Spiritual Ascent", nameJp: "精神の上昇", intention: "spiritual", likes: 44, stones: ["sugilite", "labradorite", "amethyst"] },
];

const WORKSHOPS = [
  { id: "w1", title_en: "Full Moon Crystal Charging", title_jp: "満月クリスタル浄化", host: "Master Tanaka", date: "Mar 14", spots: 12, price: "Free" },
  { id: "w2", title_en: "Beginner's Grid Workshop", title_jp: "初心者グリッドワークショップ", host: "Sensei Yuki", date: "Mar 21", spots: 8, price: "$9.99" },
  { id: "w3", title_en: "Advanced Sacred Geometry", title_jp: "上級神聖幾何学", host: "Master Sato", date: "Mar 28", spots: 6, price: "$19.99" },
  { id: "w4", title_en: "Group Meditation Circle", title_jp: "グループ瞑想サークル", host: "Sensei Hana", date: "Apr 4", spots: 20, price: "Free" },
];

export default function CommunityScreen() {
  const { t, i18n } = useTranslation();
  const isJp = i18n.language === "jp";
  const savedGrids = useCanvasStore((s) => s.savedGrids);
  const shareGrid = useCanvasStore((s) => s.shareGrid);
  const getStone = useStoneStore((s) => s.getStone);
  const [activeTab, setActiveTab] = useState<Tab>("gallery");
  const [likedGrids, setLikedGrids] = useState<Set<string>>(new Set());

  const sharedGrids = savedGrids.filter((g) => g.isShared);

  const toggleLike = (gridId: string) => {
    setLikedGrids((prev) => {
      const next = new Set(prev);
      if (next.has(gridId)) next.delete(gridId);
      else next.add(gridId);
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isJp ? "コミュニティ" : "Community"}</Text>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {(["gallery", "shared", "workshops"] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === "gallery"
                ? isJp ? "ギャラリー" : "Gallery"
                : tab === "shared"
                ? isJp ? "あなたの共有" : "Your Shared"
                : isJp ? "ワークショップ" : "Workshops"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Community Gallery */}
        {activeTab === "gallery" && (
          <>
            <Text style={styles.sectionSubtitle}>
              {isJp ? "みんなのクリスタルグリッド" : "Community Crystal Grids"}
            </Text>
            {COMMUNITY_GRIDS.map((grid) => (
              <View key={grid.id} style={styles.gridCard}>
                <View style={styles.gridHeader}>
                  <View>
                    <Text style={styles.gridName}>{isJp ? grid.nameJp : grid.name}</Text>
                    <Text style={styles.gridAuthor}>
                      {isJp ? "by " : "by "}
                      {isJp ? grid.authorJp : grid.author}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleLike(grid.id)}>
                    <Text style={[styles.likeButton, likedGrids.has(grid.id) && styles.liked]}>
                      {likedGrids.has(grid.id) ? "★" : "☆"} {grid.likes + (likedGrids.has(grid.id) ? 1 : 0)}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.gridStones}>
                  {grid.stones.map((sid) => {
                    const stone = getStone(sid);
                    if (!stone) return null;
                    return (
                      <View key={sid} style={styles.gridStoneItem}>
                        <GemStone stoneId={stone.id} colorHex={stone.color_hex} size={28} />
                        <Text style={styles.gridStoneName}>{isJp ? stone.name_jp : stone.name_en}</Text>
                      </View>
                    );
                  })}
                </View>
                <Text style={styles.gridIntention}>
                  {t(`intentions.${grid.intention}`)}
                </Text>
              </View>
            ))}

            {/* Mentorship section */}
            <View style={styles.mentorSection}>
              <Text style={styles.sectionTitle}>
                {isJp ? "クリスタルガイド" : "Crystal Guides"}
              </Text>
              <Text style={styles.mentorDesc}>
                {isJp
                  ? "経験豊富なクリスタルプラクティショナーとつながりましょう"
                  : "Connect with experienced crystal practitioners"}
              </Text>
              {[
                { name: "Master Tanaka", nameJp: "田中師範", specialty_en: "Sacred Geometry", specialty_jp: "神聖幾何学", level: 20 },
                { name: "Sensei Yuki", nameJp: "雪先生", specialty_en: "Chakra Healing", specialty_jp: "チャクラヒーリング", level: 18 },
              ].map((guide) => (
                <View key={guide.name} style={styles.mentorCard}>
                  <View style={styles.mentorAvatar}>
                    <Text style={styles.mentorAvatarText}>
                      {guide.nameJp.charAt(0)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mentorName}>{isJp ? guide.nameJp : guide.name}</Text>
                    <Text style={styles.mentorSpecialty}>
                      {isJp ? guide.specialty_jp : guide.specialty_en}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.connectButton}>
                    <Text style={styles.connectText}>{isJp ? "相談" : "Connect"}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Your Shared Grids */}
        {activeTab === "shared" && (
          <>
            {sharedGrids.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>☆</Text>
                <Text style={styles.emptyText}>
                  {isJp
                    ? "庭で陣を保存し、ここで共有しましょう"
                    : "Save grids in the garden and share them here"}
                </Text>
              </View>
            ) : (
              sharedGrids.map((grid) => (
                <View key={grid.id} style={styles.gridCard}>
                  <Text style={styles.gridName}>{grid.name}</Text>
                  <Text style={styles.gridIntention}>
                    {grid.intention ? t(`intentions.${grid.intention}`) : ""}
                  </Text>
                  <Text style={styles.gridMeta}>
                    {grid.placements.length} stones · {grid.favoriteCount} likes
                  </Text>
                </View>
              ))
            )}
            {/* Share unshared grids */}
            {savedGrids.filter((g) => !g.isShared).length > 0 && (
              <View style={styles.shareSection}>
                <Text style={styles.sectionTitle}>
                  {isJp ? "共有していない陣" : "Unshared Grids"}
                </Text>
                {savedGrids.filter((g) => !g.isShared).map((grid) => (
                  <View key={grid.id} style={styles.shareRow}>
                    <Text style={styles.shareName}>{grid.name}</Text>
                    <TouchableOpacity
                      style={styles.shareButton}
                      onPress={() => shareGrid(grid.id)}
                    >
                      <Text style={styles.shareButtonText}>
                        {isJp ? "共有" : "Share"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Workshops */}
        {activeTab === "workshops" && (
          <>
            <Text style={styles.sectionSubtitle}>
              {isJp ? "今後のワークショップ" : "Upcoming Workshops"}
            </Text>
            {WORKSHOPS.map((ws) => (
              <View key={ws.id} style={styles.workshopCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.workshopTitle}>
                    {isJp ? ws.title_jp : ws.title_en}
                  </Text>
                  <Text style={styles.workshopHost}>{ws.host}</Text>
                  <Text style={styles.workshopMeta}>
                    {ws.date} · {ws.spots} {isJp ? "席" : "spots"} · {ws.price}
                  </Text>
                </View>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinText}>{isJp ? "参加" : "Join"}</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Group sessions placeholder */}
            <View style={styles.groupSection}>
              <Text style={styles.sectionTitle}>
                {isJp ? "グループセッション" : "Group Sessions"}
              </Text>
              <Text style={styles.groupDesc}>
                {isJp
                  ? "リアルタイムで他のユーザーと一緒にクリスタルグリッドを作成しましょう。近日公開！"
                  : "Create crystal grids together with other users in real-time. Coming soon!"}
              </Text>
              <TouchableOpacity style={styles.notifyButton}>
                <Text style={styles.notifyText}>
                  {isJp ? "通知を受け取る" : "Notify Me"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  title: {
    fontSize: fontSize.xxl, fontWeight: "700", color: colors.textPrimary,
    paddingHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  tabBar: {
    flexDirection: "row", paddingHorizontal: spacing.lg, gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1, paddingVertical: spacing.sm, alignItems: "center",
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border,
  },
  tabActive: { borderColor: colors.primary, backgroundColor: colors.surface },
  tabText: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: "500" },
  tabTextActive: { color: colors.primary, fontWeight: "600" },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: {
    fontSize: fontSize.lg, fontWeight: "600", color: colors.textPrimary,
    marginBottom: spacing.sm, marginTop: spacing.lg,
  },
  sectionSubtitle: {
    fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.md,
  },
  gridCard: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md,
    padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  gridHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  gridName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600" },
  gridAuthor: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  likeButton: { color: colors.textMuted, fontSize: fontSize.md },
  liked: { color: colors.primary },
  gridStones: {
    flexDirection: "row", gap: spacing.md, marginBottom: spacing.sm, flexWrap: "wrap",
  },
  gridStoneItem: { alignItems: "center", gap: 2 },
  gridStoneName: { color: colors.textMuted, fontSize: 8 },
  gridIntention: { color: colors.primary, fontSize: fontSize.xs, fontWeight: "500" },
  gridMeta: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs },
  emptyState: {
    alignItems: "center", paddingVertical: spacing.xxl,
  },
  emptyIcon: { fontSize: 48, color: colors.textMuted, marginBottom: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md, textAlign: "center" },
  shareSection: { marginTop: spacing.lg },
  shareRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md,
    padding: spacing.md, marginBottom: spacing.xs,
    borderWidth: 1, borderColor: colors.border,
  },
  shareName: { color: colors.textPrimary, fontSize: fontSize.sm },
  shareButton: {
    backgroundColor: colors.primary, borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
  },
  shareButtonText: { color: colors.background, fontSize: fontSize.xs, fontWeight: "600" },
  mentorSection: { marginTop: spacing.lg },
  mentorDesc: { color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.md },
  mentorCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md,
    padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  mentorAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primary, alignItems: "center", justifyContent: "center",
  },
  mentorAvatarText: { color: colors.background, fontSize: fontSize.lg, fontWeight: "700" },
  mentorName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600" },
  mentorSpecialty: { color: colors.textMuted, fontSize: fontSize.xs },
  connectButton: {
    backgroundColor: colors.surface, borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
    borderWidth: 1, borderColor: colors.primary,
  },
  connectText: { color: colors.primary, fontSize: fontSize.xs, fontWeight: "600" },
  workshopCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md,
    padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  workshopTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600" },
  workshopHost: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  workshopMeta: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: spacing.xs },
  joinButton: {
    backgroundColor: colors.primary, borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
  },
  joinText: { color: colors.background, fontSize: fontSize.sm, fontWeight: "600" },
  groupSection: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.lg,
    padding: spacing.lg, marginTop: spacing.lg,
    borderWidth: 1, borderColor: colors.primary + "40",
    alignItems: "center",
  },
  groupDesc: {
    color: colors.textSecondary, fontSize: fontSize.sm, textAlign: "center",
    lineHeight: 20, marginBottom: spacing.md,
  },
  notifyButton: {
    backgroundColor: colors.primary, borderRadius: borderRadius.md,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.xl,
  },
  notifyText: { color: colors.background, fontSize: fontSize.md, fontWeight: "600" },
});
