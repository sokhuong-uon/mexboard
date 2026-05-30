use drizzle::sqlite::prelude::*;

#[SQLiteTable(name = "clipboards")]
pub struct Clipboards {
    #[column(primary, autoincrement)]
    pub id: u32,

    #[column(unique)]
    pub sort_order: String,

    pub content: Option<String>,

    pub image: Option<Vec<u8>>,
    pub image_preview: Option<Vec<u8>>,
    pub width: Option<u32>,
    pub height: Option<u32>,

    #[column(unique)]
    pub hash: Vec<u8>,
    pub mime: Option<String>,

    pub source_app: Option<String>,

    pub is_favorite: bool,
    pub note: Option<String>,

    pub detected_date: Option<String>,

    pub is_color: bool,

    pub kv: Option<String>,

    pub is_secret: bool,

    pub created_at: String,
    pub updated_at: String,
}

#[derive(SQLiteSchema)]
pub struct Schema {
    pub clipboards: Clipboards,
}
