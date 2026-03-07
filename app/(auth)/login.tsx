import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useAuthStore } from "../../stores/authStore";
import { useProgressionStore } from "../../stores/progressionStore";

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const setUser = useAuthStore((s) => s.setUser);
  const unlockAll = useProgressionStore((s) => s.unlockAll);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isJP = i18n.language === "jp";

  const toggleLanguage = () => {
    i18n.changeLanguage(isJP ? "en" : "jp");
  };

  const handleLogin = () => {
    if (!email.trim()) return;
    setUser({
      id: "demo-" + Date.now(),
      email,
      displayName: email.split("@")[0],
      avatarStoneId: "amethyst",
      language: isJP ? "jp" : "en",
      birthMonth: 1,
      subscriptionTier: "free",
      subscriptionExpires: null,
    });
    router.replace("/(tabs)/garden");
  };

  const handleDemoLogin = (tier: "free" | "tsuki" | "hoshi") => {
    setUser({
      id: "demo-" + tier,
      email: `demo-${tier}@ishinoniwa.app`,
      displayName: `Demo (${tier === "free" ? "Free" : tier === "tsuki" ? "Tsuki" : "Hoshi"})`,
      avatarStoneId: tier === "free" ? "clear_quartz" : tier === "tsuki" ? "amethyst" : "jade_jadeite",
      language: isJP ? "jp" : "en",
      birthMonth: 5,
      subscriptionTier: tier,
      subscriptionExpires: tier === "free" ? null : "2027-01-01",
    });
    unlockAll();
    router.replace("/(tabs)/garden");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.langToggle} onPress={toggleLanguage}>
          <Text style={styles.langToggleText}>
            {isJP ? "EN" : "JP"}
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.appName}>{t("app.name")}</Text>
          <Text style={styles.tagline}>{t("app.tagline")}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>{t("auth.signIn")}</Text>

          <TextInput
            style={styles.input}
            placeholder={t("auth.email")}
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder={t("auth.password")}
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>{t("auth.forgotPassword")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>{t("auth.signIn")}</Text>
          </TouchableOpacity>

          <Text style={styles.divider}>{t("auth.orContinueWith")}</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>{t("auth.google")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>{t("auth.apple")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>{t("auth.noAccount")} </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.switchLink}>{t("auth.signUp")}</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Demo login buttons for testing */}
          <View style={styles.demoSection}>
            <Text style={styles.demoLabel}>Quick Demo Access</Text>
            <View style={styles.demoRow}>
              <TouchableOpacity
                style={styles.demoButton}
                onPress={() => handleDemoLogin("free")}
              >
                <Text style={styles.demoButtonText}>Free</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoButton, styles.demoTsuki]}
                onPress={() => handleDemoLogin("tsuki")}
              >
                <Text style={styles.demoButtonText}>Tsuki</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoButton, styles.demoHoshi]}
                onPress={() => handleDemoLogin("hoshi")}
              >
                <Text style={styles.demoButtonText}>Hoshi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  langToggle: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langToggleText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "700",
    letterSpacing: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  appName: {
    fontSize: fontSize.title,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  form: {
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  forgotButton: {
    alignSelf: "flex-end",
  },
  forgotText: {
    color: colors.primary,
    fontSize: fontSize.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  divider: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: fontSize.sm,
    marginVertical: spacing.md,
  },
  socialRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: "500",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  switchText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  switchLink: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  demoSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: "center",
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  demoRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  demoButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  demoTsuki: {
    borderColor: colors.secondary,
  },
  demoHoshi: {
    borderColor: colors.primary,
  },
  demoButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: "500",
  },
});
