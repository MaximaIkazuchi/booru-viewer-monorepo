import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SettingsState = {
  toggle: (key: keyof Settings) => void;
} & Settings;

type Settings = {
  r18: boolean;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      r18: false,
      toggle: (key) => set((state) => ({ [key]: !state[key] })),
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
