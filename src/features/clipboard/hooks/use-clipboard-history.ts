import { useState } from "react";
import { ClipboardContent } from "@/types/clipboard";
import { useClipboardHistoryQuery } from "@/features/clipboard/hooks/use-clipboard-history-query";
import { useReorderClipboardItems } from "@/features/clipboard/hooks/use-reorder-clipboard-items";

export const useClipboardHistory = (
  maxItems: number,
  favoritesFirst: boolean,
) => {
  const { history, historyRef, isLoaded, hasMore, loadMore, invalidate } =
    useClipboardHistoryQuery(maxItems, favoritesFirst);

  const [currentContent, setCurrentContent] = useState<ClipboardContent>({
    type: "empty",
  });

  const reorderItems = useReorderClipboardItems(
    historyRef,
    invalidate,
    maxItems,
    favoritesFirst,
  );

  return {
    history,
    isLoaded,
    hasMore,
    loadMore,
    currentContent,
    setCurrentContent,
    reorderItems,
  };
};
