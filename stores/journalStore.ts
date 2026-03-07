import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorage } from "./asyncStorageAdapter";

export type Mood = "wonderful" | "good" | "neutral" | "low" | "stressed";

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: Mood;
  note: string;
  stonesUsed: string[];
  gridId?: string;
}

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, "id">) => void;
  getEntriesForDate: (date: string) => JournalEntry[];
  getRecentEntries: (count: number) => JournalEntry[];
  getMoodTrend: () => { mood: Mood; count: number }[];
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) =>
        set((s) => ({
          entries: [
            { ...entry, id: Date.now().toString(36) },
            ...s.entries,
          ],
        })),

      getEntriesForDate: (date) =>
        get().entries.filter((e) => e.date === date),

      getRecentEntries: (count) =>
        get().entries.slice(0, count),

      getMoodTrend: () => {
        const counts: Record<Mood, number> = {
          wonderful: 0, good: 0, neutral: 0, low: 0, stressed: 0,
        };
        get().entries.slice(0, 30).forEach((e) => {
          counts[e.mood]++;
        });
        return Object.entries(counts)
          .map(([mood, count]) => ({ mood: mood as Mood, count }))
          .sort((a, b) => b.count - a.count);
      },
    }),
    {
      name: "ishi-journal",
      storage: createJSONStorage(() => asyncStorage),
    }
  )
);
