use crate::database::{structs::insert_clipboard_db_params::InsertClipboardDbParams, Database};
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{AppHandle, Manager};
use tokio::time::{interval, Duration};

use crate::{clipboard::manager, crypto};

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
        let mut ticker = interval(Duration::from_millis(500));

        loop {
            let monitor_state = app.state::<MonitorState>();
            if !monitor_state.is_monitoring.load(Ordering::Relaxed) {
                continue;
            }
            ticker.tick().await;

            let db = app.state::<Database>();

            let clipboard_text = app.state::<manager::ClipboardManager>().read_text().await;

            match clipboard_text {
                Ok(text) => {
                    if !text.is_empty() {
                        let hash = crypto::hash_bytes::hash(text.as_bytes());
                        log::info!("Text: {:?}", text);
                        log::info!("Text hash: {:?}", hash);

                        if let Ok(id) = db.check_duplication_by_hash(hash) {
                            log::info!("Duplication found: {}", id);
                            continue;
                        }

                        log::info!("No duplicate found");

                        if let Err(err) = db.insert_text(InsertClipboardDbParams {
                            content: Some(text),
                            hash: hash.as_bytes().to_vec(),
                            image: None,
                            width: None,
                            height: None,
                        }) {
                            log::error!("Failed to insert text: {}", err);
                        }
                    }
                }
                Err(err) => {
                    log::error!("Failed to read clipboard as text: {}", err);

                    let clipboard_image =
                        app.state::<manager::ClipboardManager>().read_image().await;

                    match clipboard_image {
                        Ok(image) => {
                            if let Some(image) = image {
                                let hash = crypto::hash_bytes::hash(&image.0);
                                log::info!("Image hash: {:?}", hash);
                            }
                        }
                        Err(err) => {
                            log::error!("Failed to read clipboard as image: {}", err);
                        }
                    }
                }
            }
        }
    });
}
