use crate::database::{ClipboardSchema, Database};
use tauri::State;

#[tauri::command]
#[specta::specta]
pub fn get_all_clipboard_items(
    limit: i16,
    offset: i16,
    favorites_first: bool,
    database: State<'_, Database>,
) -> Result<Vec<ClipboardSchema>, String> {
    database.get_all(limit, offset, favorites_first)
}
