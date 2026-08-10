export type TauMailEmail = {
  id: string | number;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: string;
  bodyHtml?: string;
  time: string;
  unread: boolean;
  starred: boolean;
  attachment?: boolean;
  attachments?: { name: string; size: string; type: string; content?: string }[];
  avatar?: string;
};

export type TauMailFolder = 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash';

export type TauSessionUser = {
  id: string | number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string | null;
};

export type TauMailProfile = {
  fullName: string;
  displayName: string;
  email: string;
  organization: string;
  title: string;
  timezone: string;
  avatarUrl?: string | null;
};

export type TauMailAiMessage = {
  id?: string;
  role: 'user' | 'assistant';
  text: string;
};

export type TauMailContact = {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  avatar?: string;
  phone?: string;
  phoneCountryCode?: string;
  tauId?: string;
  organization?: string;
  designation?: string;
};

export type TauMailTask = {
  id: string;
  title: string;
  due: string;
  priority: string;
  done: boolean;
};

export type TauMailCalendarAgendaItem = {
  time: string;
  endTime?: string | null;
  title: string;
  location: string;
  startsAt?: string;
  endsAt?: string | null;
};

export type TauMailCalendarWeekDay = {
  label: string;
  date?: string;
  active: boolean;
};

export type TauMailCalendarData = {
  monthLabel: string;
  weekStart?: string;
  selectedDate?: string;
  weekDays: TauMailCalendarWeekDay[];
  events: {
    id: string;
    title: string;
    day: number;
    top: string;
    end?: string | null;
    color: string;
    avatars?: boolean;
    startsAt?: string;
    endsAt?: string | null;
    location?: string;
  }[];
  agenda: TauMailCalendarAgendaItem[];
  legends: { label: string; color: string }[];
};

export type TauMailStorageData = {
  usedGb: number;
  totalGb: number;
  breakdown: { label: string; used: number; total: number; color: string }[];
};

export type TauMailAttachmentRef = {
  attachmentId?: string;
  path?: string;
  filename: string;
  contentType: string;
  size: number;
};

function formatAttachmentSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parseStoredAttachments(raw: unknown): {
  filename: string;
  size: number;
  contentType: string;
  content?: string;
}[] {
  if (!raw) return [];
  let parsed: unknown = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      filename: String(row.filename || row.name || 'attachment'),
      size: Number(row.size || 0),
      contentType: String(row.contentType || row.type || 'application/octet-stream'),
      content: row.content ? String(row.content) : undefined,
    };
  });
}

export function mapApiInboxEmail(email: Record<string, unknown>): TauMailEmail {
  const body = String(email.body || email.body_text || '');
  const bodyHtml = String(email.body_html || '');
  const fromEmail = String(email.from_email || email.sender_email || '');
  const storedAttachments = parseStoredAttachments(email.attachments);
  return {
    id: email.id as string | number,
    sender: String(email.display_name || email.sender_name || fromEmail || 'Unknown'),
    senderEmail: fromEmail,
    subject: String(email.subject || 'No Subject'),
    preview: body ? `${body.slice(0, 100)}...` : 'No preview',
    body,
    bodyHtml: bodyHtml || undefined,
    time: email.received_at ? new Date(String(email.received_at)).toLocaleString() : 'Unknown',
    unread: !email.is_read,
    starred: Boolean(email.is_starred),
    attachment: storedAttachments.length > 0,
    attachments: storedAttachments.map((a) => ({
      name: a.filename,
      size: formatAttachmentSize(a.size),
      type: a.contentType,
      content: a.content,
    })),
  };
}

export function mapApiSentEmail(email: Record<string, unknown>): TauMailEmail {
  const body = String(email.body || '');
  return {
    id: email.id as string | number,
    sender: 'You',
    senderEmail: String(email.recipient_email || ''),
    subject: String(email.subject || 'No Subject'),
    preview: body ? `${body.slice(0, 100)}...` : 'No preview',
    body,
    time: email.sent_at ? new Date(String(email.sent_at)).toLocaleString() : 'Unknown',
    unread: false,
    starred: false,
  };
}

export function mapApiDraftEmail(email: Record<string, unknown>): TauMailEmail {
  const body = String(email.body || '');
  const to = String(email.to_email || '');
  return {
    id: email.id as string | number,
    sender: 'Draft',
    senderEmail: to,
    subject: String(email.subject || 'No Subject'),
    preview: body ? `${body.slice(0, 100)}...` : 'No preview',
    body,
    time: email.updated_at ? new Date(String(email.updated_at)).toLocaleString() : 'Unknown',
    unread: true,
    starred: false,
  };
}

export function mapApiTrashEmail(email: Record<string, unknown>): TauMailEmail {
  const mapped = mapApiInboxEmail(email);
  const deletedAt = email.deleted_at ? String(email.deleted_at) : null;
  return {
    ...mapped,
    time: deletedAt ? new Date(deletedAt).toLocaleString() : mapped.time,
    unread: false,
  };
}
