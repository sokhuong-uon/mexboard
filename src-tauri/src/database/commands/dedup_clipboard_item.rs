use crate::database::Database;
use tauri::State;

#[tauri::command]
#[specta::specta]
pub fn dedup_clipboard_item(id: i16, database: State<'_, Database>) -> Result<i16, String> {
    database.dedupe(id)
}
