// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod caret;
mod cli;
mod clipboard;
mod clipboard_monitor;
mod commands;
mod crypto;
mod database;
mod detection;
mod schema;
mod shortcuts;
mod tray;
mod utils;
pub mod websocket;
mod window;

use clipboard::ClipboardManager;
use clipboard_monitor::MonitorState;
use commands::create_command_builder;
use tauri::Manager;
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_plugin_notification::NotificationExt;
use websocket::WebSocketState;
use window::main_window;

fn main() {
    let command_builder = create_command_builder();

    #[cfg(debug_assertions)]
    command_builder
        .export(
            specta_typescript::Typescript::default(),
            concat!(env!("CARGO_MANIFEST_DIR"), "/../src/bindings.ts"),
        )
        .expect("failed to export specta bindings");

    let log_level = if cfg!(debug_assertions) {
        tauri_plugin_log::log::LevelFilter::Debug
    } else {
        tauri_plugin_log::log::LevelFilter::Off
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_log::Builder::new().level(log_level).build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            cli::handle_cli_args(app, Some(args));
        }))
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|_app, shortcut, _event| {
                    log::info!("Received shortcut: {:?}", shortcut);
                })
                .build(),
        )
        .plugin(tauri_plugin_drag::init())
        .plugin(tauri_plugin_opener::init())
        .manage(ClipboardManager::new())
        .manage(MonitorState::new())
        .manage(shortcuts::ToggleShortcut::default())
        .manage(WebSocketState::new())
        .setup(move |app| {
            cli::handle_cli_args(app, None);

            #[cfg(any(target_os = "linux", all(debug_assertions, windows)))]
            app.deep_link().register_all()?;

            commands::init_keyring().expect("failed to initialize keyring store");

            let database = database::initialization::init(app);
            app.manage(database);

            caret::init();
            tray::setup(app)?;
            main_window::setup(app);

            clipboard_monitor::start_monitor(app.handle());

            shortcuts::register(app.handle());

            let start_urls = app.deep_link().get_current()?;
            if let Some(urls) = start_urls {
                log::info!("deep link URLs (likely a cold start): {:?}", urls);
            }

            let app_handle = app.handle().clone();
            app.deep_link().on_open_url(move |event| {
                let urls = event.urls();

                log::info!("deep link URLs: {:?}", urls);
                if let Some(url) = urls.first() {
                    let _ = app_handle
                        .notification()
                        .builder()
                        .title("Mexboard")
                        .body(format!("Authentication received: {}", url))
                        .show();
                }
            });

            Ok(())
        })
        .invoke_handler(command_builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
