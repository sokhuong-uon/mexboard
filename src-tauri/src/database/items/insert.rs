use super::super::structs::insert_clipboard_db_params::InsertClipboardDbParams;
use super::super::Database;

impl Database {
    pub fn insert(&self, params: InsertClipboardDbParams) -> Result<(), String> {
        let drizzle = self.lock()?;
        let clipboards = &drizzle.schema.clipboards;

        drizzle.db.insert(*clipboards);
        Ok(())
    }
}
