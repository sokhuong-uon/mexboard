import { EmptyState } from "@/components/clipboard-empty-state";
import { Button } from "@/components/ui/button";
import { ClipboardItemsGrid } from "@/components/clipboard-items-grid";
import { ClipboardItem as ClipboardItemType } from "@/types/clipboard";

type ClipboardListProps = {
  items: ClipboardItemType[];
  isSearching?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
};

export const ClipboardList = ({
  items,
  isSearching = false,
  hasMore = false,
  onLoadMore,
}: ClipboardListProps) => {
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

  return <ClipboardItemsGrid items={items} footer={loadMoreButton} />;
};
