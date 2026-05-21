import { Copy, SquarePercent } from "lucide-react";
import { useHotkeysConfig } from "@/features/hotkey/hooks/use-hotkeys-config";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useState } from "react";

const TAB_ORDER = ["clipboard", "symbols"] as const;

export function useTabs() {
  const [activeTab, setActiveTab] = useState<typeof TAB_ORDER[number]>("clipboard");

  const { hotkeys } = useHotkeysConfig();

  useHotkey(
    hotkeys.cycleTabs,
    () => {
      setActiveTab((previousTab) => {
        const previousTabIndex = TAB_ORDER.indexOf(previousTab);
        return TAB_ORDER[(previousTabIndex + 1) % TAB_ORDER.length];
      });
    },
    { ignoreInputs: true },
  );

  return {
    activeTab,
    setActiveTab,
    tabs: [
        {
          label: 'Clipboard',
          value: 'clipboard',
          icon: Copy
        },
        {
          label: 'Symbols',
          value: 'symbols',
          icon: SquarePercent
        }
      ]
  }
}
