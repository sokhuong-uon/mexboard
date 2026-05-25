import { useState } from "react";
import { useHotkey } from "@tanstack/react-hotkeys";

import { useHotkeysConfig } from "@/features/hotkey/hooks/use-hotkeys-config";
import type { ClipboardItem as ClipboardItemType } from "@/types/clipboard";

export const QUICK_PASTE_LIMIT = 9;

type UseClipboardListHotkeysParams = {
  items: ClipboardItemType[];
  isActive: boolean;
  isSearching: boolean;
  onPaste?: (item: ClipboardItemType) => void;
  onToggleFavorite: (id: number) => void;
  onToggleFavoriteFilter?: () => void;
};

export function useClipboardListHotkeys({
  items,
  isActive,
  isSearching,
  onPaste,
  onToggleFavorite,
  onToggleFavoriteFilter,
}: UseClipboardListHotkeysParams) {
  const { hotkeys } = useHotkeysConfig();

  const [activeId, setActiveId] = useState<number | null>(null);
  const [colorMenuItemId, setColorMenuItemId] = useState<number | null>(null);

  // Reset selection when toggling between list and search. Done during render
  // (not in an effect) so the next render already sees activeId === null —
  // otherwise the freshly-mounted SearchResultItem/SortableItem briefly
  // renders as active and its focus effect steals focus from the search box.
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

  const setActiveIndex = (index: number) => {
    setActiveId(index >= 0 && index < items.length ? items[index].id : null);
  };

  const moveDown = () => {
    if (items.length === 0) return;
    setActiveIndex(Math.min(activeIndex + 1, items.length - 1));
  };

  const moveUp = () => {
    if (items.length === 0) return;
    setActiveIndex(Math.max(activeIndex - 1, 0));
  };

  const pasteActive = () => {
    if (activeIndex >= 0 && items[activeIndex] && onPaste) {
      onPaste(items[activeIndex]);
    }
  };

  const colorMenuIsOpen = colorMenuItemId != null;
  const hotkeysDisabled = !isActive || colorMenuIsOpen;

  useHotkey(hotkeys.moveDown, moveDown, { enabled: !hotkeysDisabled });
  useHotkey(hotkeys.moveUp, moveUp, { enabled: !hotkeysDisabled });

  useHotkey(hotkeys.paste, pasteActive, {
    enabled: activeIndex >= 0 && !hotkeysDisabled,
  });

  useHotkey(
    hotkeys.favorite,
    () => {
      if (activeIndex >= 0 && items[activeIndex]) {
        onToggleFavorite(items[activeIndex].id);
      }
    },
    { enabled: activeIndex >= 0 && !hotkeysDisabled },
  );

  useHotkey(
    hotkeys.colorMenu,
    () => {
      if (activeIndex >= 0 && items[activeIndex]?.detected_color) {
        setColorMenuItemId(items[activeIndex].id);
      }
    },
    { enabled: activeIndex >= 0 && !hotkeysDisabled },
  );

  useHotkey(hotkeys.favoritesFirst, () => onToggleFavoriteFilter?.(), {
    enabled: !hotkeysDisabled,
  });

  useHotkey("ArrowDown", moveDown, { enabled: isActive });
  useHotkey("ArrowUp", moveUp, { enabled: isActive });

  useHotkey(
    hotkeys.jumpTop,
    () => {
      if (items.length > 0) setActiveIndex(0);
    },
    { enabled: !hotkeysDisabled },
  );
  useHotkey(
    hotkeys.jumpBottom,
    () => {
      if (items.length > 0) setActiveIndex(items.length - 1);
    },
    { enabled: !hotkeysDisabled },
  );

  return {
    activeIndex,
    setActiveId,
    colorMenuItemId,
    setColorMenuItemId,
  };
}
