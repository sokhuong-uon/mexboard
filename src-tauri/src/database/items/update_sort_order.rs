use drizzle::core::expr::*;

use crate::schema::*;

use super::super::schema::*;
use super::super::utils::*;
use super::super::Database;

impl Database {
    pub fn update_sort_order(&self, id: i16, sort_order: &str) -> DbResult<()> {
        let inner = self.lock()?;
        let ci = &inner.schema.clipboard_items;

        inner
            .db
            .update(*ci)
            .set(UpdateClipboardItems::default().with_sort_order(sort_order))
            .r#where(eq(ci.id, id as i64))
            .execute()
            .map_err(error_to_string)?;

        Ok(())
    }
}
