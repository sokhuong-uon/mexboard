import { useState } from "react";
import type { ClipboardItem as ClipboardItemType } from "@/types/clipboard";

export const QUICK_PASTE_LIMIT = 9;

type UseClipboardListHotkeysParams = {
  items: ClipboardItemType[];
  isSearching: boolean;
};

export function useClipboardListHotkeys({
  items,
  isSearching,
}: UseClipboardListHotkeysParams) {

  const [activeId, setActiveId] = useState<number | null>(null);
  const [colorMenuItemId, setColorMenuItemId] = useState<number | null>(null);

  const [prevIsSearching, setPrevIsSearching] = useState(isSearching);
  if (isSearching !== prevIsSearching) {
    setPrevIsSearching(isSearching);
    setActiveId(null);
  }

  const effectiveActiveId = isSearching === prevIsSearching ? activeId : null;
  const activeIndex =
    effectiveActiveId != null
      ? items.findIndex((i) => i.id === effectiveActiveId)
      : -1;

  return {
    activeIndex,
    setActiveId,
    colorMenuItemId,
    setColorMenuItemId,
  };
}
