use crate::websocket::WebSocketState;
use tauri::{command, State};

#[command]
#[specta::specta]
pub async fn disconnect_websocket(state: State<'_, WebSocketState>) -> Result<(), String> {
    let read_handle = state.read_handle.read().await;
    if let Some(handle) = read_handle.as_ref() {
        handle.abort();
    }
    let mut write_guard = state.write.lock().await;
    *write_guard = None;
    Ok(())
}
