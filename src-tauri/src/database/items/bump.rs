use drizzle::core::expr::*;

use crate::schema::*;

use super::super::schema::*;
use super::super::utils::*;
use super::super::Database;

impl Database {
    pub fn bump(&self, id: i16, sort_order: &str) -> DbResult<ClipboardSchema> {
        let inner = self.lock()?;
        let ci = &inner.schema.clipboard_items;
        let now = timestamp_now();

        inner
            .db
            .update(*ci)
            .set(
                UpdateClipboardItems::default()
                    .with_sort_order(sort_order)
                    .with_updated_at(&now),
            )
            .r#where(eq(ci.id, id as i64))
            .execute()
            .map_err(error_to_string)?;

        inner
            .db
            .conn()
            .execute(
                "UPDATE clipboard_items SET copy_count = copy_count + 1 WHERE id = ?1",
                rusqlite::params![id],
            )
            .map_err(error_to_string)?;

        let row: SelectClipboardItems = inner
            .db
            .select(())
            .from(*ci)
            .r#where(eq(ci.id, id as i64))
            .get()
            .map_err(error_to_string)?;

        Ok(ClipboardSchema::from(row))
    }
}
