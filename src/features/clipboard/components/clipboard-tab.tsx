import { ClipboardList } from "@/components/clipboard-list";
import { ClipboardItemSkeletonList } from "@/components/clipboard-item-skeleton";
import { ClipboardTabHeader } from "@/features/clipboard/components/clipboard-tab-header";
import { useSettings } from "@/hooks/use-settings";
import { useClipboardHistory } from "@/features/clipboard/hooks/use-clipboard-history";
import { useClipboardFilters } from "@/hooks/use-clipboard-filters";
import { useClipboardSearchQueryStore } from "@/features/clipboard/stores/clipboard-search-query-store";

export function ClipboardTab() {
  const searchQuery = useClipboardSearchQueryStore(
    (state) => state.searchQuery,
  );

  const { historyLimit } = useSettings();
  const { history, hasMore, loadMore, isLoaded } = useClipboardHistory(
    historyLimit,
    false,
  );

  const { filteredItems } = useClipboardFilters(history, searchQuery);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <>
      <ClipboardTabHeader />

      <div className="flex-1 overflow-y-auto">
        {!isLoaded ? (
          <ClipboardItemSkeletonList />
        ) : (
          <ClipboardList
            items={filteredItems}
            isSearching={isSearching}
            hasMore={hasMore && !isSearching}
            onLoadMore={loadMore}
          />
        )}
      </div>
    </>
  );
}
