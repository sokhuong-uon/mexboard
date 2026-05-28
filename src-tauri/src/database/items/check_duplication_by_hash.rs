use super::super::utils::*;
use super::super::Database;
use crate::schema::*;
use drizzle::core::expr::*;

impl Database {
    pub fn check_duplication_by_hash(&self, hash: &str) -> Result<u32, String> {
        let drizzle = self.lock()?;
        let clipboards = &drizzle.schema.clipboards;

        let clipboard: SelectClipboards = drizzle
            .db
            .select(())
            .from(*clipboards)
            .r#where(eq(clipboards.hash, hash))
            .get()
            .map_err(error_to_string)?;

        Ok(clipboard.id)
    }
}
