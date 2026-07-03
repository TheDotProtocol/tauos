#!/usr/bin/env python3
"""Minimal static + API server for TauOS desktop UI (offline-capable)."""
from __future__ import annotations

import json
import os
import platform
import shutil
import socket
import subprocess
import time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

ROOT = Path(os.environ.get("TAUOS_DESKTOP_UI_ROOT", "/usr/share/tauos/desktop-ui"))
PORT = int(os.environ.get("TAUOS_DESKTOP_PORT", "8765"))

APPS = [
    {"id": "taumail", "name": "TauMail", "icon": "📧", "url": "https://www.tauos.org/taumail", "category": "productivity", "description": "Secure email"},
    {"id": "taucloud", "name": "TauCloud", "icon": "☁️", "url": "https://www.tauos.org/taucloud", "category": "storage", "description": "Cloud storage"},
    {"id": "tauid", "name": "TauID", "icon": "🆔", "url": "https://www.tauos.org/tauid", "category": "security", "description": "Identity"},
    {"id": "taustore", "name": "TauStore", "icon": "🛍️", "url": "https://www.tauos.org/taustore", "category": "marketplace", "description": "App store"},
    {"id": "taubrowser", "name": "TauBrowser", "icon": "🌐", "url": "https://www.tauos.org/taubrowser", "category": "browser", "description": "Privacy browser"},
    {"id": "settings", "name": "Settings", "icon": "⚙️", "url": "#settings", "category": "system", "description": "System preferences"},
    {"id": "terminal", "name": "Terminal", "icon": "💻", "url": "#terminal", "category": "system", "description": "Command line"},
]


def system_info() -> dict:
    mem = "unknown"
    try:
        with open("/proc/meminfo") as f:
            for line in f:
                if line.startswith("MemTotal:"):
                    kb = int(line.split()[1])
                    mem = f"{kb // 1024} MB"
                    break
    except OSError:
        pass
    return {
        "hostname": socket.gethostname(),
        "os": "TauOS",
        "version": os.environ.get("TAUOS_VERSION", "1.0.0"),
        "kernel": platform.release(),
        "arch": platform.machine(),
        "memory": mem,
        "uptime_seconds": int(time.time() - _boot_time()),
    }


def _boot_time() -> float:
    try:
        with open("/proc/stat") as f:
            for line in f:
                if line.startswith("btime"):
                    return float(line.split()[1])
    except OSError:
        pass
    return time.time()


class TauOSDesktopHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        if os.environ.get("TAUOS_DESKTOP_QUIET") == "1":
            return
        super().log_message(fmt, *args)

    def do_GET(self):
        if self.path.rstrip("/") == "/api/apps":
            body = json.dumps(APPS).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if self.path.rstrip("/") == "/api/system-info":
            body = json.dumps(system_info()).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if self.path == "/":
            self.path = "/index.html"
        return super().do_GET()


def main() -> None:
    if not ROOT.is_dir():
        raise SystemExit(f"Desktop UI not found at {ROOT}")
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), TauOSDesktopHandler)
    print(f"TauOS desktop UI serving http://127.0.0.1:{PORT}/", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
