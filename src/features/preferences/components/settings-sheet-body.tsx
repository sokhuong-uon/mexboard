import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GeneralSettings } from "@/features/preferences/components/general-settings";
import { HotkeysSettings } from "@/features/preferences/components/hotkeys-settings";
import { Cloud, Keyboard, Settings2 } from "lucide-react";
import { SyncCloudConnect } from "@/features/sync/components/sync-cloud-connect";

type SettingsBodyProps = {
  historyLimit: number;
  onHistoryLimitChange: (limit: number) => void;
};

export function SettingsSheetBody({
  historyLimit,
  onHistoryLimitChange,
}: SettingsBodyProps) {
  return (
    <Tabs defaultValue="general" className="px-6 pb-6">
      <TabsList className="w-full mb-3">
        <TabsTrigger value="general" className="flex-1 text-xs">
          <Settings2 />
        </TabsTrigger>

        <TabsTrigger value="cloud" className="flex-1 text-xs gap-1.5">
          <Cloud />
        </TabsTrigger>

        <TabsTrigger value="keymap" className="flex-1 text-xs">
          <Keyboard />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralSettings
          historyLimit={historyLimit}
          onHistoryLimitChange={onHistoryLimitChange}
        />
      </TabsContent>

      <TabsContent value="cloud">
        <SyncCloudConnect />
      </TabsContent>

      <TabsContent value="keymap">
        <HotkeysSettings />
      </TabsContent>
    </Tabs>
  );
}
