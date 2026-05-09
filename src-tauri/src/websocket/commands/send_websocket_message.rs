use crate::websocket::WebSocketState;
use futures_util::SinkExt;
use tauri::{command, State};
use tokio_tungstenite::tungstenite::Message;

#[command]
#[specta::specta]
pub async fn send_websocket_message(
    state: State<'_, WebSocketState>,
    message: String,
) -> Result<(), String> {
    let mut write_guard = state.write.lock().await;
    let write = write_guard.as_mut().ok_or("Not connected")?;
    write
        .send(Message::text(message))
        .await
        .map_err(|error| error.to_string())
}
