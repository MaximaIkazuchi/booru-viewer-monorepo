import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TagsState = {
  tags: string[];
  add: (tag: string) => void;
  remove: (tag: string) => void;
  clear: () => void;
};

export const useTagsStore = create<TagsState>()(
  persist(
    (set) => ({
      tags: [],
      add: (tag) =>
        set((state) => ({
          tags: (!new Set(state.tags).has(tag)
            ? [...state.tags, tag]
            : [...state.tags]
          ).sort(),
        })),
      remove: (tag) =>
        set((state) => ({
          tags: state.tags.filter((t) => t !== tag),
        })),
      clear: () => set({ tags: [] }),
    }),
    {
      name: "activated-tags-store",
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as TagsState),
      }),
    }
  )
);
