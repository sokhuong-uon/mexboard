use super::super::utils::*;
use super::super::Database;
use rusqlite::OptionalExtension;

impl Database {
    pub fn check_duplication_by_hash(&self, hash: blake3::Hash) -> Result<u32, String> {
        let drizzle = self.lock()?;
        let conn = drizzle.db.conn();

        let id: Option<u32> = conn
            .query_row(
                "SELECT id FROM clipboards WHERE hash = ? LIMIT 1",
                [hash.as_bytes()],
                |row| row.get(0),
            )
            .optional()
            .map_err(error_to_string)?;

        match id {
            Some(id) => Ok(id),
            None => Err("No duplicate found".to_string()),
        }
    }
}
