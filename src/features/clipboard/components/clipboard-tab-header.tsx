import { SettingsSheet } from "@/features/preferences/components/settings-sheet";
import { ClipboardSearchBox } from "@/features/clipboard/components/clipboard-search-box";

export const ClipboardTabHeader = () => {
  return (
    <header className="flex items-center gap-2 px-4 pb-2 pt-1 group/header">
      <ClipboardSearchBox className="flex-1" />
      <SettingsSheet />
    </header>
  );
};
