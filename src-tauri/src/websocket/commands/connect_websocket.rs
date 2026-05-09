use crate::websocket::WebSocketState;
use futures_util::StreamExt;
use std::sync::Arc;
use tauri::{command, AppHandle, Emitter, State};
use tokio_tungstenite::connect_async;
use url::Url;

#[command]
#[specta::specta]
pub async fn connect_websocket(
    state: State<'_, WebSocketState>,
    app: AppHandle,
    url_string: String,
) -> Result<(), String> {
    let read_handle = state.read_handle.read().await;
    if let Some(handle) = read_handle.as_ref() {
        handle.abort();
    }
    drop(read_handle);

    let url = Url::parse(&url_string).map_err(|error| error.to_string())?;
    let (ws_stream, _) = connect_async(url.as_str())
        .await
        .map_err(|e| format!("Connect failed: {}", e))?;

    let (write, mut read) = ws_stream.split();

    let app_clone = app.clone();
    let write_arc = Arc::clone(&state.write);

    let read_handle = tokio::spawn(async move {
        while let Some(msg_res) = read.next().await {
            match msg_res {
                Ok(msg) => {
                    let _ = app_clone.emit("ws-message", msg.to_string());
                }
                Err(e) => {
                    let _ = app_clone.emit("ws-error", e.to_string());
                    let mut write_guard = write_arc.lock().await; // Use cloned Arc
                    *write_guard = None;
                    break;
                }
            }
        }
    });

    let mut write_guard = state.write.lock().await;
    *write_guard = Some(write);
    drop(write_guard);

    let mut read_guard = state.read_handle.write().await;
    *read_guard = Some(read_handle);

    Ok(())
}
