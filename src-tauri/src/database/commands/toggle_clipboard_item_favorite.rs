use crate::database::{ClipboardSchema, Database};
use tauri::State;

#[tauri::command]
#[specta::specta]
pub fn toggle_clipboard_item_favorite(
    id: i16,
    database: State<'_, Database>,
) -> Result<ClipboardSchema, String> {
    database.toggle_favorite(id)
}
