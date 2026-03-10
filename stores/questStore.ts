import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorage } from "./asyncStorageAdapter";
import { ALL_QUESTS, type Quest } from "../data/quests";

interface QuestProgress {
  questId: string;
  current: number;
  completed: boolean;
  completedAt: string | null;
}

interface QuestState {
  questProgress: Record<string, QuestProgress>;
  completedQuestIds: string[];

  // Actions
  getProgress: (questId: string) => QuestProgress;
  incrementQuest: (questId: string, amount?: number) => boolean; // returns true if newly completed
  setQuestProgress: (questId: string, current: number) => boolean;
  isCompleted: (questId: string) => boolean;
  getActiveQuests: (level: number) => { quest: Quest; progress: QuestProgress }[];
  getCompletedQuests: () => { quest: Quest; progress: QuestProgress }[];

  /** Bulk update from external state (called when grid saved, session done, etc.) */
  syncFromProgress: (data: {
    gridsCompleted: number;
    sessionsCompleted: number;
    streakDays: number;
    journalEntries: number;
    gridIntentionCounts: Record<string, number>;
    stoneUseCounts: Record<string, number>;
  }) => string[]; // returns newly completed quest IDs
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      questProgress: {},
      completedQuestIds: [],

      getProgress: (questId) => {
        const state = get();
        return state.questProgress[questId] || { questId, current: 0, completed: false, completedAt: null };
      },

      incrementQuest: (questId, amount = 1) => {
        const state = get();
        const quest = ALL_QUESTS.find((q) => q.id === questId);
        if (!quest) return false;

        const existing = state.questProgress[questId] || { questId, current: 0, completed: false, completedAt: null };
        if (existing.completed) return false;

        const newCurrent = existing.current + amount;
        const nowCompleted = newCurrent >= quest.target;

        set({
          questProgress: {
            ...state.questProgress,
            [questId]: {
              questId,
              current: newCurrent,
              completed: nowCompleted,
              completedAt: nowCompleted ? new Date().toISOString() : null,
            },
          },
          completedQuestIds: nowCompleted
            ? [...state.completedQuestIds, questId]
            : state.completedQuestIds,
        });

        return nowCompleted;
      },

      setQuestProgress: (questId, current) => {
        const state = get();
        const quest = ALL_QUESTS.find((q) => q.id === questId);
        if (!quest) return false;

        const existing = state.questProgress[questId] || { questId, current: 0, completed: false, completedAt: null };
        if (existing.completed) return false;

        const nowCompleted = current >= quest.target;

        set({
          questProgress: {
            ...state.questProgress,
            [questId]: {
              questId,
              current,
              completed: nowCompleted,
              completedAt: nowCompleted ? new Date().toISOString() : null,
            },
          },
          completedQuestIds: nowCompleted
            ? [...state.completedQuestIds, questId]
            : state.completedQuestIds,
        });

        return nowCompleted;
      },

      isCompleted: (questId) => get().completedQuestIds.includes(questId),

      getActiveQuests: (level) => {
        const state = get();
        const maxTier = level >= 9 ? 3 : level >= 5 ? 2 : 1;
        return ALL_QUESTS
          .filter((q) => q.tier <= maxTier && !state.completedQuestIds.includes(q.id))
          .map((quest) => ({
            quest,
            progress: state.questProgress[quest.id] || { questId: quest.id, current: 0, completed: false, completedAt: null },
          }));
      },

      getCompletedQuests: () => {
        const state = get();
        return ALL_QUESTS
          .filter((q) => state.completedQuestIds.includes(q.id))
          .map((quest) => ({
            quest,
            progress: state.questProgress[quest.id]!,
          }));
      },

      syncFromProgress: (data) => {
        const state = get();
        const newlyCompleted: string[] = [];

        for (const quest of ALL_QUESTS) {
          if (state.completedQuestIds.includes(quest.id)) continue;

          let current = 0;
          switch (quest.type) {
            case "grid_count":
              current = data.gridsCompleted;
              break;
            case "grid_intention":
              current = quest.intention ? (data.gridIntentionCounts[quest.intention] || 0) : 0;
              break;
            case "stone_use":
              current = quest.stoneIds
                ? Math.min(...quest.stoneIds.map((sid) => data.stoneUseCounts[sid] || 0))
                : 0;
              break;
            case "session":
              current = data.sessionsCompleted;
              break;
            case "streak":
              current = data.streakDays;
              break;
            case "journal":
              current = data.journalEntries;
              break;
          }

          const existing = state.questProgress[quest.id];
          const wasCompleted = existing?.completed || false;
          const nowCompleted = current >= quest.target;

          if (current !== (existing?.current || 0) || nowCompleted !== wasCompleted) {
            state.questProgress[quest.id] = {
              questId: quest.id,
              current,
              completed: nowCompleted,
              completedAt: nowCompleted && !wasCompleted ? new Date().toISOString() : (existing?.completedAt || null),
            };

            if (nowCompleted && !wasCompleted) {
              newlyCompleted.push(quest.id);
              state.completedQuestIds.push(quest.id);
            }
          }
        }

        if (newlyCompleted.length > 0 || Object.keys(state.questProgress).length > 0) {
          set({
            questProgress: { ...state.questProgress },
            completedQuestIds: [...state.completedQuestIds],
          });
        }

        return newlyCompleted;
      },
    }),
    {
      name: "ishi-quests",
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({
        questProgress: state.questProgress,
        completedQuestIds: state.completedQuestIds,
      }),
    }
  )
);
