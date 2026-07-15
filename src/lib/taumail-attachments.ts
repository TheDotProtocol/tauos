/** Tau Mail attachment limits and validation (shared client + server) */

export const TAUMAIL_MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024; // 15 MB total per message
export const TAUMAIL_MAX_FILES = 10;

export type MailAttachmentPayload = {
  filename: string;
  contentType: string;
  /** Base64-encoded file content (no data: URL prefix) */
  content: string;
  size: number;
};

export type MailAttachmentRef = {
  attachmentId: string;
  path: string;
  filename: string;
  contentType: string;
  size: number;
};

export type AttachmentValidationResult =
  | { ok: true; attachments: MailAttachmentPayload[]; totalBytes: number; storagePaths: string[] }
  | { ok: false; error: string };

export function formatAttachmentSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop()?.trim() || 'attachment';
  return base.replace(/[^\w.\- ()[\]]+/g, '_').slice(0, 200) || 'attachment';
}

export function validateAttachmentPayloads(
  raw: unknown,
  maxBytes: number = TAUMAIL_MAX_ATTACHMENT_BYTES
): AttachmentValidationResult {
  if (raw == null) return { ok: true, attachments: [], totalBytes: 0, storagePaths: [] };
  if (!Array.isArray(raw)) return { ok: false, error: 'Attachments must be an array' };
  if (raw.length > TAUMAIL_MAX_FILES) {
    return { ok: false, error: `Maximum ${TAUMAIL_MAX_FILES} attachments per email` };
  }

  const attachments: MailAttachmentPayload[] = [];
  let totalBytes = 0;

  for (const item of raw) {
    if (!item || typeof item !== 'object') {
      return { ok: false, error: 'Invalid attachment entry' };
    }

    const { filename, contentType, content, size } = item as MailAttachmentPayload;

    if (!filename || typeof filename !== 'string') {
      return { ok: false, error: 'Each attachment requires a filename' };
    }
    if (!content || typeof content !== 'string') {
      return { ok: false, error: `Missing content for ${filename}` };
    }
    if (!/^[A-Za-z0-9+/=\s]+$/.test(content.replace(/\s/g, ''))) {
      return { ok: false, error: `Invalid encoding for ${filename}` };
    }

    const declaredSize = typeof size === 'number' && size > 0 ? size : 0;
    const decodedLen = Math.floor((content.replace(/\s/g, '').length * 3) / 4);
    const fileSize = declaredSize || decodedLen;

    if (fileSize > maxBytes) {
      return {
        ok: false,
        error: `"${filename}" exceeds the ${formatAttachmentSize(maxBytes)} limit`,
      };
    }

    totalBytes += fileSize;
    if (totalBytes > maxBytes) {
      return {
        ok: false,
        error: `Total attachment size cannot exceed ${formatAttachmentSize(maxBytes)}`,
      };
    }

    attachments.push({
      filename: sanitizeFilename(filename),
      contentType: typeof contentType === 'string' && contentType ? contentType : 'application/octet-stream',
      content: content.replace(/\s/g, ''),
      size: fileSize,
    });
  }

  return { ok: true, attachments, totalBytes, storagePaths: [] };
}

export function validateAttachmentRefs(
  raw: unknown,
  maxBytes: number = TAUMAIL_MAX_ATTACHMENT_BYTES
): { ok: true; refs: MailAttachmentRef[]; totalBytes: number } | { ok: false; error: string } {
  if (raw == null) return { ok: true, refs: [], totalBytes: 0 };
  if (!Array.isArray(raw)) return { ok: false, error: 'Attachments must be an array' };
  if (raw.length > TAUMAIL_MAX_FILES) {
    return { ok: false, error: `Maximum ${TAUMAIL_MAX_FILES} attachments per email` };
  }

  const refs: MailAttachmentRef[] = [];
  let totalBytes = 0;

  for (const item of raw) {
    if (!item || typeof item !== 'object') {
      return { ok: false, error: 'Invalid attachment entry' };
    }
    const ref = item as MailAttachmentRef;
    if (!ref.path || !ref.filename || typeof ref.size !== 'number') {
      return { ok: false, error: 'Each attachment requires path, filename, and size' };
    }
    if (ref.size > maxBytes) {
      return { ok: false, error: `"${ref.filename}" exceeds the ${formatAttachmentSize(maxBytes)} limit` };
    }
    totalBytes += ref.size;
    if (totalBytes > maxBytes) {
      return { ok: false, error: `Total attachment size cannot exceed ${formatAttachmentSize(maxBytes)}` };
    }
    refs.push({
      attachmentId: ref.attachmentId || ref.path,
      path: ref.path,
      filename: sanitizeFilename(ref.filename),
      contentType: ref.contentType || 'application/octet-stream',
      size: ref.size,
    });
  }

  return { ok: true, refs, totalBytes };
}

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Failed to read file'));
        return;
      }
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function validateFilesForCompose(
  files: File[],
  existingTotalBytes: number,
  maxBytes: number = TAUMAIL_MAX_ATTACHMENT_BYTES
): { ok: true; files: File[] } | { ok: false; error: string } {
  if (files.length === 0) return { ok: true, files: [] };

  let addedBytes = 0;
  for (const file of files) {
    if (file.size > maxBytes) {
      return {
        ok: false,
        error: `"${file.name}" is ${formatAttachmentSize(file.size)}. Max per file: ${formatAttachmentSize(maxBytes)}`,
      };
    }
    addedBytes += file.size;
  }

  if (existingTotalBytes + addedBytes > maxBytes) {
    return {
      ok: false,
      error: `Total attachments cannot exceed ${formatAttachmentSize(maxBytes)}`,
    };
  }

  return { ok: true, files };
}
