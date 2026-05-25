import { memo, useCallback, useRef } from "react";
import { ClipboardItem as ClipboardItemType } from "@/types/clipboard";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardItemContent } from "@/features/clipboard/components/clipboard-item-content";
import { ClipboardItemMeta } from "@/components/clipboard-item-meta";
import { ClipboardItemActions } from "@/components/clipboard-item-actions";
import { ClipboardItemContextProvider } from "@/features/clipboard/components/clipboard-item-context-provider";

type ClipboardItemProps = {
  item: ClipboardItemType;
  isCopied: boolean;
  onCopy: (item: ClipboardItemType) => void;
  onDelete: (id: number) => void;
};

export const ClipboardItem = memo(function ClipboardItem({
  item,
  isCopied,
  onCopy,
  onDelete,
}: ClipboardItemProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleCopy = useCallback(() => onCopy(item), [onCopy, item]);
  const handleDelete = useCallback(
    () => onDelete(item.id),
    [onDelete, item.id],
  );

  return (
    <ClipboardItemContextProvider item={item}>
      <Card
        ref={cardRef}
        className="gap-2 py-3 group relative"
        onDoubleClick={handleCopy}
      >
        <CardContent className="flex items-start gap-2 px-1 relative">
          <div className="flex flex-col gap-1.5 flex-1 min-w-0 pl-2">
            <ClipboardItemContent item={item} />
            <ClipboardItemMeta item={item} />
          </div>

          <div className="flex flex-col items-center shrink-0">
            {item.is_favorite && (
              <div className="size-1.5 rounded-full bg-amber-500/70 mb-0.5" />
            )}
            <ClipboardItemActions isCopied={isCopied} onDelete={handleDelete} />
          </div>
        </CardContent>
      </Card>
    </ClipboardItemContextProvider>
  );
});
