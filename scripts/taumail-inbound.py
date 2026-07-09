#!/usr/bin/env python3
"""Postfix pipe: deliver inbound mail to Tau Mail API on Vercel."""
import email
import json
import os
import sys
import urllib.error
import urllib.request
from email import policy

API_URL = os.environ.get(
    "TAUMAIL_INBOUND_URL",
    "https://www.tauos.org/api/taumail/smtp/incoming",
)


def extract_body(msg: email.message.Message) -> tuple[str, str]:
    text = ""
    html = ""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            if part.get_content_disposition() == "attachment":
                continue
            try:
                payload = part.get_content()
            except Exception:
                payload = part.get_payload(decode=True)
                if isinstance(payload, bytes):
                    payload = payload.decode(part.get_content_charset() or "utf-8", errors="replace")
            if ctype == "text/plain" and not text:
                text = payload or ""
            elif ctype == "text/html" and not html:
                html = payload or ""
    else:
        try:
            payload = msg.get_content()
        except Exception:
            payload = msg.get_payload(decode=True)
            if isinstance(payload, bytes):
                payload = payload.decode(msg.get_content_charset() or "utf-8", errors="replace")
        if msg.get_content_type() == "text/html":
            html = payload or ""
        else:
            text = payload or ""
    return text, html


def main() -> int:
    recipient = sys.argv[1] if len(sys.argv) > 1 else ""
    sender = sys.argv[2] if len(sys.argv) > 2 else ""
    raw = sys.stdin.buffer.read()
    msg = email.message_from_bytes(raw, policy=policy.default)

    to_addr = recipient or (msg.get("To") or "")
    from_addr = sender or (msg.get("From") or "")
    subject = msg.get("Subject") or "(no subject)"
    text, html = extract_body(msg)

    payload = {
        "to": to_addr,
        "from": from_addr,
        "subject": subject,
        "text": text,
        "html": html or text,
    }

    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            if resp.status >= 400:
                print(f"API error {resp.status}", file=sys.stderr)
                return 75
    except urllib.error.HTTPError as e:
        print(f"API HTTP {e.code}: {e.read().decode()}", file=sys.stderr)
        return 75
    except Exception as e:
        print(f"API failed: {e}", file=sys.stderr)
        return 75

    return 0


if __name__ == "__main__":
    sys.exit(main())
