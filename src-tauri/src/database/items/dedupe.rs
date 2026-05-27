use drizzle::core::expr::*;

use crate::schema::*;

use super::super::schema::*;
use super::super::utils::*;
use super::super::Database;

impl Database {
    pub fn dedupe(&self, id: i16) -> DbResult<i16> {
        let inner = self.lock()?;
        let ci = &inner.schema.clipboard_items;

        let item: SelectClipboardItems = inner
            .db
            .select(())
            .from(*ci)
            .r#where(eq(ci.id, id as i64))
            .get()
            .map_err(error_to_string)?;

        let hash = &item.hash;
        if item.hash.is_empty() {
            return Ok(0);
        }

        let deleted = inner
            .db
            .conn()
            .execute(
                "DELETE FROM clipboard_items WHERE hash = ?1 AND id != ?2",
                rusqlite::params![hash, id],
            )
            .map_err(error_to_string)?;

        Ok(deleted as i16)
    }
}
