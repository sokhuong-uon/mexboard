use std::sync::Mutex;
use tauri::{AppHandle, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut};
use tauri_plugin_store::StoreExt;

#[cfg(target_os = "macos")]
pub const DEFAULT_TOGGLE_ACCELERATOR: &str = "Shift+Meta+V";

#[cfg(target_os = "windows")]
pub const DEFAULT_TOGGLE_ACCELERATOR: &str = "Alt+Meta+V";

#[cfg(target_os = "linux")]
pub const DEFAULT_TOGGLE_ACCELERATOR: &str = "Meta+V";

const SETTINGS_FILE_NAME: &str = "settings.json";
const TOGGLE_FIELD: &str = "toggleWindowVisibility";

#[derive(Default)]
pub struct ToggleShortcut(Mutex<Option<Shortcut>>);

pub fn register(app: &AppHandle) {
    let accelerator = load_accelerator(app);
    match apply(app, &accelerator) {
        Ok(()) => eprintln!("[shortcuts] registered {accelerator}"),
        Err(e) => {
            eprintln!("[shortcuts] failed to register {accelerator}: {e}");
            print_hint();
        }
    }
}

pub fn apply(app: &AppHandle, accelerator: &str) -> Result<(), String> {
    let shortcut: Shortcut = to_tauri_accelerator(accelerator)
        .parse()
        .map_err(|e| format!("invalid accelerator: {e}"))?;

    let gs = app.global_shortcut();
    let state = app.state::<ToggleShortcut>();

    let previous = {
        let guard = state.0.lock().map_err(|_| "poisoned mutex".to_string())?;
        guard.clone()
    };
    if previous.as_ref() == Some(&shortcut) {
        return Ok(());
    }

    gs.register(shortcut.clone()).map_err(|e| e.to_string())?;

    if let Some(prev) = previous {
        let _ = gs.unregister(prev);
    }

    let mut guard = state.0.lock().map_err(|_| "poisoned mutex".to_string())?;
    *guard = Some(shortcut);
    Ok(())
}

fn to_tauri_accelerator(accelerator: &str) -> String {
    accelerator
        .split('+')
        .map(|t| match t.trim() {
            "Meta" => "Super",
            "Mod" => "CmdOrCtrl",
            other => other,
        })
        .collect::<Vec<_>>()
        .join("+")
}

fn load_accelerator(app: &AppHandle) -> String {
    let toggle_window_visibility_shortcut = app
        .store(SETTINGS_FILE_NAME)
        .ok()
        .and_then(|store| {
            store
                .get(TOGGLE_FIELD)
                .and_then(|v| v.as_str().map(String::from))
        })
        .unwrap_or_else(|| DEFAULT_TOGGLE_ACCELERATOR.to_string());

    toggle_window_visibility_shortcut
}

fn print_hint() {
    #[cfg(target_os = "linux")]
    eprintln!(
        "  Another app or your desktop environment likely owns this combo. \
         Pick a different one in Preferences or free it in system settings."
    );
    #[cfg(target_os = "windows")]
    eprintln!(
        "  Another app has already registered this combo. Pick a different one \
         in Preferences, or use PowerToys Keyboard Manager to remap a combo to \
         `mexboard.exe toggle`."
    );
    #[cfg(target_os = "macos")]
    eprintln!(
        "  Another app may own this combo. Check System Settings > Keyboard > \
         Keyboard Shortcuts, or pick a different one in Preferences."
    );
}
