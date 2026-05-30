use super::super::Database;
use super::super::DrizzleState;
use drizzle::sqlite::prelude::*;

impl Database {
    pub(crate) fn get_max_sort_order_internal(
        &self,
        drizzle: &DrizzleState,
    ) -> Result<Option<String>, String> {
        let clipboards = &drizzle.schema.clipboards;

        let result: Result<(String,), _> = drizzle
            .db
            .select((clipboards.sort_order,))
            .from(*clipboards)
            .order_by(desc(clipboards.sort_order))
            .get();

        match result {
            Ok((val,)) => Ok(Some(val)),
            Err(_) => Ok(None),
        }
    }
}
