import { memo } from "react";

import { ClipboardItem } from "@/features/clipboard/components/clipboard-item";
import { ClipboardItem as ClipboardItemType } from "@/types/clipboard";

export const SortableItem = memo(function SortableItem({
  item,
  isCopied,
  onCopy,
  onDelete,
}: {
  item: ClipboardItemType;
  isCopied: boolean;
  onCopy: (item: ClipboardItemType) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  colorMenuOpen?: boolean;
  onColorMenuOpenChange?: (open: boolean) => void;
}) {
  return (
    <ClipboardItem
      item={item}
      isCopied={isCopied}
      onCopy={onCopy}
      onDelete={onDelete}
    />
  );
});
