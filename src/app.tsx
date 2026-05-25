import "@/main.css";
import { useEffect } from "react";
import { ClipboardTab } from "@/components/clipboard-tab";
import { SymbolsView } from "@/components/symbols-view";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useClipboard } from "@/hooks/use-clipboard";
import { useSystemTheme } from "@/hooks/use-system-theme";

import { initializeBetterAuth } from "@/features/auth/lib/initialize-better-auth";

import { useTabs } from "@/features/tab/hooks/use-tabs";
import { useContextMenu } from "@/features/context-menu/hooks/use-context-menu";

export default function App() {
  useSystemTheme();
  const { tabs, activeTab, setActiveTab } = useTabs();

  useEffect(() => {
    return initializeBetterAuth();
  }, []);

  useContextMenu();

  const { writeTextToSystemClipboard } = useClipboard();

  return (
    <TooltipProvider>
      <Tabs
        value={activeTab}
        onValueChange={(tab) => setActiveTab(tab)}
        className="h-full overflow-hidden bg-background text-foreground pt-3"
      >
        <TabsContent
          value="clipboard"
          keepMounted
          className="flex flex-col overflow-hidden min-h-0 data-hidden:hidden"
        >
          <ClipboardTab />
        </TabsContent>

        <TabsContent
          value="symbols"
          keepMounted
          className="flex flex-col overflow-hidden min-h-0 data-hidden:hidden"
        >
          <SymbolsView
            onSelect={writeTextToSystemClipboard}
            isActive={activeTab === "symbols"}
          />
        </TabsContent>

        <div
          data-tauri-drag-region
          className="flex items-center gap-2 px-3 pb-3 select-none"
        >
          <TabsList className="bg-transparent">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                <tab.icon />
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    </TooltipProvider>
  );
}
