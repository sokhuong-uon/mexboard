import { useCallback } from "react";
import { commands } from "@/bindings";
import { ClipboardItem } from "@/types/clipboard";

export function usePasteActions() {
  const pasteClipboardItem = useCallback(async (item: ClipboardItem) => {
    const result = await commands.pasteItem(
      item.content_type,
      item.text_content ?? null,
      item.image_data ?? null,
    );
    if (result.status === "error") {
      console.error("[pasteClipboardItem] paste_item failed:", result.error);
    }
  }, []);

  const pasteText = useCallback(async (text: string) => {
    const result = await commands.pasteItem("text", text, null);
    if (result.status === "error") {
      console.error("[pasteText] paste_item failed:", result.error);
    }
  }, []);

  return { pasteClipboardItem, pasteText };
}
