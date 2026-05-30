use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{AppHandle, Manager};
use tokio::time::{interval, Duration};

use crate::clipboard::manager;

pub struct MonitorState {
    pub is_monitoring: AtomicBool,
}

impl MonitorState {
    pub fn new() -> Self {
        Self {
            is_monitoring: AtomicBool::new(true),
        }
    }
}

pub fn start(app_handle: &AppHandle) {
    let app = app_handle.clone();

    tauri::async_runtime::spawn(async move {
        let monitor_state = app.state::<MonitorState>();
        let mut ticker = interval(Duration::from_millis(500));

        loop {
            if !monitor_state.is_monitoring.load(Ordering::Relaxed) {
                continue;
            }
            ticker.tick().await;

            let clipboard_text = app.state::<manager::ClipboardManager>().read().await;

            if let Ok(text) = clipboard_text {
                if !text.is_empty() {
                    log::info!("Clipboard copied: {:?}", text);
                }
            }
        }
    });
}
