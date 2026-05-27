use super::super::schema::*;
use super::super::utils::*;
use super::super::Database;

impl Database {
    pub fn clear(&self) -> DbResult<()> {
        let inner = self.lock()?;
        let ci = &inner.schema.clipboard_items;

        inner.db.delete(*ci).execute().map_err(error_to_string)?;

        Ok(())
    }
}
