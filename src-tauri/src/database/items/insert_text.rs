use crate::schema::InsertClipboards;

use super::super::utils::*;
use super::super::Database;
use chrono::Utc;

use super::super::structs::insert_clipboard_db_params::InsertClipboardDbParams;

impl Database {
    pub fn insert_text(&self, params: InsertClipboardDbParams) -> Result<(), String> {
        let drizzle = self.lock()?;
        let clipboards = &drizzle.schema.clipboards;

        let now = Utc::now().to_rfc3339();
        let base_values = InsertClipboards::new(
            "wow".to_string(),
            params.hash,
            false,
            false,
            false,
            now.clone(),
            now,
        );

        match params.content {
            Some(content) => {
                drizzle
                    .db
                    .insert(*clipboards)
                    .values([base_values.with_content(content)])
                    .execute()
                    .map_err(error_to_string)?;
            }
            None => {
                drizzle
                    .db
                    .insert(*clipboards)
                    .values([base_values])
                    .execute()
                    .map_err(error_to_string)?;
            }
        }

        Ok(())
    }
}
