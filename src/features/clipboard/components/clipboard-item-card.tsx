import { memo, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardItemContent } from "@/features/clipboard/components/clipboard-item-content";
import { ClipboardItemMeta } from "@/components/clipboard-item-meta";
import { ClipboardItemActions } from "@/components/clipboard-item-actions";
import { useClipboard } from "@/hooks/use-clipboard";
import { useClipboardItem } from "../hooks/use-clipboard-item";

type ClipboardItemProps = {
  isCopied: boolean;
  onDelete: (id: number) => void;
};

export const ClipboardItemCard = memo(function ClipboardItem({
  isCopied,
  onDelete,
}: ClipboardItemProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { writeTextToSystemClipboard, writeImageToSystemClipboard } =
    useClipboard();
  const item = useClipboardItem();

  const handleDelete = useCallback(
    () => onDelete(item.id),
    [onDelete, item.id],
  );

  const handleCopy = useCallback(async () => {
    if (item.content_type === "text" && item.text_content) {
      await writeTextToSystemClipboard(item.text_content);
    } else if (item.content_type === "image" && item.image_data) {
      await writeImageToSystemClipboard(item.image_data);
    }
  }, [writeTextToSystemClipboard, writeImageToSystemClipboard]);

  return (
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
  );
});
