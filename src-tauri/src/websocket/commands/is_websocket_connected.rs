use crate::websocket::WebSocketState;
use tauri::{command, State};

#[command]
#[specta::specta]
pub fn is_websocket_connected(state: State<'_, WebSocketState>) -> bool {
    state.write.blocking_lock().is_some()
}
