use crate::clipboard::mexboard::MexBoard;

pub fn is_clipboard_instance_exists(mexboard: &MexBoard) -> Result<(), String> {
    let mut clipboard_guard = mexboard
        .clipboard
        .lock()
        .map_err(|e| format!("Failed to acquire clipboard lock: {}", e))?;

    if clipboard_guard.is_none() {
        *clipboard_guard = Some(
            arboard::Clipboard::new()
                .map_err(|err| format!("Failed to create clipboard instance: {}", err))?,
        );
    }

    Ok(())
}
