import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorage } from "./asyncStorageAdapter";
import type { StonePlacement, SavedGrid } from "../types";

interface CanvasState {
  activeTemplateId: string | null;
  placements: StonePlacement[];
  savedGrids: SavedGrid[];
  snapEnabled: boolean;
  symmetryFold: number;
  soundEnabled: boolean;
  gridName: string;
  intention: string | null;

  // Undo/redo history
  history: StonePlacement[][];
  historyIndex: number;

  setTemplate: (templateId: string | null) => void;
  setGridName: (name: string) => void;
  setIntention: (intention: string | null) => void;
  addPlacement: (placement: StonePlacement) => void;
  updatePlacement: (index: number, updates: Partial<StonePlacement>) => void;
  removePlacement: (index: number) => void;
  clearCanvas: () => void;
  toggleSnap: () => void;
  cycleSymmetry: () => void;
  toggleSound: () => void;
  saveGrid: () => SavedGrid;
  loadGrid: (grid: SavedGrid) => void;
  deleteGrid: (gridId: string) => void;
  shareGrid: (gridId: string) => void;

  // Undo/redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

function pushHistory(state: { placements: StonePlacement[]; history: StonePlacement[][]; historyIndex: number }) {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push([...state.placements]);
  // Keep max 30 history entries
  if (newHistory.length > 30) newHistory.shift();
  return { history: newHistory, historyIndex: newHistory.length - 1 };
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      activeTemplateId: null,
      placements: [],
      savedGrids: [],
      snapEnabled: true,
      symmetryFold: 0,
      soundEnabled: false,
      gridName: "New Grid",
      intention: null,
      history: [[]],
      historyIndex: 0,

      setTemplate: (templateId) => set({ activeTemplateId: templateId }),
      setGridName: (name) => set({ gridName: name }),
      setIntention: (intention) => set({ intention }),

      addPlacement: (placement) =>
        set((state) => {
          const newPlacements = [...state.placements, placement];
          return {
            placements: newPlacements,
            ...pushHistory({ ...state, placements: newPlacements }),
          };
        }),

      updatePlacement: (index, updates) =>
        set((state) => {
          const newPlacements = state.placements.map((p, i) =>
            i === index ? { ...p, ...updates } : p
          );
          return {
            placements: newPlacements,
            ...pushHistory({ ...state, placements: newPlacements }),
          };
        }),

      removePlacement: (index) =>
        set((state) => {
          const newPlacements = state.placements.filter((_, i) => i !== index);
          return {
            placements: newPlacements,
            ...pushHistory({ ...state, placements: newPlacements }),
          };
        }),

      clearCanvas: () =>
        set({
          placements: [],
          activeTemplateId: null,
          gridName: "New Grid",
          intention: null,
          history: [[]],
          historyIndex: 0,
        }),

      toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),

      cycleSymmetry: () =>
        set((state) => {
          const folds = [0, 2, 3, 6];
          const idx = folds.indexOf(state.symmetryFold);
          return { symmetryFold: folds[(idx + 1) % folds.length] };
        }),

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      saveGrid: () => {
        const state = get();
        const grid: SavedGrid = {
          id: Date.now().toString(36),
          templateId: state.activeTemplateId,
          name: state.gridName,
          intention: state.intention,
          placements: [...state.placements],
          isShared: false,
          favoriteCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({ savedGrids: [...s.savedGrids, grid] }));
        return grid;
      },

      loadGrid: (grid) =>
        set({
          activeTemplateId: grid.templateId,
          gridName: grid.name,
          intention: grid.intention,
          placements: [...grid.placements],
          history: [[...grid.placements]],
          historyIndex: 0,
        }),

      deleteGrid: (gridId) =>
        set((state) => ({
          savedGrids: state.savedGrids.filter((g) => g.id !== gridId),
        })),

      shareGrid: (gridId) =>
        set((state) => ({
          savedGrids: state.savedGrids.map((g) =>
            g.id === gridId ? { ...g, isShared: true } : g
          ),
        })),

      undo: () =>
        set((state) => {
          if (state.historyIndex <= 0) return state;
          const newIndex = state.historyIndex - 1;
          return {
            placements: [...state.history[newIndex]],
            historyIndex: newIndex,
          };
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state;
          const newIndex = state.historyIndex + 1;
          return {
            placements: [...state.history[newIndex]],
            historyIndex: newIndex,
          };
        }),

      canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
      },

      canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
      },
    }),
    {
      name: "ishi-canvas",
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({
        savedGrids: state.savedGrids,
      }),
    }
  )
);
