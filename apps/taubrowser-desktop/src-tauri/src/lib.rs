mod blocklist;

use blocklist::Blocklist;
use std::sync::Mutex;
use tauri::State;

struct AppState {
    blocklist: Mutex<Blocklist>,
    blocked_count: Mutex<u64>,
}

#[tauri::command]
fn get_blocklist(state: State<AppState>) -> blocklist::BlocklistResponse {
    state.blocklist.lock().unwrap().to_response()
}

#[tauri::command]
fn check_url(url: String, state: State<AppState>) -> bool {
    let blocked = state.blocklist.lock().unwrap().is_blocked(&url);
    if blocked {
        *state.blocked_count.lock().unwrap() += 1;
    }
    blocked
}

#[tauri::command]
fn blocked_count(state: State<AppState>) -> u64 {
    *state.blocked_count.lock().unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let blocklist = Blocklist::embedded();
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(AppState {
            blocklist: Mutex::new(blocklist),
            blocked_count: Mutex::new(0),
        })
        .invoke_handler(tauri::generate_handler![get_blocklist, check_url, blocked_count])
        .run(tauri::generate_context!())
        .expect("error while running Tau Browser");
}
