mod blocklist;

use blocklist::Blocklist;
use std::sync::Mutex;
use tauri::{
    webview::WebviewBuilder, LogicalPosition, LogicalSize, Manager, Position, Size, State,
    WebviewUrl, WindowEvent,
};

const TOOLBAR_HEIGHT: f64 = 48.0;
const STATUS_HEIGHT: f64 = 24.0;
const HOMEPAGE: &str = "https://www.tauos.org";

struct BrowserLayout {
    top_inset: Mutex<f64>,
    bottom_inset: Mutex<f64>,
}

impl BrowserLayout {
    fn new() -> Self {
        Self {
            top_inset: Mutex::new(TOOLBAR_HEIGHT),
            bottom_inset: Mutex::new(STATUS_HEIGHT),
        }
    }
}

struct AppState {
    blocklist: Mutex<Blocklist>,
    blocked_count: Mutex<u64>,
}

fn layout_browser(app: &tauri::AppHandle) -> Result<(), String> {
    let layout = app.state::<BrowserLayout>();
    let top = *layout.top_inset.lock().unwrap();
    let bottom = *layout.bottom_inset.lock().unwrap();
    let main = app.get_window("main").ok_or("main window missing")?;
    let browser = app.get_webview("browser").ok_or("browser webview missing")?;
    let scale = main.scale_factor().map_err(|e| e.to_string())?;
    let size = main.inner_size().map_err(|e| e.to_string())?;
    let w = size.width as f64 / scale;
    let h = size.height as f64 / scale;
    browser
        .set_position(Position::Logical(LogicalPosition::new(0.0, top)))
        .map_err(|e| e.to_string())?;
    browser
        .set_size(Size::Logical(LogicalSize::new(
            w,
            (h - top - bottom).max(100.0),
        )))
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn set_chrome_insets(
    app: tauri::AppHandle,
    top: f64,
    bottom: f64,
    layout: State<BrowserLayout>,
) -> Result<(), String> {
    *layout.top_inset.lock().unwrap() = top.ceil().max(TOOLBAR_HEIGHT);
    *layout.bottom_inset.lock().unwrap() = bottom.ceil().max(STATUS_HEIGHT);
    layout_browser(&app)
}

#[cfg(target_os = "macos")]
fn raise_chrome_webview(app: &tauri::AppHandle) -> Result<(), String> {
    let chrome = app.get_webview("main").ok_or("main webview missing")?;
    chrome
        .with_webview(|webview| {
            unsafe {
                use objc2_app_kit::{NSView, NSWindowOrderingMode};
                let view: &NSView = &*(webview.inner() as *const NSView);
                if let Some(parent) = view.superview() {
                    parent.addSubview_positioned_relativeTo(view, NSWindowOrderingMode::Above, None);
                }
            }
        })
        .map_err(|e| e.to_string())
}

#[cfg(not(target_os = "macos"))]
fn raise_chrome_webview(_app: &tauri::AppHandle) -> Result<(), String> {
    Ok(())
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

#[tauri::command]
fn browser_navigate(app: tauri::AppHandle, url: String) -> Result<(), String> {
    let parsed: url::Url = url.parse().map_err(|e: url::ParseError| e.to_string())?;
    let browser = app.get_webview("browser").ok_or("browser webview missing")?;
    browser.navigate(parsed).map_err(|e| e.to_string())
}

#[tauri::command]
fn browser_back(app: tauri::AppHandle) -> Result<(), String> {
    let browser = app.get_webview("browser").ok_or("browser webview missing")?;
    browser.eval("history.back()").map_err(|e| e.to_string())
}

#[tauri::command]
fn browser_forward(app: tauri::AppHandle) -> Result<(), String> {
    let browser = app.get_webview("browser").ok_or("browser webview missing")?;
    browser.eval("history.forward()").map_err(|e| e.to_string())
}

#[tauri::command]
fn browser_reload(app: tauri::AppHandle) -> Result<(), String> {
    let browser = app.get_webview("browser").ok_or("browser webview missing")?;
    browser.eval("location.reload()").map_err(|e| e.to_string())
}

#[tauri::command]
fn browser_current_url(app: tauri::AppHandle) -> Result<String, String> {
    let browser = app.get_webview("browser").ok_or("browser webview missing")?;
    browser.url().map(|u| u.to_string()).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let blocklist = Blocklist::embedded();
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(BrowserLayout::new())
        .manage(AppState {
            blocklist: Mutex::new(blocklist),
            blocked_count: Mutex::new(0),
        })
        .setup(|app| {
            let handle = app.handle().clone();
            let window = app.get_window("main").ok_or("main window not found")?;

            let scale = window.scale_factor().map_err(|e| e.to_string())?;
            let size = window.inner_size().map_err(|e| e.to_string())?;
            let w = size.width as f64 / scale;
            let h = size.height as f64 / scale;
            let layout = app.state::<BrowserLayout>();
            let top = *layout.top_inset.lock().unwrap();
            let bottom = *layout.bottom_inset.lock().unwrap();
            let content_height = (h - top - bottom).max(100.0);

            window
                .add_child(
                    WebviewBuilder::new(
                        "browser",
                        WebviewUrl::External(HOMEPAGE.parse().expect("valid homepage url")),
                    )
                    .focused(false),
                    LogicalPosition::new(0.0, top),
                    LogicalSize::new(w, content_height),
                )
                .map_err(|e| e.to_string())?;

            layout_browser(&handle)?;
            raise_chrome_webview(&handle)?;

            let resize_handle = handle.clone();
            window.on_window_event(move |event| {
                if matches!(event, WindowEvent::Resized(_)) {
                    let _ = layout_browser(&resize_handle);
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_blocklist,
            check_url,
            blocked_count,
            set_chrome_insets,
            browser_navigate,
            browser_back,
            browser_forward,
            browser_reload,
            browser_current_url,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Tau Browser");
}
