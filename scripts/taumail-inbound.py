#!/usr/bin/env python3
"""Postfix pipe: deliver inbound mail to Tau Mail API on Vercel."""
import base64
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


def decode_part_bytes(part: email.message.Message) -> bytes:
    payload = part.get_payload(decode=True)
    if isinstance(payload, bytes):
        return payload
    if isinstance(payload, str):
        return payload.encode(part.get_content_charset() or "utf-8", errors="replace")
    return b""


def decode_part_text(part: email.message.Message) -> str:
    data = decode_part_bytes(part)
    if not data:
        return ""
    return data.decode(part.get_content_charset() or "utf-8", errors="replace")


def normalize_cid(raw: str) -> str:
    return (raw or "").strip().strip("<>")


def extract_message_parts(msg: email.message.Message) -> tuple[str, str, list, list]:
    text = ""
    html = ""
    inline_attachments = []
    file_attachments = []

    for part in msg.walk():
        if part.get_content_maintype() == "multipart":
            continue

        ctype = part.get_content_type()
        disposition = part.get_content_disposition()
        filename = part.get_filename()
        cid = normalize_cid(part.get("Content-ID") or "")

        is_inline = bool(cid) or disposition == "inline"
        is_file_attachment = disposition == "attachment" or (
            filename and not is_inline and ctype.startswith("application/")
        )

        if is_file_attachment or (filename and disposition == "attachment"):
            data = decode_part_bytes(part)
            if not data:
                continue
            file_attachments.append(
                {
                    "filename": filename or "attachment",
                    "contentType": ctype,
                    "content": base64.b64encode(data).decode("ascii"),
                    "size": len(data),
                }
            )
            continue

        if is_inline and ctype.startswith("image/"):
            data = decode_part_bytes(part)
            if not data:
                continue
            inline_attachments.append(
                {
                    "cid": cid or filename or f"inline-{len(inline_attachments) + 1}",
                    "contentType": ctype,
                    "content": base64.b64encode(data).decode("ascii"),
                    "filename": filename or cid or "inline-image",
                }
            )
            continue

        if ctype == "text/plain" and not text:
            text = decode_part_text(part)
        elif ctype == "text/html" and not html:
            html = decode_part_text(part)

    return text, html, inline_attachments, file_attachments


def main() -> int:
    recipient = sys.argv[1] if len(sys.argv) > 1 else ""
    sender = sys.argv[2] if len(sys.argv) > 2 else ""
    raw = sys.stdin.buffer.read()
    msg = email.message_from_bytes(raw, policy=policy.default)

    to_addr = recipient or (msg.get("To") or "")
    from_addr = sender or (msg.get("From") or "")
    subject = msg.get("Subject") or "(no subject)"
    text, html, inline_attachments, file_attachments = extract_message_parts(msg)

    payload = {
        "to": to_addr,
        "from": from_addr,
        "subject": subject,
        "text": text,
        "html": html or text,
        "inlineAttachments": inline_attachments,
        "attachments": file_attachments,
    }

    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
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
