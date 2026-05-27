use drizzle::core::expr::*;

use crate::schema::*;

use super::super::schema::*;
use super::super::utils::*;
use super::super::Database;

impl Database {
    pub fn toggle_favorite(&self, id: i16) -> DbResult<ClipboardSchema> {
        let inner = self.lock()?;
        let ci = &inner.schema.clipboard_items;

        let current: SelectClipboardItems = inner
            .db
            .select(())
            .from(*ci)
            .r#where(eq(ci.id, id as i64))
            .get()
            .map_err(error_to_string)?;

        let new_fav = if current.is_favorite { 0i64 } else { 1i64 };

        inner
            .db
            .update(*ci)
            .set(UpdateClipboardItems::default().with_is_favorite(new_fav))
            .r#where(eq(ci.id, id as i64))
            .execute()
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
