mod clipboard;
mod keyring;
mod media;
mod shortcuts;
mod system;
mod window;

pub use clipboard::*;
pub use keyring::*;
pub use media::*;
pub use shortcuts::*;
pub use system::*;
pub use window::*;

pub use keyring::init as init_keyring;

use crate::database::*;
use crate::main_window;
use crate::websocket::*;

use tauri::{AppHandle, Manager};
use tauri_specta::{collect_commands, Builder};

pub fn create_command_builder() -> Builder<tauri::Wry> {
    Builder::new().commands(collect_commands![
        paste_item,
        read_clipboard,
        read_clipboard_image,
        write_clipboard,
        write_clipboard_image,
        reinitialize_clipboard,
        parse_env_content,
        set_monitoring,
        is_wayland_session,
        is_cosmic_data_control_enabled,
        download_media_to_temp,
        set_toggle_shortcut,
        get_session_token,
        save_session_token,
        delete_session_token,
        is_websocket_connected,
        connect_websocket,
        disconnect_websocket,
        send_websocket_message,
        // Start: Database
        insert_clipboard,
        get_all_clipboard_items,
        bump_clipboard_item,
        clear_clipboard,
        delete_clipboard_item,
        toggle_clipboard_item_favorite,
        // End: Database
    ])
}

pub fn handle_command(app: &AppHandle, command: &str) {
    match command {
        "show" => {
            show_window_at_cursor(app.clone());
        }
        "hide" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.hide();
                main_window::set_visible(false);
            }
        }
        "toggle" => {
            if main_window::is_visible() {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.hide();
                    main_window::set_visible(false);
                }
            } else {
                show_window_at_cursor(app.clone());
            }
        }
        _ => {}
    }
}

pub fn parse_command_from_args(args: &[String]) -> &str {
    args.get(1).map(|s| s.as_str()).unwrap_or("")
}
