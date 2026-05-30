use crate::schema::InsertClipboards;

use super::super::utils::*;
use super::super::Database;
use chrono::Utc;
use jittered_fractional_indexing::{generate_key_between, Options};

use super::super::structs::insert_clipboard_db_params::InsertClipboardDbParams;

impl Database {
    pub fn insert_text(&self, params: InsertClipboardDbParams) -> Result<(), String> {
        let drizzle = self.lock()?;
        let clipboards = &drizzle.schema.clipboards;

        let max_sort_order = self.get_max_sort_order_internal(&drizzle)?;
        let options = Options {
            jitter_bits: 16,
            ..Options::default()
        };
        let sort_order = generate_key_between(max_sort_order.as_deref(), None, options)
            .map_err(error_to_string)?;

        let now = Utc::now().to_rfc3339();
        let base_required_values = InsertClipboards::new(
            sort_order,
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
                    .values([base_required_values.with_content(content)])
                    .execute()
                    .map_err(error_to_string)?;
            }
            None => {
                drizzle
                    .db
                    .insert(*clipboards)
                    .values([base_required_values])
                    .execute()
                    .map_err(error_to_string)?;
            }
        }

        Ok(())
    }
}
