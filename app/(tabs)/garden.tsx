import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Vibration,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { colors, spacing, fontSize, borderRadius } from "../../theme";
import { useCanvasStore, CANVAS_BG_COLORS } from "../../stores/canvasStore";
import { useStoneStore } from "../../stores/stoneStore";
import { useProgressionStore } from "../../stores/progressionStore";
import { useInsightStore } from "../../stores/insightStore";
import { useResponsive } from "../../hooks/useResponsive";
import { XP_REWARDS } from "../../types";
import { GemStone, getGemSize } from "../../components/common/GemStone";
import { SponsoredAd } from "../../components/common/SponsoredAd";
import { getAdForPlacement } from "../../data/mockAds";
import { getCurrentSeasonalItems, getOthersItems } from "../../data/seasonalItems";
import templates from "../../data/templates.json";
import type { GridTemplate, StonePlacement } from "../../types";

// Environment evolution colors based on level
function getEvolutionStyle(level: number) {
  if (level >= 15) return { borderColor: "#FFD700", borderWidth: 3, shadowColor: "#FFD700" }; // Gold
  if (level >= 10) return { borderColor: "#C0C0C0", borderWidth: 2, shadowColor: "#C0C0C0" }; // Silver
  if (level >= 5) return { borderColor: "#CD7F32", borderWidth: 2, shadowColor: "#CD7F32" }; // Bronze
  return {};
}

function getCanvasDecor(level: number): string[] {
  const decor: string[] = [];
  if (level >= 3) decor.push("grass"); // Small dots around edges
  if (level >= 6) decor.push("flowers");
  if (level >= 10) decor.push("butterflies");
  if (level >= 15) decor.push("glow");
  return decor;
}

// Connection line between two stones
function ConnectionLine({
  x1, y1, x2, y2, canvasSize,
}: {
  x1: number; y1: number; x2: number; y2: number; canvasSize: number;
}) {
  const px1 = x1 * canvasSize;
  const py1 = y1 * canvasSize;
  const px2 = x2 * canvasSize;
  const py2 = y2 * canvasSize;
  const dx = px2 - px1;
  const dy = py2 - py1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <View
      style={{
        position: "absolute",
        width: length,
        height: 1.5,
        left: px1,
        top: py1 - 0.75,
        backgroundColor: "rgba(201, 169, 110, 0.35)",
        transformOrigin: "0% 50%",
        transform: [{ rotate: `${angle}deg` }],
      }}
    />
  );
}

// Draggable gem on canvas
interface DraggableStoneProps {
  placement: StonePlacement;
  index: number;
  stone: { id: string; name_jp: string; color_hex: string };
  canvasSize: number;
  onDragEnd: (index: number, newX: number, newY: number) => void;
  onSelect: (index: number) => void;
  selected: boolean;
  pulsing: boolean;
  photoMode: boolean;
  hapticsEnabled: boolean;
}

function DraggableStone({
  placement, index, stone, canvasSize, onDragEnd, onSelect, selected, pulsing, photoMode, hapticsEnabled,
}: DraggableStoneProps) {
  const [gemW, gemH] = getGemSize(stone.id);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const zIdx = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  const baseLeft = placement.x * canvasSize - gemW / 2;
  const baseTop = placement.y * canvasSize - gemH / 2;

  useEffect(() => {
    if (pulsing) {
      pulseAnim.value = 1;
      pulseAnim.value = withSequence(
        withTiming(1.2, { duration: 180, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 180, easing: Easing.in(Easing.quad) }),
        withDelay(40, withSequence(
          withTiming(1.2, { duration: 180, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 180, easing: Easing.in(Easing.quad) })
        )),
        withDelay(40, withSequence(
          withTiming(1.25, { duration: 180, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 250, easing: Easing.in(Easing.quad) })
        ))
      );
    }
  }, [pulsing]);

  const triggerHaptic = useCallback(() => {
    if (hapticsEnabled && Platform.OS !== "web") {
      Vibration.vibrate(10);
    }
  }, [hapticsEnabled]);

  const handleTap = useCallback(
    (idx: number) => { if (!photoMode) onSelect(idx); },
    [onSelect, photoMode]
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      scale.value = withTiming(1.15, { duration: 100 });
      glowOpacity.value = withTiming(1, { duration: 150 });
      zIdx.value = 100;
      runOnJS(triggerHaptic)();
    })
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
      rotation.value = event.translationX * 0.15;
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 100 });
      glowOpacity.value = withTiming(0, { duration: 300 });
      rotation.value = withTiming(0, { duration: 200 });
      zIdx.value = 0;
      const newPixelX = baseLeft + gemW / 2 + translateX.value;
      const newPixelY = baseTop + gemH / 2 + translateY.value;
      const clampedX = Math.max(0, Math.min(newPixelX / canvasSize, 1));
      const clampedY = Math.max(0, Math.min(newPixelY / canvasSize, 1));
      runOnJS(onDragEnd)(index, clampedX, clampedY);
      runOnJS(triggerHaptic)();
      translateX.value = 0;
      translateY.value = 0;
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    })
    .minDistance(5);

  const tapGesture = Gesture.Tap()
    .onEnd(() => { runOnJS(handleTap)(index); });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value * pulseAnim.value },
      { rotate: `${rotation.value}deg` },
    ],
    zIndex: zIdx.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          { position: "absolute", left: baseLeft, top: baseTop, width: gemW, height: gemH },
          animatedStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              top: -6, left: -6, right: -6, bottom: -6,
              borderRadius: Math.max(gemW, gemH),
              backgroundColor: stone.color_hex + "40",
              shadowColor: stone.color_hex,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 12,
            },
            glowStyle,
          ]}
        />
        {selected && !photoMode && (
          <View
            style={{
              position: "absolute",
              top: -4, left: -4, right: -4, bottom: -4,
              borderRadius: Math.max(gemW, gemH),
              borderWidth: 2,
              borderColor: colors.error,
              zIndex: -1,
            }}
          />
        )}
        <GemStone stoneId={stone.id} colorHex={stone.color_hex} useNatural />
      </Animated.View>
    </GestureDetector>
  );
}

// Ambient sound options
const AMBIENT_SOUNDS = ["off", "singing_bowl", "nature", "rain", "wind_chimes"] as const;

export default function GardenScreen() {
  const { t, i18n } = useTranslation();
  const responsive = useResponsive();
  const CANVAS_SIZE = responsive.canvasSize;
  const canvas = useCanvasStore();
  const stones = useStoneStore((s) => s.stones);
  const unlockedStones = useProgressionStore((s) => s.progress.stonesUnlocked);
  const level = useProgressionStore((s) => s.progress.level);
  const addXP = useProgressionStore((s) => s.addXP);
  const incrementGrids = useProgressionStore((s) => s.incrementGrids);
  const trackStonePlaced = useInsightStore((s) => s.trackStonePlaced);

  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveAd, setShowSaveAd] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [pulsing, setPulsing] = useState(false);
  const [photoMode, setPhotoMode] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [ambientSound, setAmbientSound] = useState<typeof AMBIENT_SOUNDS[number]>("off");
  const [showAmbientPicker, setShowAmbientPicker] = useState(false);
  const [replaying, setReplaying] = useState(false);

  const seasonalItems = useMemo(() => getCurrentSeasonalItems(), []);
  const othersItems = useMemo(() => getOthersItems(), []);
  const evolutionStyle = getEvolutionStyle(level);
  const canvasDecor = getCanvasDecor(level);

  const availableStones = stones.filter((s) => unlockedStones.includes(s.id));
  const activeTemplate = templates.find(
    (tmpl) => tmpl.id === canvas.activeTemplateId
  ) as GridTemplate | undefined;

  const connectionLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const p = canvas.placements;
    for (let i = 0; i < p.length; i++) {
      for (let j = i + 1; j < p.length; j++) {
        lines.push({ x1: p[i].x, y1: p[i].y, x2: p[j].x, y2: p[j].y });
      }
    }
    return lines;
  }, [canvas.placements]);

  const snap = useCallback(
    (v: number) => {
      if (!canvas.snapEnabled) return v;
      const step = 0.05;
      return Math.round(v / step) * step;
    },
    [canvas.snapEnabled]
  );

  const withSymmetry = useCallback(
    (x: number, y: number): { x: number; y: number }[] => {
      const fold = canvas.symmetryFold;
      if (fold <= 0) return [{ x, y }];
      const cx = 0.5, cy = 0.5;
      const dx = x - cx, dy = y - cy;
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < fold; i++) {
        const angle = (2 * Math.PI * i) / fold;
        const rx = dx * Math.cos(angle) - dy * Math.sin(angle) + cx;
        const ry = dx * Math.sin(angle) + dy * Math.cos(angle) + cy;
        const clamped = {
          x: Math.max(0, Math.min(1, rx)),
          y: Math.max(0, Math.min(1, ry)),
        };
        if (!points.some((p) => Math.abs(p.x - clamped.x) < 0.02 && Math.abs(p.y - clamped.y) < 0.02)) {
          points.push(clamped);
        }
      }
      return points;
    },
    [canvas.symmetryFold]
  );

  const handleStoneTap = useCallback(
    (stoneId: string, colorHex: string) => {
      trackStonePlaced(stoneId, colorHex);
      if (hapticsEnabled && Platform.OS !== "web") Vibration.vibrate(10);

      const fold = canvas.symmetryFold;
      const filledCount = canvas.placements.length;

      if (activeTemplate && activeTemplate.point_count > 0 && filledCount < activeTemplate.points.length) {
        const point = activeTemplate.points[filledCount];
        canvas.addPlacement({ stoneId, x: snap(point.x), y: snap(point.y), rotation: 0 });
        return;
      }

      if (fold > 0) {
        const pts = withSymmetry(0.5, 0.3);
        pts.forEach((pt) => {
          canvas.addPlacement({ stoneId, x: snap(pt.x), y: snap(pt.y), rotation: 0 });
        });
      } else {
        canvas.addPlacement({ stoneId, x: snap(0.5), y: snap(0.5), rotation: 0 });
      }
    },
    [activeTemplate, canvas, snap, withSymmetry, trackStonePlaced, hapticsEnabled]
  );

  const handleSeasonalTap = useCallback(
    (itemId: string) => {
      canvas.addPlacement({ stoneId: `seasonal:${itemId}`, x: snap(0.5), y: snap(0.5), rotation: 0 });
    },
    [canvas, snap]
  );

  const handleDragEnd = useCallback(
    (index: number, newX: number, newY: number) => {
      canvas.updatePlacement(index, { x: snap(newX), y: snap(newY) });
    },
    [canvas, snap]
  );

  const handleSelect = useCallback(
    (index: number) => { setSelectedIdx((prev) => (prev === index ? null : index)); },
    []
  );

  const handleRemoveSelected = useCallback(() => {
    if (selectedIdx !== null && selectedIdx < canvas.placements.length) {
      canvas.removePlacement(selectedIdx);
      setSelectedIdx(null);
    }
  }, [canvas, selectedIdx]);

  const handleSaveGrid = () => {
    if (canvas.placements.length === 0) return;
    canvas.saveGrid();
    addXP(XP_REWARDS.COMPLETE_GRID);
    incrementGrids();
    setShowSaveAd(true);
    setTimeout(() => setShowSaveAd(false), 8000);
};

  const handleEnergize = () => {
    if (canvas.placements.length === 0) return;
    setPulsing(true);
    setTimeout(() => setPulsing(false), 1400);
  };

  const handleSelectTemplate = (templateId: string) => {
    canvas.clearCanvas();
    canvas.setTemplate(templateId);
    setShowTemplates(false);
};

  const handleShare = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.alert(
        i18n.language === "jp"
          ? "スクリーンショットを撮ってSNSで共有してください！"
          : "Take a screenshot and share on social media!"
      );
    }
  };

  const handleExport = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.alert(
        i18n.language === "jp"
          ? "グリッドテンプレートをPDFで書き出し（近日対応）"
          : "Export grid template as PDF (coming soon)"
      );
    }
  };

  const handleAR = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.alert(
        i18n.language === "jp"
          ? "ARビュー: カメラでテーブルにグリッドを配置（近日対応）"
          : "AR View: Place your grid on a real table using camera (coming soon)"
      );
    }
  };

  // Replay: animate stones appearing one by one
  const handleReplay = useCallback(() => {
    if (canvas.placements.length === 0) return;
    const saved = [...canvas.placements];
    canvas.clearCanvas();
    setReplaying(true);

    saved.forEach((p, i) => {
      setTimeout(() => {
        canvas.addPlacement(p);
        if (i === saved.length - 1) setReplaying(false);
      }, (i + 1) * 400);
    });
  }, [canvas]);

  const canEnergize = canvas.placements.length > 0;
  const postGridAd = getAdForPlacement("post_grid");
  const isJp = i18n.language === "jp";

  // Photo mode — full-screen clean view, no circle, share in corner
  if (photoMode) {
    const photoSize = Math.min(responsive.canvasSize * 1.3, responsive.canvasSize + 80);
    return (
      <View style={{ flex: 1, backgroundColor: CANVAS_BG_COLORS[canvas.canvasBg], justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: photoSize, height: photoSize, position: "relative" }}>
          {connectionLines.map((line, i) => (
            <ConnectionLine key={`line-${i}`} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} canvasSize={photoSize} />
          ))}
          {canvas.placements.map((placement, i) => {
            const stoneId = placement.stoneId;
            if (stoneId.startsWith("seasonal:")) {
              const itemId = stoneId.replace("seasonal:", "");
              const allItems = [...seasonalItems, ...othersItems];
              const item = allItems.find((si) => si.id === itemId);
              if (!item) return null;
              return (
                <View key={`seasonal-${i}`} style={{
                  position: "absolute",
                  left: placement.x * photoSize - 16,
                  top: placement.y * photoSize - 16,
                }}>
                  <Text style={{ fontSize: 28 }}>{item.glyph}</Text>
                </View>
              );
            }
            const stone = stones.find((s) => s.id === stoneId);
            if (!stone) return null;
            return (
              <DraggableStone
                key={`stone-${i}`} placement={placement} index={i} stone={stone}
                canvasSize={photoSize} onDragEnd={handleDragEnd} onSelect={handleSelect}
                selected={false} pulsing={false} photoMode hapticsEnabled={false}
              />
            );
          })}
        </View>
        {/* Back button — top left */}
        <TouchableOpacity
          style={{ position: "absolute", top: 50, left: spacing.lg }}
          onPress={() => setPhotoMode(false)}
        >
          <Text style={{ color: colors.textMuted, fontSize: fontSize.md }}>{isJp ? "✕ 戻る" : "✕ Back"}</Text>
        </TouchableOpacity>
        {/* Share button — bottom right corner */}
        <TouchableOpacity
          style={{ position: "absolute", bottom: 40, right: spacing.lg, backgroundColor: colors.primary, borderRadius: borderRadius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}
          onPress={handleShare}
        >
          <Text style={{ color: colors.buttonText, fontSize: fontSize.sm, fontWeight: "600" }}>{t("common.share")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <TouchableOpacity onPress={() => setShowTemplates(!showTemplates)} style={{ flex: 1 }}>
            <Text style={styles.gridTitle} numberOfLines={1}>
              {activeTemplate
                ? `${activeTemplate.name_en} / ${activeTemplate.name_jp}`
                : t("garden.chooseTemplate")}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          <TouchableOpacity onPress={() => setPhotoMode(true)}>
            <Text style={styles.saveButton}>{isJp ? "写真" : "Photo"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveGrid}>
            <Text style={styles.saveButton}>{t("garden.saveGrid")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Template Picker */}
      {showTemplates && (
        <ScrollView horizontal style={styles.templatePicker} showsHorizontalScrollIndicator={false}>
          {(templates as GridTemplate[]).map((tmpl) => (
            <TouchableOpacity
              key={tmpl.id}
              style={[styles.templateCard, canvas.activeTemplateId === tmpl.id && styles.templateCardActive]}
              onPress={() => handleSelectTemplate(tmpl.id)}
            >
              <Text style={styles.templateName}>{tmpl.name_jp}</Text>
              <Text style={styles.templateNameEn}>{tmpl.name_en}</Text>
              <Text style={styles.templatePoints}>{tmpl.point_count || "~"} pts</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Canvas with evolution */}
      <View style={styles.canvasContainer}>
        <View style={[styles.canvas, { width: CANVAS_SIZE, height: CANVAS_SIZE, borderRadius: CANVAS_SIZE / 2, backgroundColor: CANVAS_BG_COLORS[canvas.canvasBg] }, evolutionStyle]}>
          {/* Environment decorations based on level */}
          {canvasDecor.includes("grass") && (
            <>
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((pos, i) => (
                <View key={`g-${i}`} style={{
                  position: "absolute", bottom: 8, left: pos * CANVAS_SIZE,
                  width: 4, height: 8, backgroundColor: "#4a7c4a40", borderRadius: 2,
                }} />
              ))}
            </>
          )}
          {canvasDecor.includes("flowers") && (
            <>
              {[0.15, 0.45, 0.75].map((pos, i) => (
                <Text key={`f-${i}`} style={{
                  position: "absolute", bottom: 12, left: pos * CANVAS_SIZE,
                  fontSize: 10, opacity: 0.4,
                }}>
                  {["*", "+", "*"][i]}
                </Text>
              ))}
            </>
          )}

          {/* Guide points */}
          {activeTemplate?.points.map((point, i) => (
            <View
              key={`guide-${i}`}
              style={[styles.guidePoint, {
                left: point.x * CANVAS_SIZE - 6,
                top: point.y * CANVAS_SIZE - 6,
              }]}
            />
          ))}

          {/* Connection lines */}
          {connectionLines.map((line, i) => (
            <ConnectionLine key={`line-${i}`} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} canvasSize={CANVAS_SIZE} />
          ))}

          {/* Placed items */}
          {canvas.placements.map((placement, i) => {
            const stoneId = placement.stoneId;
            if (stoneId.startsWith("seasonal:")) {
              const itemId = stoneId.replace("seasonal:", "");
              const allItems = [...seasonalItems, ...othersItems];
              const item = allItems.find((si) => si.id === itemId);
              if (!item) return null;
              return (
                <View key={`seasonal-${i}`} style={{
                  position: "absolute",
                  left: placement.x * CANVAS_SIZE - 16,
                  top: placement.y * CANVAS_SIZE - 16,
                }}>
                  <Text style={{ fontSize: 28 }}>{item.glyph}</Text>
                </View>
              );
            }
            const stone = stones.find((s) => s.id === stoneId);
            if (!stone) return null;
            return (
              <DraggableStone
                key={`stone-${i}`} placement={placement} index={i} stone={stone}
                canvasSize={CANVAS_SIZE} onDragEnd={handleDragEnd} onSelect={handleSelect}
                selected={selectedIdx === i} pulsing={pulsing} photoMode={false}
                hapticsEnabled={hapticsEnabled}
              />
            );
          })}
        </View>
      </View>

      {/* Remove bar */}
      {selectedIdx !== null && selectedIdx < canvas.placements.length && (
        <View style={styles.removeBar}>
          <Text style={styles.removeBarText}>
            {stones.find((s) => s.id === canvas.placements[selectedIdx]?.stoneId)?.name_jp || ""}
          </Text>
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveSelected}>
            <Text style={styles.removeButtonText}>{t("garden.removeStone")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelSelectButton} onPress={() => setSelectedIdx(null)}>
            <Text style={styles.cancelSelectText}>{t("common.cancel")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Post-save ad */}
      {showSaveAd && (
        <View style={styles.adContainer}>
          <SponsoredAd ad={postGridAd} placement="post_grid" />
        </View>
      )}

      {/* Ambient sound picker */}
      {showAmbientPicker && (
        <View style={styles.ambientPicker}>
          {AMBIENT_SOUNDS.map((sound) => (
            <TouchableOpacity
              key={sound}
              style={[styles.ambientOption, ambientSound === sound && styles.ambientOptionActive]}
              onPress={() => { setAmbientSound(sound); setShowAmbientPicker(false); }}
            >
              <Text style={[styles.ambientText, ambientSound === sound && styles.ambientTextActive]}>
                {t(`ambient.${sound}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Canvas Tools - Row 1: core tools */}
      <View style={styles.tools}>
        <TouchableOpacity style={[styles.toolButton, canvas.snapEnabled && styles.toolActive]} onPress={canvas.toggleSnap}>
          <Text style={styles.toolText}>{t("garden.snapToGrid")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolButton, canvas.symmetryFold > 0 && styles.toolActive]} onPress={canvas.cycleSymmetry}>
          <Text style={styles.toolText}>
            {t("garden.symmetry")}{canvas.symmetryFold > 0 ? `:${canvas.symmetryFold}` : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolButton, ambientSound !== "off" && styles.toolActive]} onPress={() => setShowAmbientPicker(!showAmbientPicker)}>
          <Text style={styles.toolText}>
            {ambientSound !== "off" ? t(`ambient.${ambientSound}`) : t("garden.ambient")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, canvas.canvasBg !== "default" && styles.toolActive]}
          onPress={canvas.cycleCanvasBg}
        >
          <Text style={styles.toolText}>
            {canvas.canvasBg === "default" ? (isJp ? "背景" : "BG")
              : canvas.canvasBg === "wood" ? (isJp ? "木目" : "Wood")
              : canvas.canvasBg === "sand" ? (isJp ? "砂" : "Sand")
              : (isJp ? "大理石" : "Marble")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, canEnergize ? styles.energizeActive : styles.energizeDisabled]}
          onPress={handleEnergize} disabled={!canEnergize}
        >
          <Text style={[styles.toolText, canEnergize && styles.energizeText]}>{t("garden.energize")}</Text>
        </TouchableOpacity>
      </View>

      {/* Canvas Tools - Row 2: undo/redo, extras */}
      <View style={styles.tools}>
        <TouchableOpacity
          style={[styles.toolButton, !canvas.canUndo() && styles.toolDisabled]}
          onPress={canvas.undo} disabled={!canvas.canUndo()}
        >
          <Text style={styles.toolText}>{t("garden.undo")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, !canvas.canRedo() && styles.toolDisabled]}
          onPress={canvas.redo} disabled={!canvas.canRedo()}
        >
          <Text style={styles.toolText}>{t("garden.redo")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={handleReplay} disabled={replaying || canvas.placements.length === 0}>
          <Text style={styles.toolText}>{t("garden.replay")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={handleExport}>
          <Text style={styles.toolText}>{t("garden.export")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={handleAR}>
          <Text style={styles.toolText}>{t("garden.ar")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={canvas.clearCanvas}>
          <Text style={styles.toolTextDanger}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Stone Tray + Seasonal Items */}
      <View style={styles.trayContainer}>
        <Text style={styles.trayLabel}>{t("garden.stoneTray")}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tray}>
          {seasonalItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.trayStone}
              onPress={() => handleSeasonalTap(item.id)}
            >
              <View style={styles.trayGemWrap}>
                <Text style={{ fontSize: 24 }}>{item.glyph}</Text>
              </View>
              <Text style={[styles.trayName, { color: colors.primary }]} numberOfLines={1}>
                {isJp ? item.name_jp : item.name_en}
              </Text>
            </TouchableOpacity>
          ))}
          {seasonalItems.length > 0 && (
            <View style={{ width: 1, height: 36, backgroundColor: colors.border, alignSelf: "center" }} />
          )}
          {availableStones.map((stone) => (
            <TouchableOpacity
              key={stone.id}
              style={styles.trayStone}
              onPress={() => handleStoneTap(stone.id, stone.color_hex)}
            >
              <View style={styles.trayGemWrap}>
                <GemStone stoneId={stone.id} colorHex={stone.color_hex} size={36} />
              </View>
              <Text style={styles.trayName} numberOfLines={1}>{stone.name_jp}</Text>
            </TouchableOpacity>
          ))}
          {/* Others: flowers, shells, nature */}
          {othersItems.length > 0 && (
            <View style={{ width: 1, height: 36, backgroundColor: colors.border, alignSelf: "center" }} />
          )}
          {othersItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.trayStone}
              onPress={() => handleSeasonalTap(item.id)}
            >
              <View style={styles.trayGemWrap}>
                <Text style={{ fontSize: 24 }}>{item.glyph}</Text>
              </View>
              <Text style={[styles.trayName, { color: colors.secondary }]} numberOfLines={1}>
                {isJp ? item.name_jp : item.name_en}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm,
  },
  gridTitle: { fontSize: fontSize.lg, fontWeight: "600", color: colors.textPrimary },
  saveButton: { fontSize: fontSize.md, color: colors.primary, fontWeight: "600" },
  templatePicker: { maxHeight: 80, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  templateCard: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, padding: spacing.sm,
    marginHorizontal: spacing.xs, alignItems: "center", minWidth: 80, borderWidth: 1, borderColor: colors.border,
  },
  templateCardActive: { borderColor: colors.primary },
  templateName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600" },
  templateNameEn: { color: colors.textSecondary, fontSize: fontSize.xs },
  templatePoints: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  canvasContainer: { alignItems: "center", paddingHorizontal: spacing.lg },
  canvas: {
    backgroundColor: colors.canvas,
    position: "relative" as const, overflow: "hidden" as const,
  },
  guidePoint: {
    position: "absolute", width: 12, height: 12, borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.08)", borderWidth: 1, borderColor: "rgba(0,0,0,0.12)",
  },
  removeBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, backgroundColor: colors.surface,
  },
  removeBarText: { color: colors.textSecondary, fontSize: fontSize.sm, flex: 1 },
  removeButton: {
    backgroundColor: colors.error, borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
  },
  removeButtonText: { color: "#fff", fontSize: fontSize.xs, fontWeight: "600" },
  cancelSelectButton: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  cancelSelectText: { color: colors.textMuted, fontSize: fontSize.xs },
  adContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  ambientPicker: {
    flexDirection: "row", flexWrap: "wrap", justifyContent: "center",
    gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    backgroundColor: colors.surface, borderRadius: borderRadius.md, marginHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  ambientOption: {
    paddingVertical: spacing.xs, paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.border,
  },
  ambientOptionActive: { borderColor: colors.primary, backgroundColor: colors.surfaceLight },
  ambientText: { color: colors.textMuted, fontSize: fontSize.xs },
  ambientTextActive: { color: colors.primary, fontWeight: "600" },
  tools: {
    flexDirection: "row", justifyContent: "center", flexWrap: "wrap",
    gap: spacing.xs, paddingVertical: 2, paddingHorizontal: spacing.md,
  },
  toolButton: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.sm,
    paddingVertical: 3, paddingHorizontal: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  toolActive: { borderColor: colors.primary, backgroundColor: colors.surface },
  toolDisabled: { opacity: 0.3 },
  toolText: { color: colors.textSecondary, fontSize: 10 },
  toolTextDanger: { color: colors.error, fontSize: 10 },
  energizeActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  energizeDisabled: { opacity: 0.4 },
  energizeText: { color: "#fff", fontWeight: "600" },
  trayContainer: { flex: 1, paddingTop: spacing.xs },
  trayLabel: { color: colors.textMuted, fontSize: fontSize.xs, paddingHorizontal: spacing.lg, marginBottom: spacing.xs },
  tray: { paddingHorizontal: spacing.md, gap: spacing.sm },
  trayStone: { alignItems: "center", width: 56 },
  trayGemWrap: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  trayName: { color: colors.textSecondary, fontSize: 9, marginTop: 3, textAlign: "center" },
  photoBar: {
    flexDirection: "row", justifyContent: "center", gap: spacing.xl,
    paddingVertical: spacing.lg,
  },
  photoBarButton: {
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.xl,
    borderWidth: 1, borderColor: colors.border,
  },
  photoBarText: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600" },
});
