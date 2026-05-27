use crate::schema::*;

use super::super::schema::*;
use super::super::utils::*;
use super::super::Database;

impl Database {
    pub fn get_all(
        &self,
        limit: i16,
        offset: i16,
        favorites_first: bool,
    ) -> DbResult<Vec<ClipboardSchema>> {
        let inner = self.lock()?;

        let query = if favorites_first {
            "SELECT * FROM clipboard_items ORDER BY is_favorite DESC, sort_order ASC LIMIT ?1 OFFSET ?2"
        } else {
            "SELECT * FROM clipboard_items ORDER BY sort_order ASC LIMIT ?1 OFFSET ?2"
        };

        let rows: Vec<SelectClipboardItems> = inner
            .db
            .conn()
            .prepare(query)
            .and_then(|mut stmt| {
                stmt.query_map(rusqlite::params![limit, offset], |row| {
                    Ok(SelectClipboardItems {
                        id: row.get("id")?,
                        sort_order: row.get("sort_order")?,

                        content: row.get("content")?,
                        hash: row.get("hash")?,
                        mime: row.get("mime")?,

                        image: row.get("image")?,
                        image_preview: row.get("image_preview")?,
                        width: row.get("width")?,
                        height: row.get("height")?,

                        source_app: row.get("source_app")?,

                        is_favorite: row.get("is_favorite")?,
                        note: row.get("note")?,

                        kv: row.get("kv")?,
                        is_secret: row.get("is_secret")?,

                        detected_date: row.get("detected_date")?,
                        is_color: row.get("is_color")?,

                        created_at: row.get("created_at")?,
                        updated_at: row.get("updated_at")?,
                    })
                })
                .and_then(|rows| rows.collect::<Result<Vec<_>, _>>())
            })
            .map_err(error_to_string)?;

        Ok(rows.into_iter().map(ClipboardSchema::from).collect())
    }
}
