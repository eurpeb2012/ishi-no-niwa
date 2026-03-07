import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useResponsive } from "../../hooks/useResponsive";
import { useStoneStore } from "../../stores/stoneStore";
import { useProgressionStore } from "../../stores/progressionStore";
import { useAuthStore } from "../../stores/authStore";
import { useCollectionStore } from "../../stores/collectionStore";
import { GemStone } from "../../components/common/GemStone";
import { SponsoredAd } from "../../components/common/SponsoredAd";
import { getAdForPlacement } from "../../data/mockAds";
import { getZodiacForBirthMonth } from "../../data/zodiac";
import type { Stone, ChakraId } from "../../types";

type ViewMode = "grid" | "chakra" | "collection";

const CHAKRA_FILTERS: { id: ChakraId; color: string; glyph: string }[] = [
  { id: "root", color: "#FF0000", glyph: "\u25CF" },
  { id: "sacral", color: "#FF7F00", glyph: "\u25CF" },
  { id: "solar_plexus", color: "#FFFF00", glyph: "\u25CF" },
  { id: "heart", color: "#00FF00", glyph: "\u25CF" },
  { id: "throat", color: "#0000FF", glyph: "\u25CF" },
  { id: "third_eye", color: "#4B0082", glyph: "\u25CF" },
  { id: "crown", color: "#8B00FF", glyph: "\u25CF" },
];

const CHAKRA_BODY = [
  { id: "crown" as ChakraId, y: 0.05, label_en: "Crown", label_jp: "第7" },
  { id: "third_eye" as ChakraId, y: 0.15, label_en: "Third Eye", label_jp: "第6" },
  { id: "throat" as ChakraId, y: 0.28, label_en: "Throat", label_jp: "第5" },
  { id: "heart" as ChakraId, y: 0.40, label_en: "Heart", label_jp: "第4" },
  { id: "solar_plexus" as ChakraId, y: 0.52, label_en: "Solar Plexus", label_jp: "第3" },
  { id: "sacral" as ChakraId, y: 0.64, label_en: "Sacral", label_jp: "第2" },
  { id: "root" as ChakraId, y: 0.78, label_en: "Root", label_jp: "第1" },
];

export default function StonesScreen() {
  const { t, i18n } = useTranslation();
  const { contentPadding, stoneColumns, isTablet, isDesktop } = useResponsive();
  const stoneStore = useStoneStore();
  const allStones = useStoneStore((s) => s.stones);
  const isUnlocked = useProgressionStore((s) => s.isStoneUnlocked);
  const user = useAuthStore((s) => s.user);
  const collection = useCollectionStore();
  const userLang = i18n.language;
  const isJp = userLang === "jp";
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const [detailTab, setDetailTab] = useState<"properties" | "lore" | "pairings">("properties");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [collectionTab, setCollectionTab] = useState<"owned" | "wishlist" | "favorites">("owned");

  const filteredStones = stoneStore.getFilteredStones();
  const zodiac = user ? getZodiacForBirthMonth(user.birthMonth) : null;

  const getPairings = (stone: Stone) => {
    return allStones
      .filter((s) => {
        if (s.id === stone.id) return false;
        const sharedChakra = s.chakras.some((c) => stone.chakras.includes(c));
        const sharedIntention = s.intentions.some((i) => stone.intentions.includes(i));
        return sharedChakra || sharedIntention;
      })
      .slice(0, 6);
  };

  const handleIdentify = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.alert(isJp
        ? "カメラで石を撮影して識別（近日対応）"
        : "Snap a photo to identify your crystal (coming soon)");
    }
  };

  const handleBuyStone = (stone: Stone) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.alert(isJp
        ? `${stone.name_jp}を購入: パートナーショップで検索（近日対応）`
        : `Buy ${stone.name_en}: Search partner shops (coming soon)`);
    }
  };

  const getCollectionStones = () => {
    switch (collectionTab) {
      case "owned": return allStones.filter((s) => collection.isOwned(s.id));
      case "wishlist": return allStones.filter((s) => collection.isWishlisted(s.id));
      case "favorites": return allStones.filter((s) => collection.isFavorite(s.id));
    }
  };

  const renderStoneCard = ({ item }: { item: Stone }) => {
    const unlocked = isUnlocked(item.id);
    return (
      <TouchableOpacity
        style={[styles.card, !unlocked && styles.cardLocked]}
        onPress={() => unlocked && setSelectedStone(item)}
      >
        <View style={styles.cardGemWrap}>
          {unlocked ? (
            <GemStone stoneId={item.id} colorHex={item.color_hex} size={32} />
          ) : (
            <View style={styles.cardDotLocked} />
          )}
        </View>
        <Text style={[styles.cardName, !unlocked && styles.textLocked]}>{item.name_en}</Text>
        <Text style={[styles.cardNameJp, !unlocked && styles.textLocked]}>{item.name_jp}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardRarity}>{item.rarity}</Text>
          {!unlocked && <Text style={styles.lockIcon}>Lv{item.unlock_level}</Text>}
          {collection.isFavorite(item.id) && <Text style={styles.favStar}>{"\u2605"}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const stoneDetailAd = selectedStone ? getAdForPlacement("stone_detail", selectedStone.id) : null;
  const libraryAd = getAdForPlacement("library_footer");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("stones.title")}</Text>

      {/* View mode tabs */}
      <View style={styles.viewModeRow}>
        {(["grid", "chakra", "collection"] as ViewMode[]).map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.viewModeTab, viewMode === mode && styles.viewModeTabActive]}
            onPress={() => setViewMode(mode)}
          >
            <Text style={[styles.viewModeText, viewMode === mode && styles.viewModeTextActive]}>
              {mode === "grid" ? t("stones.all")
                : mode === "chakra" ? t("stones.chakraView")
                : t("stones.collectionTab")}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.identifyButton} onPress={handleIdentify}>
          <Text style={styles.identifyText}>{t("stones.identify")}</Text>
        </TouchableOpacity>
      </View>

      {/* Zodiac birth crystals */}
      {zodiac && viewMode === "grid" && (
        <View style={styles.zodiacBar}>
          <Text style={styles.zodiacGlyph}>{zodiac.glyph}</Text>
          <Text style={styles.zodiacName}>{isJp ? zodiac.name_jp : zodiac.name_en}</Text>
          <View style={styles.zodiacStones}>
            {zodiac.stones.slice(0, 3).map((sid) => {
              const s = allStones.find((st) => st.id === sid);
              return s ? <GemStone key={sid} stoneId={s.id} colorHex={s.color_hex} size={18} /> : null;
            })}
          </View>
        </View>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={[styles.filterContent, { paddingHorizontal: contentPadding - 8 }]}>
            <TouchableOpacity
              style={[styles.filterChip, !stoneStore.filterChakra && styles.filterChipActive]}
              onPress={() => stoneStore.setFilterChakra(null)}
            >
              <Text style={styles.filterText}>{t("stones.all")}</Text>
            </TouchableOpacity>
            {CHAKRA_FILTERS.map((cf) => (
              <TouchableOpacity
                key={cf.id}
                style={[styles.filterChip, stoneStore.filterChakra === cf.id && styles.filterChipActive]}
                onPress={() => stoneStore.setFilterChakra(stoneStore.filterChakra === cf.id ? null : cf.id)}
              >
                <View style={[styles.filterDot, { backgroundColor: cf.color }]} />
                <Text style={styles.filterText}>{t(`chakras.${cf.id}`)}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.filterChip, stoneStore.filterJapanNative && styles.filterChipActive]}
              onPress={() => stoneStore.setFilterJapanNative(!stoneStore.filterJapanNative)}
            >
              <Text style={styles.filterText}>{t("stones.japanNative")}</Text>
            </TouchableOpacity>
          </ScrollView>
          <FlatList
            key={`grid-${stoneColumns}`}
            data={filteredStones}
            renderItem={renderStoneCard}
            keyExtractor={(item) => item.id}
            numColumns={stoneColumns}
            contentContainerStyle={[styles.grid, { paddingHorizontal: contentPadding - 8 }]}
            columnWrapperStyle={styles.gridRow}
            ListFooterComponent={
              <View style={styles.footerAd}>
                <SponsoredAd ad={libraryAd} placement="library_footer" />
              </View>
            }
          />
        </>
      )}

      {/* Chakra View */}
      {viewMode === "chakra" && (
        <ScrollView contentContainerStyle={styles.chakraContainer}>
          <View style={styles.chakraBody}>
            {/* Body silhouette */}
            <View style={styles.bodyLine} />
            {CHAKRA_BODY.map((ch) => {
              const chakraStones = allStones.filter((s) => s.chakras.includes(ch.id));
              const cf = CHAKRA_FILTERS.find((f) => f.id === ch.id);
              return (
                <View key={ch.id} style={[styles.chakraRow, { top: `${ch.y * 100}%` }]}>
                  <View style={[styles.chakraDot, { backgroundColor: cf?.color || "#fff" }]} />
                  <View style={styles.chakraInfo}>
                    <Text style={styles.chakraLabel}>{isJp ? ch.label_jp : ch.label_en}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.chakraStoneRow}>
                        {chakraStones.map((s) => (
                          <TouchableOpacity key={s.id} onPress={() => setSelectedStone(s)}>
                            <GemStone stoneId={s.id} colorHex={s.color_hex} size={24} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Collection View */}
      {viewMode === "collection" && (
        <>
          <View style={styles.collectionTabs}>
            {(["owned", "wishlist", "favorites"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.collectionTab, collectionTab === tab && styles.collectionTabActive]}
                onPress={() => setCollectionTab(tab)}
              >
                <Text style={[styles.collectionTabText, collectionTab === tab && styles.collectionTabTextActive]}>
                  {tab === "owned" ? t("stones.owned")
                    : tab === "wishlist" ? t("stones.wishlistTab")
                    : t("stones.favoritesTab")}
                </Text>
                <Text style={styles.collectionCount}>
                  {tab === "owned" ? collection.owned.length
                    : tab === "wishlist" ? collection.wishlist.length
                    : collection.favorites.length}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <FlatList
            key={`coll-${stoneColumns}`}
            data={getCollectionStones()}
            renderItem={renderStoneCard}
            keyExtractor={(item) => item.id}
            numColumns={stoneColumns}
            contentContainerStyle={[styles.grid, { paddingHorizontal: contentPadding - 8 }]}
            columnWrapperStyle={styles.gridRow}
            ListEmptyComponent={
              <View style={styles.emptyCollection}>
                <Text style={styles.emptyText}>
                  {isJp ? "まだ石がありません" : "No stones yet"}
                </Text>
              </View>
            }
          />
        </>
      )}

      {/* Stone Detail Modal */}
      <Modal visible={!!selectedStone} animationType="slide" transparent onRequestClose={() => setSelectedStone(null)}>
        {selectedStone && (
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedStone(null)}>
                <Text style={styles.modalCloseText}>X</Text>
              </TouchableOpacity>
              <View style={styles.modalGemWrap}>
                <GemStone stoneId={selectedStone.id} colorHex={selectedStone.color_hex} size={72} />
              </View>
              <Text style={styles.modalName}>{selectedStone.name_en}</Text>
              <Text style={styles.modalNameJp}>{selectedStone.name_jp}</Text>
              <Text style={styles.modalRarity}>{selectedStone.rarity}</Text>

              {/* Collection actions */}
              <View style={styles.collectionActions}>
                <TouchableOpacity
                  style={[styles.collAction, collection.isOwned(selectedStone.id) && styles.collActionActive]}
                  onPress={() => collection.isOwned(selectedStone.id) ? collection.removeOwned(selectedStone.id) : collection.addOwned(selectedStone.id)}
                >
                  <Text style={styles.collActionText}>{t("stones.owned")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.collAction, collection.isWishlisted(selectedStone.id) && styles.collActionActive]}
                  onPress={() => collection.isWishlisted(selectedStone.id) ? collection.removeWishlist(selectedStone.id) : collection.addWishlist(selectedStone.id)}
                >
                  <Text style={styles.collActionText}>{t("stones.wishlist")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.collAction, collection.isFavorite(selectedStone.id) && styles.collActionActive]}
                  onPress={() => collection.toggleFavorite(selectedStone.id)}
                >
                  <Text style={styles.collActionText}>
                    {collection.isFavorite(selectedStone.id) ? "\u2605" : "\u2606"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tabs */}
              <View style={styles.tabs}>
                {(["properties", "lore", "pairings"] as const).map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tab, detailTab === tab && styles.tabActive]}
                    onPress={() => setDetailTab(tab)}
                  >
                    <Text style={[styles.tabText, detailTab === tab && styles.tabTextActive]}>
                      {t(`stones.${tab}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <ScrollView style={styles.tabContent}>
                {detailTab === "properties" && (
                  <View style={styles.propList}>
                    <PropRow label={t("stones.chakra")} value={selectedStone.chakras.map((c) => t(`chakras.${c}`)).join(", ")} />
                    <PropRow label={t("stones.intention")} value={selectedStone.intentions.map((i) => t(`intentions.${i}`)).join(", ")} />
                    <PropRow label={t("stones.origin")} value={selectedStone.origin_japan ? `Japan (${selectedStone.origin_region})` : "International"} />
                    <PropRow label={t("stones.hardness")} value={`${selectedStone.hardness} Mohs`} />
                    <Text style={styles.description}>
                      {userLang === "jp" ? selectedStone.description_jp : selectedStone.description_en}
                    </Text>

                    {/* Buy button */}
                    <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyStone(selectedStone)}>
                      <Text style={styles.buyButtonText}>{t("stones.buyStone")}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {detailTab === "lore" && (
                  <Text style={styles.loreText}>
                    {userLang === "jp" ? selectedStone.lore_jp : selectedStone.lore_en}
                  </Text>
                )}
                {detailTab === "pairings" && (
                  <View style={styles.pairingsGrid}>
                    <Text style={styles.pairingsIntro}>
                      {userLang === "jp" ? "チャクラや意図を共有する石との組み合わせ" : "Stones that share chakras or intentions"}
                    </Text>
                    {getPairings(selectedStone).map((pair) => (
                      <TouchableOpacity
                        key={pair.id}
                        style={styles.pairingCard}
                        onPress={() => { setSelectedStone(pair); setDetailTab("properties"); }}
                      >
                        <GemStone stoneId={pair.id} colorHex={pair.color_hex} size={28} />
                        <View style={styles.pairingInfo}>
                          <Text style={styles.pairingName}>{pair.name_en}</Text>
                          <Text style={styles.pairingNameJp}>{pair.name_jp}</Text>
                        </View>
                        <Text style={styles.pairingMatch}>
                          {pair.chakras.filter((c) => selectedStone.chakras.includes(c)).length > 0 ? t("stones.chakra") : t("stones.intention")}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {stoneDetailAd && detailTab === "properties" && (
                  <View style={styles.detailAd}>
                    <SponsoredAd ad={stoneDetailAd} placement="stone_detail" />
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

function PropRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.propRow}>
      <Text style={styles.propLabel}>{label}</Text>
      <Text style={styles.propValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  title: {
    fontSize: fontSize.xxl, fontWeight: "700", color: colors.textPrimary,
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm,
  },

  // View mode
  viewModeRow: {
    flexDirection: "row", paddingHorizontal: spacing.md, gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  viewModeTab: {
    flex: 1, paddingVertical: spacing.xs, alignItems: "center",
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  viewModeTabActive: { borderColor: colors.primary, backgroundColor: colors.surface },
  viewModeText: { color: colors.textMuted, fontSize: 10 },
  viewModeTextActive: { color: colors.primary, fontWeight: "600" },
  identifyButton: {
    paddingVertical: spacing.xs, paddingHorizontal: spacing.sm,
    backgroundColor: colors.primary, borderRadius: borderRadius.sm,
  },
  identifyText: { color: colors.background, fontSize: 10, fontWeight: "600" },

  // Zodiac
  zodiacBar: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  zodiacGlyph: { fontSize: 18 },
  zodiacName: { color: colors.textSecondary, fontSize: fontSize.xs },
  zodiacStones: { flexDirection: "row", gap: spacing.xs, marginLeft: "auto" },

  // Filter
  filterRow: { maxHeight: 36, marginBottom: spacing.sm },
  filterContent: { paddingHorizontal: spacing.md, gap: spacing.xs },
  filterChip: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    gap: spacing.xs, borderWidth: 1, borderColor: colors.border,
  },
  filterChipActive: { borderColor: colors.primary, backgroundColor: colors.surface },
  filterDot: { width: 10, height: 10, borderRadius: 5 },
  filterText: { color: colors.textSecondary, fontSize: fontSize.xs },

  // Grid
  grid: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
  gridRow: { gap: spacing.sm, marginBottom: spacing.sm },
  card: {
    flex: 1, backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md,
    padding: spacing.sm, alignItems: "center", borderWidth: 1, borderColor: colors.border,
  },
  cardLocked: { opacity: 0.5 },
  cardGemWrap: { marginBottom: spacing.xs },
  cardDotLocked: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.textMuted },
  cardName: { color: colors.textPrimary, fontSize: fontSize.xs, fontWeight: "600", textAlign: "center" },
  cardNameJp: { color: colors.textSecondary, fontSize: 9, textAlign: "center" },
  cardMeta: { flexDirection: "row", gap: spacing.xs, marginTop: 2, alignItems: "center" },
  cardRarity: { color: colors.textMuted, fontSize: 8, textTransform: "uppercase" },
  lockIcon: { color: colors.primary, fontSize: 8, fontWeight: "700" },
  favStar: { color: colors.primary, fontSize: 10 },
  textLocked: { color: colors.textMuted },
  footerAd: { paddingHorizontal: spacing.sm, paddingTop: spacing.md, paddingBottom: spacing.xl },

  // Chakra view
  chakraContainer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  chakraBody: { height: 480, position: "relative" },
  bodyLine: {
    position: "absolute", left: "50%", top: "5%", bottom: "20%", width: 2,
    backgroundColor: colors.border, marginLeft: -1,
  },
  chakraRow: {
    position: "absolute", left: 0, right: 0, flexDirection: "row", alignItems: "center",
    gap: spacing.md, paddingHorizontal: spacing.md,
  },
  chakraDot: { width: 20, height: 20, borderRadius: 10 },
  chakraInfo: { flex: 1 },
  chakraLabel: { color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: "600", marginBottom: 2 },
  chakraStoneRow: { flexDirection: "row", gap: spacing.xs },

  // Collection
  collectionTabs: {
    flexDirection: "row", paddingHorizontal: spacing.md, gap: spacing.xs, marginBottom: spacing.sm,
  },
  collectionTab: {
    flex: 1, paddingVertical: spacing.sm, alignItems: "center",
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  collectionTabActive: { borderColor: colors.primary },
  collectionTabText: { color: colors.textMuted, fontSize: fontSize.xs },
  collectionTabTextActive: { color: colors.primary, fontWeight: "600" },
  collectionCount: { color: colors.textMuted, fontSize: 9, marginTop: 1 },
  emptyCollection: { alignItems: "center", paddingVertical: spacing.xxl },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md },

  // Modal
  modal: { flex: 1, backgroundColor: colors.overlay, justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg, padding: spacing.lg, maxHeight: "85%", alignItems: "center",
  },
  modalClose: { position: "absolute", top: spacing.md, right: spacing.md, zIndex: 1 },
  modalCloseText: { color: colors.textMuted, fontSize: fontSize.lg },
  modalGemWrap: { marginTop: spacing.md, marginBottom: spacing.md },
  modalName: { fontSize: fontSize.xl, fontWeight: "700", color: colors.textPrimary },
  modalNameJp: { fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.xs },
  modalRarity: { fontSize: fontSize.xs, color: colors.primary, textTransform: "uppercase", fontWeight: "600", marginBottom: spacing.sm },

  // Collection actions
  collectionActions: {
    flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md,
  },
  collAction: {
    paddingVertical: spacing.xs, paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.border,
  },
  collActionActive: { borderColor: colors.primary, backgroundColor: colors.primary + "20" },
  collActionText: { color: colors.textSecondary, fontSize: fontSize.xs },

  // Tabs
  tabs: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.md, width: "100%" },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: fontSize.sm },
  tabTextActive: { color: colors.primary, fontWeight: "600" },
  tabContent: { width: "100%", maxHeight: 300 },
  propList: { gap: spacing.sm },
  propRow: { flexDirection: "row", justifyContent: "space-between" },
  propLabel: { color: colors.textMuted, fontSize: fontSize.sm },
  propValue: { color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: "500", flex: 1, textAlign: "right" },
  description: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 20, marginTop: spacing.sm },
  buyButton: {
    backgroundColor: colors.secondary, borderRadius: borderRadius.md,
    paddingVertical: spacing.sm, alignItems: "center", marginTop: spacing.md,
  },
  buyButtonText: { color: "#fff", fontSize: fontSize.sm, fontWeight: "600" },
  loreText: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 22 },
  detailAd: { marginTop: spacing.lg },
  pairingsGrid: { gap: spacing.sm },
  pairingsIntro: { color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.sm },
  pairingCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md, padding: spacing.sm, gap: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  pairingInfo: { flex: 1 },
  pairingName: { color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: "500" },
  pairingNameJp: { color: colors.textMuted, fontSize: fontSize.xs },
  pairingMatch: { color: colors.primary, fontSize: fontSize.xs, fontWeight: "600" },
});
