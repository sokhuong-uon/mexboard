use crate::database::{ClipboardSchema, Database};
use tauri::State;

#[tauri::command]
#[specta::specta]
pub fn bump_clipboard_item(
    id: i16,
    sort_order: String,
    database: State<'_, Database>,
) -> Result<ClipboardSchema, String> {
    database.bump(id, &sort_order)
}
