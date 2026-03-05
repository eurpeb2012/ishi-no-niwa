import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useAuthStore } from "../../stores/authStore";
import type { SubscriptionTier } from "../../types";

interface SubscriptionGateProps {
  requiredTier: SubscriptionTier;
  children: React.ReactNode;
  featureName?: string;
}

export function SubscriptionGate({
  requiredTier,
  children,
  featureName,
}: SubscriptionGateProps) {
  const { t } = useTranslation();
  const hasAccess = useAuthStore((s) => s.hasAccess);

  if (hasAccess(requiredTier)) {
    return <>{children}</>;
  }

  return (
    <View style={styles.gate}>
      <Text style={styles.lockText}>
        {featureName || t("stones.unlock")} {t(`subscription.${requiredTier}`)}
      </Text>
      <TouchableOpacity style={styles.upgradeButton}>
        <Text style={styles.upgradeText}>{t("profile.upgrade")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  gate: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.shimmer,
  },
  lockText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  upgradeText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});
