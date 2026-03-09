import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useResponsive } from "../../hooks/useResponsive";
import { useAuthStore } from "../../stores/authStore";
import { useStoneStore } from "../../stores/stoneStore";
import { useProgressionStore } from "../../stores/progressionStore";
import { useCanvasStore } from "../../stores/canvasStore";
import { useCollectionStore } from "../../stores/collectionStore";
import { GemStone } from "../../components/common/GemStone";
import { CrystalFairy } from "../../components/common/CrystalFairy";
import { getZodiacForBirthMonth } from "../../data/zodiac";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const responsive = useResponsive();
  const { contentPadding, isTablet, isDesktop } = responsive;
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const getStone = useStoneStore((s) => s.getStone);
  const level = useProgressionStore((s) => s.progress.level);
  const collection = useCollectionStore();
  const savedGrids = useCanvasStore((s) => s.savedGrids);
  const isJp = i18n.language === "jp";

  const avatarStone = user ? getStone(user.avatarStoneId) : null;
  const levelTitle = t(`levels.${level}`) || `Level ${level}`;
  const zodiac = user ? getZodiacForBirthMonth(user.birthMonth) : null;
  const allStones = useStoneStore((s) => s.stones);
  const profileGrid = savedGrids.find((g) => g.id === user?.profileGridId) || null;

  const handleSetWallpaper = (gridId: string) => {
    const newId = user?.profileGridId === gridId ? null : gridId;
    updateProfile({ profileGridId: newId });
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "jp" : "en";
    i18n.changeLanguage(newLang);
    updateProfile({ language: newLang as "en" | "jp" });
  };

  const handleSignOut = async () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("ishi-auth");
        window.localStorage.removeItem("ishi-progression");
        window.localStorage.removeItem("ishi-canvas");
        window.localStorage.removeItem("ishi-insights");
        window.localStorage.removeItem("ishi-collection");
        window.localStorage.removeItem("ishi-journal");
      } catch (_) {}
      window.location.replace("/ishi-no-niwa/");
    } else {
      await AsyncStorage.multiRemove([
        "ishi-auth", "ishi-progression", "ishi-canvas",
        "ishi-insights", "ishi-collection", "ishi-journal",
      ]);
      signOut();
      router.replace("/(auth)/login");
    }
  };

  const handleShop = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.alert(isJp
        ? "パートナーストアからクリスタルを購入（近日対応）"
        : "Browse partner crystal shops (coming soon)");
    }
  };

  const handlePrint = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.alert(isJp
        ? "グリッドテンプレートをPDFで印刷（近日対応）"
        : "Print your grid template as PDF (coming soon)");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingHorizontal: contentPadding }]}>
      <Text style={[styles.title, (isTablet || isDesktop) && { fontSize: 32 }]}>{t("profile.title")}</Text>

      {/* Profile Card with optional grid wallpaper */}
      <View style={styles.profileCard}>
        {/* Grid wallpaper background */}
        {profileGrid && (
          <View style={styles.wallpaperBg}>
            {profileGrid.placements.map((p, i) => {
              const s = allStones.find((st) => st.id === p.stoneId);
              if (!s) return null;
              return (
                <View key={i} style={{
                  position: "absolute",
                  left: `${p.x * 100}%`,
                  top: `${p.y * 100}%`,
                  marginLeft: -10,
                  marginTop: -10,
                  opacity: 0.35,
                }}>
                  <GemStone stoneId={s.id} colorHex={s.color_hex} size={20} />
                </View>
              );
            })}
          </View>
        )}
        {avatarStone ? (
          <View style={{ alignItems: "center", zIndex: 2 }}>
            <CrystalFairy colorHex={avatarStone.color_hex} size={80} level={level} isStatic />
            <View style={{ marginTop: 4 }}>
              <GemStone stoneId={avatarStone.id} colorHex={avatarStone.color_hex} size={36} />
            </View>
          </View>
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.primary, zIndex: 2 }]}>
            <Text style={styles.avatarText}>{"\u77F3"}</Text>
          </View>
        )}
        <Text style={[styles.displayName, { zIndex: 2 }]}>{user?.displayName || "Guest"}</Text>
        <Text style={[styles.email, { zIndex: 2 }]}>{user?.email}</Text>
        <Text style={[styles.levelBadge, { zIndex: 2 }]}>{levelTitle}</Text>
      </View>

      {/* Zodiac & Birth Crystals */}
      {zodiac && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profile.zodiac")}</Text>
          <View style={styles.zodiacCard}>
            <Text style={styles.zodiacGlyph}>{zodiac.glyph}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.zodiacName}>{isJp ? zodiac.name_jp : zodiac.name_en}</Text>
              <Text style={styles.zodiacElement}>
                {isJp ? zodiac.element_jp : zodiac.element_en} · {isJp ? zodiac.rulingPlanet_jp : zodiac.rulingPlanet_en}
              </Text>
            </View>
          </View>
          <Text style={styles.birthCrystalsLabel}>{t("profile.birthCrystals")}</Text>
          <View style={styles.birthCrystalsRow}>
            {zodiac.stones.map((sid) => {
              const s = allStones.find((st) => st.id === sid);
              if (!s) return null;
              return (
                <View key={sid} style={styles.birthCrystalItem}>
                  <GemStone stoneId={s.id} colorHex={s.color_hex} size={32} />
                  <Text style={styles.birthCrystalName}>{isJp ? s.name_jp : s.name_en}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Collection Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.collectionStats")}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{collection.owned.length}</Text>
            <Text style={styles.statLabel}>{t("profile.owned")}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{collection.wishlist.length}</Text>
            <Text style={styles.statLabel}>{t("profile.wishlisted")}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{collection.favorites.length}</Text>
            <Text style={styles.statLabel}>{t("profile.favorited")}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{savedGrids.length}</Text>
            <Text style={styles.statLabel}>{isJp ? "保存した陣" : "Grids"}</Text>
          </View>
        </View>
      </View>

      {/* Profile Wallpaper — choose a saved grid */}
      {savedGrids.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isJp ? "プロフィール壁紙" : "Profile Wallpaper"}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
            {savedGrids.map((grid) => (
              <TouchableOpacity
                key={grid.id}
                onPress={() => handleSetWallpaper(grid.id)}
                style={[
                  styles.wallpaperThumb,
                  user?.profileGridId === grid.id && styles.wallpaperThumbActive,
                ]}
              >
                <View style={styles.wallpaperPreview}>
                  {grid.placements.slice(0, 8).map((p, i) => {
                    const s = allStones.find((st) => st.id === p.stoneId);
                    if (!s) return null;
                    return (
                      <View key={i} style={{
                        position: "absolute",
                        left: `${p.x * 100}%`,
                        top: `${p.y * 100}%`,
                        marginLeft: -5,
                        marginTop: -5,
                      }}>
                        <GemStone stoneId={s.id} colorHex={s.color_hex} size={10} />
                      </View>
                    );
                  })}
                </View>
                <Text style={styles.wallpaperLabel} numberOfLines={1}>
                  {grid.name || (isJp ? "グリッド" : "Grid")}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Subscription */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.subscription")}</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t("profile.currentPlan")}</Text>
          <Text style={styles.rowValue}>
            {t(`subscription.${user?.subscriptionTier || "free"}`)}
          </Text>
        </View>
        {user?.subscriptionTier === "free" && (
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeText}>{t("profile.upgrade")}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.row} onPress={handleShop}>
          <Text style={styles.rowLabel}>{t("profile.shop")}</Text>
          <Text style={styles.rowValue}>{"\u2192"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={handlePrint}>
          <Text style={styles.rowLabel}>{t("profile.printGrid")}</Text>
          <Text style={styles.rowValue}>{"\u2192"}</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.settings")}</Text>
        <TouchableOpacity style={styles.row} onPress={toggleLanguage}>
          <Text style={styles.rowLabel}>{t("profile.language")}</Text>
          <Text style={styles.rowValue}>
            {i18n.language === "en" ? "English" : "\u65E5\u672C\u8A9E"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>{t("profile.notifications")}</Text>
          <Text style={styles.rowValue}>On</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>{t("profile.haptics")}</Text>
          <Text style={styles.rowValue}>On</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.row} onPress={handleSignOut}>
          <Text style={styles.signOutText}>{t("profile.signOut")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.deleteText}>{t("profile.deleteAccount")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.textPrimary, marginBottom: spacing.lg },
  profileCard: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.lg, padding: spacing.xl,
    alignItems: "center", marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border,
    position: "relative" as const, overflow: "hidden" as const,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  avatarText: { color: "#fff", fontSize: fontSize.xxl, fontWeight: "700", textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  displayName: { fontSize: fontSize.xl, fontWeight: "600", color: colors.textPrimary },
  email: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs },
  levelBadge: {
    fontSize: fontSize.sm, color: colors.primary, fontWeight: "600", marginTop: spacing.sm,
    backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full, overflow: "hidden",
  },

  // Zodiac
  zodiacCard: {
    flexDirection: "row", alignItems: "center", gap: spacing.md,
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  zodiacGlyph: { fontSize: 32 },
  zodiacName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600" },
  zodiacElement: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  birthCrystalsLabel: {
    color: colors.textMuted, fontSize: fontSize.xs, textTransform: "uppercase",
    letterSpacing: 1, marginTop: spacing.md, marginBottom: spacing.xs,
  },
  birthCrystalsRow: { flexDirection: "row", gap: spacing.lg },
  birthCrystalItem: { alignItems: "center", gap: spacing.xs },
  birthCrystalName: { color: colors.textSecondary, fontSize: 9, textAlign: "center" },

  // Stats
  statsRow: { flexDirection: "row", gap: spacing.sm },
  statItem: {
    flex: 1, backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md,
    padding: spacing.sm, alignItems: "center", borderWidth: 1, borderColor: colors.border,
  },
  statValue: { fontSize: fontSize.xl, fontWeight: "700", color: colors.primary },
  statLabel: { fontSize: 9, color: colors.textMuted, marginTop: 2, textAlign: "center" },

  // Sections
  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: "600", color: colors.textPrimary, marginBottom: spacing.sm },
  row: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: colors.surfaceLight, padding: spacing.md, borderRadius: borderRadius.md,
    marginBottom: spacing.xs, borderWidth: 1, borderColor: colors.border,
  },
  rowLabel: { color: colors.textPrimary, fontSize: fontSize.md },
  rowValue: { color: colors.textSecondary, fontSize: fontSize.md },
  upgradeButton: {
    backgroundColor: colors.primary, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: "center", marginTop: spacing.sm,
  },
  upgradeText: { color: colors.buttonText, fontSize: fontSize.md, fontWeight: "600" },
  signOutText: { color: colors.textSecondary, fontSize: fontSize.md },
  deleteText: { color: colors.error, fontSize: fontSize.md },

  // Wallpaper
  wallpaperBg: {
    position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: borderRadius.lg, overflow: "hidden" as const, zIndex: 1,
  },
  wallpaperThumb: {
    width: 72, height: 72, borderRadius: borderRadius.md, backgroundColor: colors.canvas,
    marginRight: spacing.sm, borderWidth: 1, borderColor: colors.border, overflow: "hidden" as const,
  },
  wallpaperThumbActive: {
    borderColor: colors.primary, borderWidth: 2,
  },
  wallpaperPreview: {
    width: "100%" as const, height: 56, position: "relative" as const,
  },
  wallpaperLabel: {
    fontSize: 8, color: colors.textMuted, textAlign: "center" as const, paddingHorizontal: 2,
  },
});
