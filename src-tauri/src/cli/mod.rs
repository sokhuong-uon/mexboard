use tauri_plugin_cli::CliExt;

pub fn handle_cli_args<R: tauri::Runtime>(
    manager: &impl tauri::Manager<R>,
    args: Option<Vec<String>>,
) {
    let arguments = match args {
        Some(args) => manager.cli().matches_from(args),
        None => manager.cli().matches(),
    };

    let matches = match arguments {
        Ok(matches) => matches,
        Err(err) => {
            log::error!("Failed to parse CLI matches: {:?}", err);
            return;
        }
    };

    match matches.subcommand {
        Some(subcommand) if subcommand.name == "show" => {
            if let Some(window) = manager.get_webview_window("main") {
                window.show().ok();
            }
        }
        _ => {}
    }
}
