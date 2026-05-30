pub mod commands;
pub use commands::*;
pub mod initialization;
mod items;
mod utils;
use crate::schema::Schema;
use drizzle::sqlite::rusqlite::Drizzle;
use rusqlite::Connection;
use std::sync::Mutex;
pub(crate) use utils::*;
pub mod structs;

pub struct Database {
    drizzle: Mutex<DrizzleState>,
}

pub(crate) struct DrizzleState {
    pub(crate) db: Drizzle,
    pub(crate) schema: Schema,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self, String> {
        let conn = Connection::open(db_path).map_err(error_to_string)?;

        conn.execute_batch("PRAGMA journal_mode=WAL;")
            .map_err(error_to_string)?;

        let schema = Schema::new();
        let (db, _) = Drizzle::new(conn, ());

        db.push(&schema).map_err(error_to_string)?;

        Ok(Self {
            drizzle: Mutex::new(DrizzleState { db, schema }),
        })
    }

    fn lock(&self) -> Result<std::sync::MutexGuard<'_, DrizzleState>, String> {
        self.drizzle.lock().map_err(error_to_string)
    }
}
