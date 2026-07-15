import {
  createSignedUploadUrl,
  deleteObject,
  downloadObject,
  getSupabaseStorageConfig,
} from '@/lib/supabase-storage';
import { sanitizeFilename } from '@/lib/taumail-attachments';

const MAIL_PREFIX = 'mail-attachments';

export function buildMailAttachmentPath(
  userId: string | number,
  attachmentId: string,
  filename: string
): string {
  return `${MAIL_PREFIX}/${userId}/${attachmentId}/${sanitizeFilename(filename)}`;
}

export async function prepareMailAttachmentUpload(
  userId: string | number,
  attachmentId: string,
  filename: string
) {
  const cfg = getSupabaseStorageConfig();
  if (!cfg) throw new Error('File storage is not configured for attachments');

  const path = buildMailAttachmentPath(userId, attachmentId, filename);
  const signed = await createSignedUploadUrl(cfg, path);
  return { ...signed, path, attachmentId };
}

export async function fetchMailAttachmentContent(storagePath: string) {
  const cfg = getSupabaseStorageConfig();
  if (!cfg) throw new Error('File storage is not configured');

  const { data, contentType } = await downloadObject(cfg, storagePath);
  return {
    content: Buffer.from(data).toString('base64'),
    contentType,
  };
}

export async function deleteMailAttachment(storagePath: string) {
  const cfg = getSupabaseStorageConfig();
  if (!cfg) return;
  try {
    await deleteObject(cfg, storagePath);
  } catch (err) {
    console.warn('[taumail] failed to delete temp attachment:', storagePath, err);
  }
}
