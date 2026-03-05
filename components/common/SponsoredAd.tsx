import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useAuthStore } from "../../stores/authStore";
import type { GemSellerAd } from "../../types";

interface SponsoredAdProps {
  ad: GemSellerAd | null;
  placement: string;
}

export function SponsoredAd({ ad, placement }: SponsoredAdProps) {
  const { t, i18n } = useTranslation();
  const tier = useAuthStore((s) => s.user?.subscriptionTier || "free");

  // Hoshi subscribers see no ads
  if (tier === "hoshi") return null;

  // Tsuki subscribers only see contextual placements
  if (tier === "tsuki" && !["stone_detail", "post_grid"].includes(placement)) {
    return null;
  }

  if (!ad) return null;

  const headline = i18n.language === "jp" ? ad.headline_jp : ad.headline_en;

  const handlePress = () => {
    // TODO: Track click via POST /ads/:id/click
    Linking.openURL(ad.destinationUrl);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.sponsored}>{t("common.sponsored")}</Text>
        <Text style={styles.sellerName}>{ad.sellerName}</Text>
      </View>
      <View style={styles.body}>
        {ad.imageUrl ? (
          <Image source={{ uri: ad.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        <View style={styles.info}>
          <Text style={styles.headline}>{headline}</Text>
          {ad.priceRange && (
            <Text style={styles.price}>{ad.priceRange}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  sponsored: {
    color: colors.textMuted,
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sellerName: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  body: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
  },
  info: {
    flex: 1,
  },
  headline: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: "500",
  },
  price: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "600",
    marginTop: 2,
  },
});
