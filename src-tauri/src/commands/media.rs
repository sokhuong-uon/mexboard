/// Downloads a media URL to a temporary file and returns the file path
/// along with a small PNG icon for the drag preview.
#[tauri::command]
#[specta::specta]
pub async fn download_media_to_temp(url: String) -> Result<(String, String), String> {
    let extension = url::Url::parse(&url)
        .ok()
        .and_then(|u| u.path().rsplit('.').next().map(|ext| ext.to_lowercase()))
        .unwrap_or_else(|| "gif".to_string());

    let temp_dir = std::env::temp_dir().join("mexboard-drag");
    std::fs::create_dir_all(&temp_dir).map_err(|e| e.to_string())?;

    use sha2::{Digest, Sha256};
    let hash = format!("{:x}", Sha256::digest(url.as_bytes()));
    let file_path = temp_dir.join(format!("{}.{}", &hash[..16], extension));
    let icon_path = temp_dir.join(format!("{}_icon.png", &hash[..16]));

    if !file_path.exists() {
        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(15))
            .build()
            .map_err(|e| e.to_string())?;

        let response = client.get(&url).send().await.map_err(|e| e.to_string())?;
        let bytes = response.bytes().await.map_err(|e| e.to_string())?;

        std::fs::write(&file_path, &bytes).map_err(|e| e.to_string())?;
    }

    if !icon_path.exists() {
        let icon_created: Result<(), String> = (|| {
            let file = std::fs::File::open(&file_path).map_err(|e| e.to_string())?;
            let reader = std::io::BufReader::new(file);
            let decoder = image::codecs::gif::GifDecoder::new(reader).map_err(|e| e.to_string())?;
            use image::AnimationDecoder;
            let first_frame = decoder
                .into_frames()
                .next()
                .ok_or("No frames in GIF")?
                .map_err(|e| e.to_string())?;
            let img = image::DynamicImage::from(first_frame.into_buffer());
            let thumb = img.thumbnail(64, 64);
            thumb.save(&icon_path).map_err(|e| e.to_string())?;
            Ok(())
        })();

        if icon_created.is_err() {
            let fallback = image::RgbaImage::new(1, 1);
            fallback.save(&icon_path).map_err(|e| e.to_string())?;
        }
    }

    let file_str = file_path
        .to_str()
        .map(|s| s.to_string())
        .ok_or_else(|| "Invalid file path".to_string())?;
    let icon_str = icon_path
        .to_str()
        .map(|s| s.to_string())
        .ok_or_else(|| "Invalid icon path".to_string())?;

    Ok((file_str, icon_str))
}
