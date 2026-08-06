export function formatCloudFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function formatCloudRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
}

export function mimeTypeLabel(mime: string, filename: string): string {
  if (mime.includes('pdf') || filename.endsWith('.pdf')) return 'PDF';
  if (mime.startsWith('image/')) return 'IMAGE';
  if (mime.includes('zip') || mime.includes('archive')) return 'ARCHIVE';
  if (mime.includes('word') || filename.endsWith('.doc')) return 'DOC';
  if (mime.startsWith('video/')) return 'VIDEO';
  return 'FILE';
}
