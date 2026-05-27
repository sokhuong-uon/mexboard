use crate::database::{Database, InsertClipboardItemParams};
use tauri::State;

#[tauri::command]
#[specta::specta]
pub fn insert_clipboard_item(params: InsertClipboardItemParams, database: State<'_, Database>) {
    database.insert(params)
}
