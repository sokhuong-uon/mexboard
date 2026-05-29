import { useState } from "react";

import {
  HOTKEY_ACTIONS,
  type HotkeyAction,
} from "@/features/hotkey/hotkey-actions";
import { HotkeyRow } from "@/features/preferences/components/hotkey-row";
import { useHotkeysConfig } from "@/features/hotkey/hooks/use-hotkeys-config";

export function HotkeysSettings() {
  const {
    hotkeys,
    setHotkey: onSetHotkey,
    resetHotkey: onResetHotkey,
  } = useHotkeysConfig();

  const [recordingAction, setRecordingAction] = useState<HotkeyAction | null>(
    null,
  );

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-medium text-foreground">
          Keyboard shortcuts
        </span>

        <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
          Reset all
        </button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border/60">
        {HOTKEY_ACTIONS.map((action) => (
          <HotkeyRow
            key={action}
            action={action}
            hotkey={hotkeys[action]}
            isRecording={recordingAction === action}
            onStartRecording={() => setRecordingAction(action)}
            onStopRecording={() => setRecordingAction(null)}
            onSetHotkey={onSetHotkey}
            onResetHotkey={onResetHotkey}
          />
        ))}
      </div>
    </div>
  );
}
