import { FetchSource } from "@repo/api-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SettingsState = {
  toggle: (key: keyof Settings) => void;
  set: (key: keyof Settings, value: string) => void;
} & Settings;

type Settings = {
  source: FetchSource;
  filter: "general" | "sensitive" | "explicit";
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      filter: "general",
      source: "gelbooru",
      toggle: (key) => set((state) => ({ [key]: !state[key] })),
      set: (key, value) => set(() => ({ [key]: value })),
    }),
    {
      name: "activated-settings-store",
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as SettingsState),
      }),
    }
  )
);
