import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { CopyToClipboardButton } from "@/features/clipboard/components/copy-to-clipboard-button";
import { useInternalCurrentClipboardItem } from "@/features/clipboard/stores/internal-current-clipboard-item";
import { useClipboardItem } from "@/features/clipboard/hooks/use-clipboard-item";

export const ClipboardItemActions = () => {
  const currentInternalClipboard = useInternalCurrentClipboardItem(
    (state) => state.currentClipboard,
  );

  const item = useClipboardItem();

  const isCopied = currentInternalClipboard?.id !== item.id;

  return (
    <div className="flex invisible group-hover:visible flex-col items-center gap-0.5 shrink-0 pt-0.5">
      <Tooltip>
        <TooltipTrigger render={<CopyToClipboardButton />}></TooltipTrigger>

        <TooltipContent className="pointer-events-none">
          {isCopied ? "Currently in clipboard" : "Copy to clipboard"}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-neutral-400 dark:text-neutral-600 dark:hover:text-foreground hover:text-foreground cursor-pointer"
            />
          }
        >
          <Trash2 className="size-3.5" />
        </TooltipTrigger>

        <TooltipContent className="pointer-events-none">
          Delete from history
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
