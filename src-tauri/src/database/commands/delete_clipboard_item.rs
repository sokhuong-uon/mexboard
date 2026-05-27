use crate::database::Database;
use tauri::State;

#[tauri::command]
#[specta::specta]
pub fn delete_clipboard_item(id: i16, database: State<'_, Database>) -> Result<(), String> {
    database.delete(id)
}
