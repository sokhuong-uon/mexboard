use enigo::{Direction, Enigo, Key, Keyboard, Settings};

pub fn simulate_ctrl_v() -> Result<(), String> {
    let mut enigo = Enigo::new(&Settings::default()).map_err(|err| err.to_string())?;
    enigo
        .key(Key::Control, Direction::Press)
        .map_err(|err| err.to_string())?;
    enigo
        .key(Key::Unicode('v'), Direction::Click)
        .map_err(|err| err.to_string())?;
    enigo
        .key(Key::Control, Direction::Release)
        .map_err(|err| err.to_string())?;
    Ok(())
}
