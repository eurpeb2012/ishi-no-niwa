import { create } from "zustand";
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
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  activeTemplateId: null,
  placements: [],
  savedGrids: [],
  snapEnabled: true,
  symmetryFold: 0,
  soundEnabled: false,
  gridName: "New Grid",
  intention: null,

  setTemplate: (templateId) => set({ activeTemplateId: templateId }),
  setGridName: (name) => set({ gridName: name }),
  setIntention: (intention) => set({ intention }),

  addPlacement: (placement) =>
    set((state) => ({ placements: [...state.placements, placement] })),

  updatePlacement: (index, updates) =>
    set((state) => ({
      placements: state.placements.map((p, i) =>
        i === index ? { ...p, ...updates } : p
      ),
    })),

  removePlacement: (index) =>
    set((state) => ({
      placements: state.placements.filter((_, i) => i !== index),
    })),

  clearCanvas: () =>
    set({ placements: [], activeTemplateId: null, gridName: "New Grid", intention: null }),

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
    }),

  deleteGrid: (gridId) =>
    set((state) => ({
      savedGrids: state.savedGrids.filter((g) => g.id !== gridId),
    })),
}));
