# Tau OS Core Services

This document describes the foundational core services of Tau OS: the init system, networking daemon, and session manager.

## C Implementation

### 1. Init System (`core/init.c`)
- **Role:** PID 1, mounts filesystems, spawns netd and sessiond, reaps zombies, logs events.
- **Key Functions:**
  - `mount_fs()` — Mounts /proc, /sys, /dev
  - `spawn()` — Forks and execs child processes
  - Main loop: calls `waitpid()` to reap zombies
- **Logging:** Logs to stdout (can be redirected to `/var/log/init.log`)

### 2. Networking Daemon (`core/netd.c`)
- **Role:** Detects eth0/wlan0, runs udhcpc for each, logs status.
- **Key Functions:**
  - `iface_exists()` — Checks if interface exists
  - `run_udhcpc()` — Forks and execs udhcpc
  - Main loop: reaps child processes

### 3. Session Manager (`core/sessiond.c`)
- **Role:** Prompts for login, verifies credentials, launches GUI.
- **Key Functions:**
  - `login_prompt()` — Prompts for username/password, checks against placeholder
  - Main: forks and execs `/gui/launcher.sh` on success

## Compilation Instructions

You can build the core services with:

```
cd core
musl-gcc -static -o init init.c
musl-gcc -static -o netd netd.c
musl-gcc -static -o sessiond sessiond.c
```

Or with regular gcc (for development):

```
gcc -o init init.c
gcc -o netd netd.c
gcc -o sessiond sessiond.c
```

- Place the resulting binaries in `/core/` in your rootfs.
- Make sure `/core/init` is set as the init process (PID 1) in your kernel command line or initramfs.

## Future Plans
- Replace placeholder login with `/etc/passwd` verification
- Add privilege separation and sandboxing
- Support for static IP and Wi-Fi config in netd
- Logging to `/var/log/` with log rotation
- Rewrite in Rust or Go for even more safety

---

**Note:** These C programs are minimal and intended for rapid prototyping. As Tau OS matures, they can be extended for more features and security. 