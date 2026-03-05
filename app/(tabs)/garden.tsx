import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useCanvasStore } from "../../stores/canvasStore";
import { useStoneStore } from "../../stores/stoneStore";
import { useProgressionStore } from "../../stores/progressionStore";
import { XP_REWARDS } from "../../types";
import templates from "../../data/templates.json";
import type { GridTemplate, StonePlacement } from "../../types";

const CANVAS_SIZE = Dimensions.get("window").width - spacing.lg * 2;
const STONE_RENDER_SIZE = 36;

export default function GardenScreen() {
  const { t } = useTranslation();
  const canvas = useCanvasStore();
  const stones = useStoneStore((s) => s.stones);
  const unlockedStones = useProgressionStore((s) => s.progress.stonesUnlocked);
  const addXP = useProgressionStore((s) => s.addXP);
  const incrementGrids = useProgressionStore((s) => s.incrementGrids);
  const [showTemplates, setShowTemplates] = useState(false);

  const availableStones = stones.filter((s) => unlockedStones.includes(s.id));
  const activeTemplate = templates.find(
    (tmpl) => tmpl.id === canvas.activeTemplateId
  ) as GridTemplate | undefined;

  const handleStoneTap = useCallback(
    (stoneId: string) => {
      if (!activeTemplate || activeTemplate.point_count === 0) {
        // Freeform: place at center
        canvas.addPlacement({
          stoneId,
          x: 0.5,
          y: 0.5,
          rotation: 0,
        });
        return;
      }

      // Find next empty template point
      const filledCount = canvas.placements.length;
      if (filledCount < activeTemplate.points.length) {
        const point = activeTemplate.points[filledCount];
        canvas.addPlacement({
          stoneId,
          x: point.x,
          y: point.y,
          rotation: 0,
        });
      }
    },
    [activeTemplate, canvas]
  );

  const handleSaveGrid = () => {
    if (canvas.placements.length === 0) return;
    canvas.saveGrid();
    addXP(XP_REWARDS.COMPLETE_GRID);
    incrementGrids();
  };

  const handleSelectTemplate = (templateId: string) => {
    canvas.clearCanvas();
    canvas.setTemplate(templateId);
    setShowTemplates(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowTemplates(!showTemplates)}>
          <Text style={styles.gridTitle}>
            {activeTemplate
              ? `${activeTemplate.name_en} / ${activeTemplate.name_jp}`
              : t("garden.chooseTemplate")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSaveGrid}>
          <Text style={styles.saveButton}>{t("garden.saveGrid")}</Text>
        </TouchableOpacity>
      </View>

      {/* Template Picker */}
      {showTemplates && (
        <ScrollView
          horizontal
          style={styles.templatePicker}
          showsHorizontalScrollIndicator={false}
        >
          {(templates as GridTemplate[]).map((tmpl) => (
            <TouchableOpacity
              key={tmpl.id}
              style={[
                styles.templateCard,
                canvas.activeTemplateId === tmpl.id &&
                  styles.templateCardActive,
              ]}
              onPress={() => handleSelectTemplate(tmpl.id)}
            >
              <Text style={styles.templateName}>{tmpl.name_jp}</Text>
              <Text style={styles.templateNameEn}>{tmpl.name_en}</Text>
              <Text style={styles.templatePoints}>
                {tmpl.point_count || "~"} pts
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Canvas */}
      <View style={styles.canvasContainer}>
        <View style={styles.canvas}>
          {/* Template guide points */}
          {activeTemplate?.points.map((point, i) => (
            <View
              key={`guide-${i}`}
              style={[
                styles.guidePoint,
                {
                  left: point.x * CANVAS_SIZE - 6,
                  top: point.y * CANVAS_SIZE - 6,
                },
              ]}
            />
          ))}

          {/* Placed stones */}
          {canvas.placements.map((placement, i) => {
            const stone = stones.find((s) => s.id === placement.stoneId);
            if (!stone) return null;
            return (
              <TouchableOpacity
                key={`stone-${i}`}
                style={[
                  styles.placedStone,
                  {
                    backgroundColor: stone.color_hex,
                    left: placement.x * CANVAS_SIZE - STONE_RENDER_SIZE / 2,
                    top: placement.y * CANVAS_SIZE - STONE_RENDER_SIZE / 2,
                  },
                ]}
                onLongPress={() => canvas.removePlacement(i)}
              >
                <Text style={styles.placedStoneText}>
                  {stone.name_jp.charAt(0)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Canvas Tools */}
      <View style={styles.tools}>
        <TouchableOpacity
          style={[styles.toolButton, canvas.snapEnabled && styles.toolActive]}
          onPress={canvas.toggleSnap}
        >
          <Text style={styles.toolText}>{t("garden.snapToGrid")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={canvas.cycleSymmetry}>
          <Text style={styles.toolText}>
            {t("garden.symmetry")}
            {canvas.symmetryFold > 0 ? `:${canvas.symmetryFold}` : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, canvas.soundEnabled && styles.toolActive]}
          onPress={canvas.toggleSound}
        >
          <Text style={styles.toolText}>{t("garden.sound")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={canvas.clearCanvas}>
          <Text style={styles.toolTextDanger}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Stone Tray */}
      <View style={styles.trayContainer}>
        <Text style={styles.trayLabel}>{t("garden.stoneTray")}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tray}
        >
          {availableStones.map((stone) => (
            <TouchableOpacity
              key={stone.id}
              style={styles.trayStone}
              onPress={() => handleStoneTap(stone.id)}
            >
              <View
                style={[
                  styles.trayDot,
                  { backgroundColor: stone.color_hex },
                ]}
              />
              <Text style={styles.trayName} numberOfLines={1}>
                {stone.name_jp}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  gridTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  saveButton: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: "600",
  },
  templatePicker: {
    maxHeight: 80,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  templateCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginHorizontal: spacing.xs,
    alignItems: "center",
    minWidth: 80,
    borderWidth: 1,
    borderColor: colors.border,
  },
  templateCardActive: {
    borderColor: colors.primary,
  },
  templateName: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  templateNameEn: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  templatePoints: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  canvasContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: colors.canvas,
    borderRadius: CANVAS_SIZE / 2,
    position: "relative",
    overflow: "hidden",
  },
  guidePoint: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },
  placedStone: {
    position: "absolute",
    width: STONE_RENDER_SIZE,
    height: STONE_RENDER_SIZE,
    borderRadius: STONE_RENDER_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  placedStoneText: {
    color: "#fff",
    fontSize: fontSize.sm,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tools: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  toolButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toolActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  toolText: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  toolTextDanger: {
    color: colors.error,
    fontSize: fontSize.xs,
  },
  trayContainer: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  trayLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  tray: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  trayStone: {
    alignItems: "center",
    width: 56,
  },
  trayDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  trayName: {
    color: colors.textSecondary,
    fontSize: 9,
    marginTop: 2,
    textAlign: "center",
  },
});
