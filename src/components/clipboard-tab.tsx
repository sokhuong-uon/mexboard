import { ClipboardList } from "@/components/clipboard-list";
import { ClipboardItemSkeletonList } from "@/components/clipboard-item-skeleton";
import { ClipboardHeader } from "@/components/clipboard-window-header";
import { useSettings } from "@/hooks/use-settings";
import { useClipboardHistory } from "@/features/clipboard/hooks/use-clipboard-history";
import { useClipboardFilters } from "@/hooks/use-clipboard-filters";
import { useClipboardSearchQueryStore } from "@/features/clipboard/stores/clipboard-search-query-store";

export function ClipboardTab() {
  const searchQuery = useClipboardSearchQueryStore(
    (state) => state.searchQuery,
  );

  const { historyLimit, setHistoryLimit } = useSettings();
  const { history, hasMore, loadMore, isLoaded, currentContent, deleteItem } =
    useClipboardHistory(historyLimit, false);

  const { filters, setFilters, filteredItems } = useClipboardFilters(
    history,
    searchQuery,
  );

  const isSearching = searchQuery.trim().length > 0;

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
            onDelete={deleteItem}
            isSearching={isSearching}
            hasMore={hasMore && !isSearching}
            onLoadMore={loadMore}
          />
        )}
      </div>
    </>
  );
}
