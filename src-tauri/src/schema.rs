use drizzle::sqlite::prelude::*;

#[SQLiteTable]
#[derive(Debug, Serialize, Deserialize, Clone, specta::Type)]
pub struct ClipboardItems {
    #[column(primary, autoincrement)]
    pub id: u32,

    pub sort_order: String,

    pub content: Option<String>,

    pub image: Option<u8>,
    pub image_preview: Option<u8>,
    pub width: Option<u32>,
    pub height: Option<u32>,

    pub hash: String,
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

#[SQLiteTable]
pub struct Settings {
    #[column(primary)]
    pub key: String,
    pub value: String,
}

#[derive(SQLiteSchema)]
pub struct Schema {
    pub clipboard_items: ClipboardItems,
    pub settings: Settings,
}
