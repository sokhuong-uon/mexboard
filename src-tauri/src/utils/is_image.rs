pub fn is_image_based_on_mime(mime: &str) -> bool {
    mime.starts_with("image/")
}
