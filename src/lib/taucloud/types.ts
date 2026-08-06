import { formatCloudFileSize, formatCloudRelativeTime, mimeTypeLabel } from '@/lib/taucloud/format';

export type TauCloudFile = {
  id: string;
  name: string;
  size: number;
  sizeLabel: string;
  mimeType: string;
  typeLabel: string;
  folder: string;
  uploadedAt: string;
  timeLabel: string;
  isShared: boolean;
  starred?: boolean;
  deletedAt?: string | null;
  thumbnailUrl?: string;
};

export type TauCloudStorage = {
  used: number;
  limit: number;
  usedPercent: number;
  usedLabel: string;
  limitLabel: string;
};

export type TauCloudProfile = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string | null;
  storage: TauCloudStorage;
};

export type TauCloudActivityItem = {
  id: string;
  title: string;
  meta: string;
  timeLabel: string;
  tone: 'green' | 'gold';
  action: string;
};

export type TauCloudShareLink = {
  id: string;
  token: string;
  fileId: string;
  fileName: string;
  fileSizeLabel: string;
  shareUrl: string;
  expiresAt: string | null;
  isExpired: boolean;
  downloadCount: number;
  createdAt: string;
  timeLabel: string;
};

export type TauCloudFolder = {
  name: string;
  label: string;
  fileCount: number;
  totalSize: number;
  sizeLabel: string;
};

export type TauCloudStorageBreakdown = {
  category: string;
  fileCount: number;
  totalSize: number;
  sizeLabel: string;
  percent: number;
};

export function mapApiCloudFile(row: Record<string, unknown>): TauCloudFile {
  const uploadedAt = String(row.uploaded_at || row.created_at || new Date().toISOString());
  const mimeType = String(row.mime_type || 'application/octet-stream');
  const size = Number(row.file_size ?? row.size_bytes ?? 0);
  return {
    id: String(row.id),
    name: String(row.original_name || row.name || 'Untitled'),
    size,
    sizeLabel: formatCloudFileSize(size),
    mimeType,
    typeLabel: mimeTypeLabel(mimeType, String(row.original_name || '')),
    folder: String(row.folder || 'root'),
    uploadedAt,
    timeLabel: formatCloudRelativeTime(uploadedAt),
    isShared: Boolean(row.is_shared),
    starred: Boolean(row.is_starred),
    deletedAt: row.deleted_at ? String(row.deleted_at) : null,
  };
}

export function mapApiActivity(row: Record<string, unknown>): TauCloudActivityItem {
  const action = String(row.action || '');
  const createdAt = String(row.created_at || new Date().toISOString());
  const goldActions = new Set(['share', 'revoke_share', 'star', 'folder_create', '2fa_enable', '2fa_disable']);
  return {
    id: String(row.id),
    title: String(row.title || 'Vault event'),
    meta: String(row.meta || 'Via Web Portal'),
    timeLabel: formatCloudRelativeTime(createdAt),
    tone: goldActions.has(action) ? 'gold' : 'green',
    action,
  };
}

export function mapApiShare(row: Record<string, unknown>): TauCloudShareLink {
  const fileSize = Number(row.file_size || 0);
  const createdAt = String(row.created_at || new Date().toISOString());
  const expiresAt = row.expires_at ? String(row.expires_at) : null;
  return {
    id: String(row.id),
    token: String(row.token || ''),
    fileId: String(row.file_id || ''),
    fileName: String(row.original_name || 'Untitled'),
    fileSizeLabel: formatCloudFileSize(fileSize),
    shareUrl: String(row.fullUrl || `/taucloud/shared/${row.token}`),
    expiresAt,
    isExpired: Boolean(row.isExpired),
    downloadCount: Number(row.download_count || 0),
    createdAt,
    timeLabel: formatCloudRelativeTime(createdAt),
  };
}

export function mapApiFolder(row: Record<string, unknown>): TauCloudFolder {
  const name = String(row.name || 'root');
  const totalSize = Number(row.total_size || 0);
  return {
    name,
    label: name === 'root' ? 'My Vault' : name.replace(/_/g, ' '),
    fileCount: Number(row.file_count || 0),
    totalSize,
    sizeLabel: formatCloudFileSize(totalSize),
  };
}

export function mapApiStorageBreakdown(row: Record<string, unknown>, totalUsed = 0): TauCloudStorageBreakdown {
  const totalSize = Number(row.total_size || 0);
  const used = totalUsed || totalSize;
  return {
    category: String(row.category || 'Other'),
    fileCount: Number(row.file_count || 0),
    totalSize,
    sizeLabel: formatCloudFileSize(totalSize),
    percent: used > 0 ? (totalSize / used) * 100 : 0,
  };
}

export function mapApiStorage(raw: { used: number; limit: number; usedPercent?: number }): TauCloudStorage {
  const used = Number(raw.used || 0);
  const limit = Number(raw.limit || 0);
  const usedPercent = raw.usedPercent ?? (limit > 0 ? (used / limit) * 100 : 0);
  return {
    used,
    limit,
    usedPercent,
    usedLabel: formatCloudFileSize(used),
    limitLabel: formatCloudFileSize(limit),
  };
}
