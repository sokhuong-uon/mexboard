use drizzle::sqlite::prelude::*;

use crate::crypto::hash_content::hash_content;
use crate::detection::{color, date, env, file, secret};
use crate::schema::*;

use super::super::schema::*;
use super::super::utils::*;
use super::super::Database;

impl Database {
    pub fn insert_text(&self, params: InsertClipboardItemParams) {}
}
