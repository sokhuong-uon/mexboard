import { useCallback, useMemo } from "react";

import { EmptyState } from "@/components/clipboard-empty-state";
import { Button } from "@/components/ui/button";
import { ClipboardItemsGrid } from "@/components/clipboard-items-grid";
import {
  ClipboardItem as ClipboardItemType,
  ClipboardContent,
} from "@/types/clipboard";
import { useClipboardListHotkeys } from "@/features/clipboard/hooks/use-clipboard-list-hotkeys";
import { isItemCopied } from "@/features/clipboard/utils/is-item-copied";
import { SortableItem } from "./sortable-item";

type ClipboardListProps = {
  items: ClipboardItemType[];
  currentContent: ClipboardContent;
  onCopy: (item: ClipboardItemType) => void;
  onPaste?: (item: ClipboardItemType) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onSplitEnv?: (id: number) => void;
  onToggleFavoriteFilter?: () => void;
  isSearching?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isActive?: boolean;
};

export const ClipboardList = ({
  items,
  currentContent,
  onCopy,
  onPaste,
  onDelete,
  onToggleFavorite,
  onToggleFavoriteFilter,
  isSearching = false,
  hasMore = false,
  onLoadMore,
  isActive = true,
}: ClipboardListProps) => {
  const { colorMenuItemId, setColorMenuItemId } = useClipboardListHotkeys({
    items,
    isActive,
    isSearching,
    onPaste,
    onToggleFavorite,
    onToggleFavoriteFilter,
  });

  const colorMenuHandlers = useMemo(
    () => new Map<number, (open: boolean) => void>(),
    [],
  );
  const getColorMenuHandler = useCallback(
    (itemId: number) => {
      let handler = colorMenuHandlers.get(itemId);
      if (!handler) {
        handler = (open: boolean) => setColorMenuItemId(open ? itemId : null);
        colorMenuHandlers.set(itemId, handler);
      }
      return handler;
    },
    [colorMenuHandlers, setColorMenuItemId],
  );

  if (items.length === 0) {
    return <EmptyState isSearching={isSearching} />;
  }

  const loadMoreButton = hasMore && onLoadMore && (
    <li className="list-none">
      <Button
        variant="ghost"
        className="w-full text-muted-foreground"
        onClick={onLoadMore}
      >
        Load more
      </Button>
    </li>
  );

  return (
    <ClipboardItemsGrid
      items={items}
      footer={loadMoreButton}
      renderItem={(item) => (
        <SortableItem
          key={item.id}
          item={item}
          isCopied={isItemCopied(item, currentContent)}
          onCopy={onCopy}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          colorMenuOpen={colorMenuItemId === item.id}
          onColorMenuOpenChange={getColorMenuHandler(item.id)}
        />
      )}
    />
  );
};
