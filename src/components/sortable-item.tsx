import { memo } from "react";

import { ClipboardItemCard } from "@/features/clipboard/components/clipboard-item-card";
import { ClipboardItem as ClipboardItemType } from "@/types/clipboard";
import { ClipboardItemContextProvider } from "@/features/clipboard/components/clipboard-item-context-provider";

export const SortableItem = memo(function SortableItem({
  item,
}: {
  item: ClipboardItemType;
}) {
  return (
    <ClipboardItemContextProvider item={item}>
      <ClipboardItemCard />
    </ClipboardItemContextProvider>
  );
});
