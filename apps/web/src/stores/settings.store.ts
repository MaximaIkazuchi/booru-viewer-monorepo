import { FetchSource } from "@repo/api-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SettingsState = {
  toggle: (key: keyof Settings) => void;
  set: (key: keyof Settings, value: string) => void;
} & Settings;

type Settings = {
  source: FetchSource;
  r18: boolean;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      r18: false,
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
