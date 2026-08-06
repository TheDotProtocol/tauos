export type MessagePayload =
  | { v: 1; kind: 'text'; text: string }
  | {
      v: 1;
      kind: 'image';
      path: string;
      url?: string;
      caption?: string;
      mime?: string;
      name?: string;
    }
  | {
      v: 1;
      kind: 'file';
      path: string;
      url?: string;
      name: string;
      mime: string;
      size?: number;
    }
  | { v: 1; kind: 'location'; lat: number; lng: number; label?: string };

export function textPayload(text: string): MessagePayload {
  return { v: 1, kind: 'text', text };
}

export function parsePayload(plaintext: string): MessagePayload {
  const trimmed = plaintext.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as MessagePayload;
      if (parsed?.v === 1 && parsed.kind) return parsed;
    } catch {
      /* legacy plain text */
    }
  }
  return { v: 1, kind: 'text', text: plaintext };
}

export function payloadPreview(payload: MessagePayload): string {
  switch (payload.kind) {
    case 'text':
      return payload.text;
    case 'image':
      return payload.caption?.trim() || '📷 Photo';
    case 'file':
      return payload.mime.startsWith('audio/') ? '🎤 Voice message' : `📎 ${payload.name}`;
    case 'location':
      return payload.label?.trim() || '📍 Location';
    default:
      return 'Message';
  }
}

export function contentTypeForPayload(payload: MessagePayload): string {
  return payload.kind;
}
