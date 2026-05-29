use tauri::Manager;

pub fn setup(app: &tauri::App) {
    if let Some(window) = app.get_webview_window("main") {
        let window_clone = window.clone();

        window.on_window_event(move |event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                api.prevent_close();
                let _ = window_clone.hide();
            }
            tauri::WindowEvent::Focused(focused) => {
                if !*focused {
                    let _ = window_clone.hide();
                }
            }
            _ => {}
        });
    }
}
