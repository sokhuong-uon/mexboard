import { EmptyState } from "@/components/clipboard-empty-state";
import { Button } from "@/components/ui/button";
import { ClipboardItemsGrid } from "@/components/clipboard-items-grid";
import {
  ClipboardItem as ClipboardItemType,
  ClipboardContent,
} from "@/types/clipboard";
import { isItemCopied } from "@/features/clipboard/utils/is-item-copied";
import { SortableItem } from "./sortable-item";

type ClipboardListProps = {
  items: ClipboardItemType[];
  currentContent: ClipboardContent;
  onDelete: (id: number) => void;
  isSearching?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
};

export const ClipboardList = ({
  items,
  currentContent,
  onDelete,
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

  return (
    <ClipboardItemsGrid
      items={items}
      footer={loadMoreButton}
      renderItem={(item) => (
        <SortableItem
          key={item.id}
          item={item}
          isCopied={isItemCopied(item, currentContent)}
          onDelete={onDelete}
        />
      )}
    />
  );
};
