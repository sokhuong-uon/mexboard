use crate::database::Database;
use tauri::State;

#[tauri::command]
#[specta::specta]
pub fn clear_clipboard(database: State<'_, Database>) -> Result<(), String> {
    database.clear()
}
