import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useAuthStore } from "../../stores/authStore";
import { useStoneStore } from "../../stores/stoneStore";
import { useProgressionStore } from "../../stores/progressionStore";

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const getStone = useStoneStore((s) => s.getStone);
  const level = useProgressionStore((s) => s.progress.level);

  const avatarStone = user ? getStone(user.avatarStoneId) : null;
  const levelTitle = t(`levels.${level}`) || `Level ${level}`;

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "jp" : "en";
    i18n.changeLanguage(newLang);
    updateProfile({ language: newLang as "en" | "jp" });
  };

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>{t("profile.title")}</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: avatarStone?.color_hex || colors.primary },
          ]}
        >
          <Text style={styles.avatarText}>
            {avatarStone?.name_jp.charAt(0) || "石"}
          </Text>
        </View>
        <Text style={styles.displayName}>{user?.displayName || "Guest"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.levelBadge}>{levelTitle}</Text>
      </View>

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

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.settings")}</Text>
        <TouchableOpacity style={styles.row} onPress={toggleLanguage}>
          <Text style={styles.rowLabel}>{t("profile.language")}</Text>
          <Text style={styles.rowValue}>
            {i18n.language === "en" ? "English" : "日本語"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>{t("profile.notifications")}</Text>
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
  profileCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  avatarText: {
    color: "#fff",
    fontSize: fontSize.xxl,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  displayName: {
    fontSize: fontSize.xl,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  levelBadge: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: "600",
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
  rowValue: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  upgradeText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  signOutText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  deleteText: {
    color: colors.error,
    fontSize: fontSize.md,
  },
});
