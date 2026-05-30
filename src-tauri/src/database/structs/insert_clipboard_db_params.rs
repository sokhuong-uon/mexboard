#[derive(Debug)]
pub struct InsertClipboardDbParams {
    pub content: Option<String>,

    pub hash: Vec<u8>,

    pub image: Option<Vec<u8>>,
    pub width: Option<u32>,
    pub height: Option<u32>,
}
