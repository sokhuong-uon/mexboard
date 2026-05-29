mod clipboard;
mod keyring;
mod media;
mod shortcuts;
mod system;
mod window;

pub use clipboard::*;
pub use keyring::init as init_keyring;
pub use keyring::*;
pub use media::*;
pub use shortcuts::*;
pub use system::*;

use crate::database::*;
use crate::websocket::*;
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
