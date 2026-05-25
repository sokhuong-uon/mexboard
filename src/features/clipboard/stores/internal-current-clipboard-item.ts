import { ClipboardItem } from '@/types/clipboard'
import { create } from 'zustand'

type InternalCurrentClipboardItem = {
  currentClipboard?: ClipboardItem
  setCurrentClipboard: (currentClipboard: ClipboardItem) => void
}

export const useInternalCurrentClipboardItem = create<InternalCurrentClipboardItem>()((set) => ({
  currentClipboard: undefined,
  setCurrentClipboard: (currentClipboard: ClipboardItem) => set({ currentClipboard }),
}))
