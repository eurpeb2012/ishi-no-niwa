import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useAuthStore } from "../../stores/authStore";
import { useStoneStore } from "../../stores/stoneStore";

const STEPS = ["motivation", "intention", "stone", "begin"] as const;

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [motivation, setMotivation] = useState("");
  const [intention, setIntention] = useState("");
  const [chosenStone, setChosenStone] = useState("");
  const stones = useStoneStore((s) => s.stones).filter((s) => s.tier === 1);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.replace("/(tabs)/garden");
    }
  };

  const renderMotivation = () => (
    <View style={styles.stepContent}>
      <Text style={styles.question}>{t("onboarding.q1Title")}</Text>
      {(["q1a", "q1b", "q1c", "q1d"] as const).map((key) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.option,
            motivation === key && styles.optionSelected,
          ]}
          onPress={() => {
            setMotivation(key);
            setTimeout(next, 300);
          }}
        >
          <Text
            style={[
              styles.optionText,
              motivation === key && styles.optionTextSelected,
            ]}
          >
            {t(`onboarding.${key}`)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderIntention = () => (
    <View style={styles.stepContent}>
      <Text style={styles.question}>{t("onboarding.q2Title")}</Text>
      {(["q2love", "q2prosperity", "q2healing", "q2protection", "q2spiritual", "q2calm"] as const).map(
        (key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.option,
              intention === key && styles.optionSelected,
            ]}
            onPress={() => {
              setIntention(key);
              setTimeout(next, 300);
            }}
          >
            <Text
              style={[
                styles.optionText,
                intention === key && styles.optionTextSelected,
              ]}
            >
              {t(`onboarding.${key}`)}
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );

  const renderStoneChoice = () => (
    <View style={styles.stepContent}>
      <Text style={styles.question}>{t("onboarding.q3Title")}</Text>
      <View style={styles.stoneGrid}>
        {stones.map((stone) => (
          <TouchableOpacity
            key={stone.id}
            style={[
              styles.stoneOption,
              { borderColor: stone.color_hex },
              chosenStone === stone.id && styles.stoneSelected,
            ]}
            onPress={() => {
              setChosenStone(stone.id);
              updateProfile({ avatarStoneId: stone.id });
              setTimeout(next, 300);
            }}
          >
            <View
              style={[styles.stoneDot, { backgroundColor: stone.color_hex }]}
            />
            <Text style={styles.stoneName}>{stone.name_en}</Text>
            <Text style={styles.stoneNameJp}>{stone.name_jp}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBegin = () => (
    <View style={styles.stepContent}>
      <Text style={styles.question}>{t("onboarding.starterKit")}</Text>
      <Text style={styles.subtitle}>
        {t("onboarding.birthstone")}: {t("onboarding.q3Title")}
      </Text>
      <TouchableOpacity style={styles.beginButton} onPress={next}>
        <Text style={styles.beginButtonText}>{t("onboarding.begin")}</Text>
      </TouchableOpacity>
    </View>
  );

  const stepRenderers = [
    renderMotivation,
    renderIntention,
    renderStoneChoice,
    renderBegin,
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.progress}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i <= step && styles.dotActive]}
          />
        ))}
      </View>
      {stepRenderers[step]()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: spacing.xxl,
  },
  progress: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  stepContent: {
    gap: spacing.md,
  },
  question: {
    fontSize: fontSize.xl,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
  option: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    textAlign: "center",
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: "600",
  },
  stoneGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "center",
  },
  stoneOption: {
    width: "45%",
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  stoneSelected: {
    borderWidth: 2,
  },
  stoneDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: spacing.xs,
  },
  stoneName: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  stoneNameJp: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  beginButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  beginButtonText: {
    color: colors.background,
    fontSize: fontSize.xl,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
