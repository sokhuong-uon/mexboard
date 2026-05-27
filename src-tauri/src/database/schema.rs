use serde::{Deserialize, Serialize};

use crate::schema::SelectClipboardItems;

pub type DbResult<T> = Result<T, String>;

#[derive(Debug, Serialize, Deserialize, Clone, specta::Type)]
pub struct ClipboardSchema {
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

impl From<SelectClipboardItems> for ClipboardSchema {
    fn from(clipboard: SelectClipboardItems) -> Self {
        Self {
            id: clipboard.id,
            sort_order: clipboard.sort_order,

            content: clipboard.content,
            hash: clipboard.hash,
            mime: clipboard.mime,

            image: clipboard.image,
            image_preview: clipboard.image_preview,
            width: clipboard.width,
            height: clipboard.height,

            source_app: clipboard.source_app,

            is_favorite: clipboard.is_favorite,
            note: clipboard.note,

            kv: clipboard.kv,

            detected_date: clipboard.detected_date,
            is_secret: clipboard.is_secret,
            is_color: clipboard.is_color,

            created_at: clipboard.created_at,
            updated_at: clipboard.updated_at,
        }
    }
}

#[derive(Debug, Deserialize, specta::Type)]
pub struct InsertClipboardItemParams {
    pub content: Option<String>,

    pub image: Option<u8>,
    pub image_preview: Option<u8>,
    pub width: Option<i32>,
    pub height: Option<i32>,

    pub source_app: Option<String>,

    pub kv: Option<String>,
    pub sort_order: String,

    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize, specta::Type)]
pub struct UpdateSortOrderParams {
    pub id: i16,
    pub sort_order: String,
}
