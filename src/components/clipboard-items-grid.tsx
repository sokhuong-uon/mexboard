import type { ReactNode } from "react";
import type { ClipboardItem as ClipboardItemType } from "@/types/clipboard";
import { SortableItem } from "./sortable-item";

type ClipboardItemsGridProps = {
  items: ClipboardItemType[];
  ariaLabel?: string;
  footer?: ReactNode;
};

export function ClipboardItemsGrid({
  items,
  ariaLabel,
  footer,
}: ClipboardItemsGridProps) {
  return (
    <ul
      className="grid grid-cols-1 gap-3 px-4 pt-1 md:grid-cols-2"
      role={ariaLabel ? "listbox" : undefined}
      aria-label={ariaLabel}
    >
      {items.map((item) => (
        <SortableItem key={item.id} item={item} />
      ))}
      {footer}
    </ul>
  );
}
