import { create } from "zustand";
import type { UserProgress } from "../types";
import { XP_TABLE } from "../types";

interface ProgressionState {
  progress: UserProgress;
  addXP: (amount: number) => void;
  unlockStone: (stoneId: string) => void;
  unlockTemplate: (templateId: string) => void;
  completeAchievement: (achievementId: string) => void;
  completeSkill: (skillId: string) => void;
  incrementGrids: () => void;
  incrementSessions: () => void;
  setDailyIntention: (done: boolean) => void;
  updateStreak: () => void;
  isStoneUnlocked: (stoneId: string) => boolean;
  isTemplateUnlocked: (templateId: string) => boolean;
}

function calculateLevel(xp: number): number {
  const levels = Object.entries(XP_TABLE)
    .map(([lvl, req]) => ({ level: Number(lvl), xpRequired: req }))
    .sort((a, b) => b.xpRequired - a.xpRequired);

  for (const { level, xpRequired } of levels) {
    if (xp >= xpRequired) return level;
  }
  return 1;
}

const initialProgress: UserProgress = {
  xpTotal: 0,
  level: 1,
  currentStreakDays: 0,
  longestStreakDays: 0,
  stonesUnlocked: [
    "rose_quartz",
    "amethyst",
    "clear_quartz",
    "tigers_eye",
    "black_tourmaline",
  ],
  templatesUnlocked: ["sankaku", "shikaku", "freeform"],
  skillsCompleted: [],
  achievements: [],
  gridsCompletedCount: 0,
  guidedSessionsCount: 0,
  dailyIntentionToday: false,
  lastActiveDate: new Date().toISOString().split("T")[0],
};

export const useProgressionStore = create<ProgressionState>((set, get) => ({
  progress: initialProgress,

  addXP: (amount) =>
    set((state) => {
      const newXP = state.progress.xpTotal + amount;
      return {
        progress: {
          ...state.progress,
          xpTotal: newXP,
          level: calculateLevel(newXP),
        },
      };
    }),

  unlockStone: (stoneId) =>
    set((state) => ({
      progress: {
        ...state.progress,
        stonesUnlocked: state.progress.stonesUnlocked.includes(stoneId)
          ? state.progress.stonesUnlocked
          : [...state.progress.stonesUnlocked, stoneId],
      },
    })),

  unlockTemplate: (templateId) =>
    set((state) => ({
      progress: {
        ...state.progress,
        templatesUnlocked: state.progress.templatesUnlocked.includes(
          templateId
        )
          ? state.progress.templatesUnlocked
          : [...state.progress.templatesUnlocked, templateId],
      },
    })),

  completeAchievement: (achievementId) =>
    set((state) => ({
      progress: {
        ...state.progress,
        achievements: state.progress.achievements.includes(achievementId)
          ? state.progress.achievements
          : [...state.progress.achievements, achievementId],
      },
    })),

  completeSkill: (skillId) =>
    set((state) => ({
      progress: {
        ...state.progress,
        skillsCompleted: state.progress.skillsCompleted.includes(skillId)
          ? state.progress.skillsCompleted
          : [...state.progress.skillsCompleted, skillId],
      },
    })),

  incrementGrids: () =>
    set((state) => ({
      progress: {
        ...state.progress,
        gridsCompletedCount: state.progress.gridsCompletedCount + 1,
      },
    })),

  incrementSessions: () =>
    set((state) => ({
      progress: {
        ...state.progress,
        guidedSessionsCount: state.progress.guidedSessionsCount + 1,
      },
    })),

  setDailyIntention: (done) =>
    set((state) => ({
      progress: { ...state.progress, dailyIntentionToday: done },
    })),

  updateStreak: () =>
    set((state) => {
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];
      const last = state.progress.lastActiveDate;

      let newStreak = state.progress.currentStreakDays;
      if (last === yesterday) {
        newStreak += 1;
      } else if (last !== today) {
        newStreak = 1;
      }

      return {
        progress: {
          ...state.progress,
          currentStreakDays: newStreak,
          longestStreakDays: Math.max(
            newStreak,
            state.progress.longestStreakDays
          ),
          lastActiveDate: today,
        },
      };
    }),

  isStoneUnlocked: (stoneId) =>
    get().progress.stonesUnlocked.includes(stoneId),

  isTemplateUnlocked: (templateId) =>
    get().progress.templatesUnlocked.includes(templateId),
}));
