import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useStoneStore } from "../../stores/stoneStore";
import { useProgressionStore } from "../../stores/progressionStore";
import { useAuthStore } from "../../stores/authStore";
import { GemStone } from "../../components/common/GemStone";
import { SponsoredAd } from "../../components/common/SponsoredAd";
import { getAdForPlacement } from "../../data/mockAds";
import type { Stone, ChakraId } from "../../types";

const CHAKRA_FILTERS: { id: ChakraId; color: string }[] = [
  { id: "root", color: "#FF0000" },
  { id: "sacral", color: "#FF7F00" },
  { id: "solar_plexus", color: "#FFFF00" },
  { id: "heart", color: "#00FF00" },
  { id: "throat", color: "#0000FF" },
  { id: "third_eye", color: "#4B0082" },
  { id: "crown", color: "#8B00FF" },
];

export default function StonesScreen() {
  const { t, i18n } = useTranslation();
  const stoneStore = useStoneStore();
  const allStones = useStoneStore((s) => s.stones);
  const isUnlocked = useProgressionStore((s) => s.isStoneUnlocked);
  const userLang = i18n.language;
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const [detailTab, setDetailTab] = useState<
    "properties" | "lore" | "pairings"
  >("properties");

  const filteredStones = stoneStore.getFilteredStones();

  // Compute pairings: stones sharing chakras or intentions with selected stone
  const getPairings = (stone: Stone) => {
    return allStones
      .filter((s) => {
        if (s.id === stone.id) return false;
        const sharedChakra = s.chakras.some((c) => stone.chakras.includes(c));
        const sharedIntention = s.intentions.some((i) =>
          stone.intentions.includes(i)
        );
        return sharedChakra || sharedIntention;
      })
      .slice(0, 6);
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
            <GemStone
              stoneId={item.id}
              colorHex={item.color_hex}
              size={32}
            />
          ) : (
            <View style={styles.cardDotLocked} />
          )}
        </View>
        <Text style={[styles.cardName, !unlocked && styles.textLocked]}>
          {item.name_en}
        </Text>
        <Text style={[styles.cardNameJp, !unlocked && styles.textLocked]}>
          {item.name_jp}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardRarity}>{item.rarity}</Text>
          {!unlocked && (
            <Text style={styles.lockIcon}>Lv{item.unlock_level}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const stoneDetailAd = selectedStone
    ? getAdForPlacement("stone_detail", selectedStone.id)
    : null;
  const libraryAd = getAdForPlacement("library_footer");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("stones.title")}</Text>

      {/* Chakra Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !stoneStore.filterChakra && styles.filterChipActive,
          ]}
          onPress={() => stoneStore.setFilterChakra(null)}
        >
          <Text style={styles.filterText}>{t("stones.all")}</Text>
        </TouchableOpacity>
        {CHAKRA_FILTERS.map((cf) => (
          <TouchableOpacity
            key={cf.id}
            style={[
              styles.filterChip,
              stoneStore.filterChakra === cf.id && styles.filterChipActive,
            ]}
            onPress={() =>
              stoneStore.setFilterChakra(
                stoneStore.filterChakra === cf.id ? null : cf.id
              )
            }
          >
            <View
              style={[styles.filterDot, { backgroundColor: cf.color }]}
            />
            <Text style={styles.filterText}>{t(`chakras.${cf.id}`)}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.filterChip,
            stoneStore.filterJapanNative && styles.filterChipActive,
          ]}
          onPress={() =>
            stoneStore.setFilterJapanNative(!stoneStore.filterJapanNative)
          }
        >
          <Text style={styles.filterText}>{t("stones.japanNative")}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Stone Grid */}
      <FlatList
        data={filteredStones}
        renderItem={renderStoneCard}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        ListFooterComponent={
          <View style={styles.footerAd}>
            <SponsoredAd ad={libraryAd} placement="library_footer" />
          </View>
        }
      />

      {/* Stone Detail Modal */}
      <Modal
        visible={!!selectedStone}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedStone(null)}
      >
        {selectedStone && (
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setSelectedStone(null)}
              >
                <Text style={styles.modalCloseText}>X</Text>
              </TouchableOpacity>

              <View style={styles.modalGemWrap}>
                <GemStone
                  stoneId={selectedStone.id}
                  colorHex={selectedStone.color_hex}
                  size={72}
                />
              </View>
              <Text style={styles.modalName}>{selectedStone.name_en}</Text>
              <Text style={styles.modalNameJp}>{selectedStone.name_jp}</Text>
              <Text style={styles.modalRarity}>{selectedStone.rarity}</Text>

              {/* Tabs */}
              <View style={styles.tabs}>
                {(["properties", "lore", "pairings"] as const).map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tab,
                      detailTab === tab && styles.tabActive,
                    ]}
                    onPress={() => setDetailTab(tab)}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        detailTab === tab && styles.tabTextActive,
                      ]}
                    >
                      {t(`stones.${tab}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <ScrollView style={styles.tabContent}>
                {detailTab === "properties" && (
                  <View style={styles.propList}>
                    <PropRow
                      label={t("stones.chakra")}
                      value={selectedStone.chakras
                        .map((c) => t(`chakras.${c}`))
                        .join(", ")}
                    />
                    <PropRow
                      label={t("stones.intention")}
                      value={selectedStone.intentions
                        .map((i) => t(`intentions.${i}`))
                        .join(", ")}
                    />
                    <PropRow
                      label={t("stones.origin")}
                      value={
                        selectedStone.origin_japan
                          ? `Japan (${selectedStone.origin_region})`
                          : "International"
                      }
                    />
                    <PropRow
                      label={t("stones.hardness")}
                      value={`${selectedStone.hardness} Mohs`}
                    />
                    <Text style={styles.description}>
                      {userLang === "jp"
                        ? selectedStone.description_jp
                        : selectedStone.description_en}
                    </Text>
                  </View>
                )}
                {detailTab === "lore" && (
                  <Text style={styles.loreText}>
                    {userLang === "jp"
                      ? selectedStone.lore_jp
                      : selectedStone.lore_en}
                  </Text>
                )}
                {detailTab === "pairings" && (
                  <View style={styles.pairingsGrid}>
                    <Text style={styles.pairingsIntro}>
                      {userLang === "jp"
                        ? "チャクラや意図を共有する石との組み合わせ"
                        : "Stones that share chakras or intentions"}
                    </Text>
                    {getPairings(selectedStone).map((pair) => (
                      <TouchableOpacity
                        key={pair.id}
                        style={styles.pairingCard}
                        onPress={() => {
                          setSelectedStone(pair);
                          setDetailTab("properties");
                        }}
                      >
                        <GemStone
                          stoneId={pair.id}
                          colorHex={pair.color_hex}
                          size={28}
                        />
                        <View style={styles.pairingInfo}>
                          <Text style={styles.pairingName}>
                            {pair.name_en}
                          </Text>
                          <Text style={styles.pairingNameJp}>
                            {pair.name_jp}
                          </Text>
                        </View>
                        <Text style={styles.pairingMatch}>
                          {pair.chakras.filter((c) =>
                            selectedStone.chakras.includes(c)
                          ).length > 0
                            ? t("stones.chakra")
                            : t("stones.intention")}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Ad in stone detail */}
                {stoneDetailAd && detailTab === "properties" && (
                  <View style={styles.detailAd}>
                    <SponsoredAd
                      ad={stoneDetailAd}
                      placement="stone_detail"
                    />
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filterRow: {
    maxHeight: 44,
    marginBottom: spacing.md,
  },
  filterContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  filterDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  grid: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  gridRow: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLocked: {
    opacity: 0.5,
  },
  cardGemWrap: {
    marginBottom: spacing.xs,
  },
  cardDotLocked: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.textMuted,
  },
  cardName: {
    color: colors.textPrimary,
    fontSize: fontSize.xs,
    fontWeight: "600",
    textAlign: "center",
  },
  cardNameJp: {
    color: colors.textSecondary,
    fontSize: 9,
    textAlign: "center",
  },
  cardMeta: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: 2,
  },
  cardRarity: {
    color: colors.textMuted,
    fontSize: 8,
    textTransform: "uppercase",
  },
  lockIcon: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: "700",
  },
  textLocked: {
    color: colors.textMuted,
  },
  footerAd: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  modal: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
    maxHeight: "85%",
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    zIndex: 1,
  },
  modalCloseText: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
  },
  modalGemWrap: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  modalName: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  modalNameJp: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  modalRarity: {
    fontSize: fontSize.xs,
    color: colors.primary,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  tabs: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  tabContent: {
    width: "100%",
    maxHeight: 300,
  },
  propList: {
    gap: spacing.sm,
  },
  propRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  propLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  propValue: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  loreText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
  detailAd: {
    marginTop: spacing.lg,
  },
  pairingsGrid: {
    gap: spacing.sm,
  },
  pairingsIntro: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  pairingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pairingInfo: {
    flex: 1,
  },
  pairingName: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: "500",
  },
  pairingNameJp: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  pairingMatch: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
});
