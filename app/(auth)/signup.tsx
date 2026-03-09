import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useAuthStore } from "../../stores/authStore";

export default function SignUpScreen() {
  const { t } = useTranslation();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    if (password !== confirmPassword) return;
    // TODO: Replace with Supabase auth
    setUser({
      id: "demo",
      email,
      displayName: email.split("@")[0],
      avatarStoneId: "clear_quartz",
      language: "en",
      birthMonth: 1,
      subscriptionTier: "free",
      subscriptionExpires: null,
    });
    router.replace("/(auth)/onboarding");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.appName}>{t("app.name")}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>{t("auth.signUp")}</Text>

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

        <TextInput
          style={styles.input}
          placeholder={t("auth.confirmPassword")}
          placeholderTextColor={colors.textMuted}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
          <Text style={styles.primaryButtonText}>{t("auth.signUp")}</Text>
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
          <Text style={styles.switchText}>
            {t("auth.alreadyHaveAccount")}{" "}
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.switchLink}>{t("auth.signIn")}</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
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
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    color: colors.buttonText,
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
});
