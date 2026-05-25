import { useCallback } from "react";

import { useClipboard } from "@/hooks/use-clipboard";
import { ClipboardList } from "@/components/clipboard-list";
import { ClipboardItemSkeletonList } from "@/components/clipboard-item-skeleton";
import { ClipboardHeader } from "@/components/clipboard-window-header";
import { useSettings } from "@/hooks/use-settings";
import { useClipboardHistory } from "@/features/clipboard/hooks/use-clipboard-history";
import { useClipboardFilters } from "@/hooks/use-clipboard-filters";
import { ClipboardItem } from "@/types/clipboard";
import { useClipboardSearchQueryStore } from "@/features/clipboard/stores/clipboard-search-query-store";

type ClipboardTabProps = {
  onPaste: (item: ClipboardItem) => Promise<void>;
  isActiveTab: boolean;
};

export function ClipboardTab({ onPaste, isActiveTab }: ClipboardTabProps) {
  const { writeTextToSystemClipboard, writeImageToSystemClipboard } =
    useClipboard();

  const searchQuery = useClipboardSearchQueryStore(
    (state) => state.searchQuery,
  );

  const { historyLimit, setHistoryLimit } = useSettings();
  const {
    history,
    hasMore,
    loadMore,
    isLoaded,
    currentContent,
    deleteItem,
    toggleFavorite,
    splitEnvItem,
  } = useClipboardHistory(historyLimit, false);

  const { filters, setFilters, filteredItems, toggleFavoriteFilter } =
    useClipboardFilters(history, searchQuery);

  const isSearching = searchQuery.trim().length > 0;

  const handleCopy = useCallback(
    async (item: ClipboardItem) => {
      if (item.content_type === "text" && item.text_content) {
        await writeTextToSystemClipboard(item.text_content);
      } else if (item.content_type === "image" && item.image_data) {
        await writeImageToSystemClipboard(item.image_data);
      }
    },
    [writeTextToSystemClipboard, writeImageToSystemClipboard],
  );

  return (
    <>
      <ClipboardHeader
        historyLimit={historyLimit}
        onHistoryLimitChange={setHistoryLimit}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div className="flex-1 overflow-y-auto">
        {!isLoaded ? (
          <ClipboardItemSkeletonList />
        ) : (
          <ClipboardList
            items={filteredItems}
            currentContent={currentContent}
            onCopy={handleCopy}
            onPaste={onPaste}
            onDelete={deleteItem}
            onToggleFavorite={toggleFavorite}
            onSplitEnv={splitEnvItem}
            onToggleFavoriteFilter={toggleFavoriteFilter}
            isSearching={isSearching}
            hasMore={hasMore && !isSearching}
            onLoadMore={loadMore}
            isActive={isActiveTab}
          />
        )}
      </div>
    </>
  );
}
