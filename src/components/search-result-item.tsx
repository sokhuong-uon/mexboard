import { memo } from "react";

import { ClipboardItemCard } from "@/features/clipboard/components/clipboard-item-card";

export const SearchResultItem = memo(function SearchResultItem({
  isCopied,
  onDelete,
}: {
  isCopied: boolean;
  onDelete: (id: number) => void;
}) {
  return <ClipboardItemCard isCopied={isCopied} onDelete={onDelete} />;
});
