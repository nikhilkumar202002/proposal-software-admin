import { create } from 'zustand'

export const useEditorStore = create((set) => ({
  content: null,
  isDirty: false,
  readOnly: false,
  wordCount: 0,
  characterCount: 0,
  lastSavedAt: null,
  activeFormatting: {
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrike: false,
    isCode: false,
    headingLevel: 0,
    alignment: 'left',
    isBulletList: false,
    isOrderedList: false,
    isBlockquote: false,
    isLink: false,
    isTable: false,
  },

  setContent: (content) =>
    set({
      content,
      isDirty: true,
    }),

  setReadOnly: (readOnly) => set({ readOnly }),

  setStats: ({ wordCount, characterCount }) =>
    set({
      wordCount,
      characterCount,
    }),

  setActiveFormatting: (formatting) =>
    set((state) => ({
      activeFormatting: {
        ...state.activeFormatting,
        ...formatting,
      },
    })),

  markSaved: () =>
    set({
      isDirty: false,
      lastSavedAt: new Date().toISOString(),
    }),

  reset: () =>
    set({
      content: null,
      isDirty: false,
      readOnly: false,
      wordCount: 0,
      characterCount: 0,
      lastSavedAt: null,
    }),
}))

export default useEditorStore
