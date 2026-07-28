import { API_BASE } from '../config';
import type { TauUser } from '../storage/session';

type AuthResponse = {
  token: string;
  user: TauUser;
  error?: string;
};

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    if (text.trim().startsWith('<')) {
      throw new Error(
        res.status === 404
          ? 'This feature is not live on the server yet. Deploy the latest Tau Talk update to www.tauos.org, then try again.'
          : `Server returned an unexpected response (${res.status}). Try again after deploy.`
      );
    }
    throw new Error(`Invalid server response (${res.status})`);
  }
  if (!res.ok) {
    const err = data as { error?: string };
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function login(identifier: string, password: string) {
  const trimmed = identifier.trim();
  const payload: Record<string, string> = { password };
  // Production API currently expects `email`; also send `identifier` for newer backend.
  if (trimmed.includes('@')) {
    payload.email = trimmed.toLowerCase();
  } else {
    payload.phone = trimmed;
  }
  payload.identifier = trimmed;

  const res = await fetch(`${API_BASE}/api/tautalk/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseJson<AuthResponse>(res);
}

export async function register(payload: {
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/api/tautalk/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseJson<AuthResponse>(res);
}

export type ConversationPeer = {
  id: string;
  username: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
};

export type TalkProfile = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
};

export type Conversation = {
  id: string;
  type: 'direct' | 'group';
  title: string | null;
  updated_at: string;
  last_message_at: string | null;
  last_message_encrypted: string | null;
  unread_count: number;
  peer?: ConversationPeer | null;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_username: string;
  content_encrypted: string;
  content_type: string;
  created_at: string;
};

export type KeyParticipant = {
  userId: string;
  username: string;
  fullName?: string | null;
  publicKey: string | null;
  lastReadAt?: string | null;
};

export async function fetchConversations(token: string) {
  const res = await fetch(`${API_BASE}/api/tautalk/conversations`, {
    headers: authHeaders(token),
  });
  const data = await parseJson<{ conversations: Conversation[] }>(res);
  return data.conversations ?? [];
}

export async function createConversation(token: string, query: string) {
  const res = await fetch(`${API_BASE}/api/tautalk/conversations`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ query }),
  });
  return parseJson<{ conversation: { id: string; peer?: ConversationPeer } }>(res);
}

export async function fetchConversationKeys(token: string, conversationId: string) {
  const res = await fetch(
    `${API_BASE}/api/tautalk/conversations/keys?conversationId=${encodeURIComponent(conversationId)}`,
    { headers: authHeaders(token) }
  );
  return parseJson<{ participants: KeyParticipant[] }>(res);
}

export async function fetchMessages(token: string, conversationId: string, since?: string) {
  const qs = new URLSearchParams({ conversationId });
  if (since) qs.set('since', since);
  const res = await fetch(`${API_BASE}/api/tautalk/messages?${qs.toString()}`, {
    headers: authHeaders(token),
  });
  const data = await parseJson<{ messages: Message[] }>(res);
  return data.messages ?? [];
}

export async function sendMessage(
  token: string,
  conversationId: string,
  contentEncrypted: string,
  contentType = 'text'
) {
  const res = await fetch(`${API_BASE}/api/tautalk/messages`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ conversationId, contentEncrypted, contentType }),
  });
  const data = await parseJson<{ message: Message }>(res);
  return data.message;
}

export async function fetchProfile(token: string) {
  const res = await fetch(`${API_BASE}/api/tautalk/profile`, { headers: authHeaders(token) });
  const data = await parseJson<{ profile: TalkProfile }>(res);
  return data.profile;
}

export async function updateProfile(
  token: string,
  updates: { username?: string; fullName?: string }
) {
  const res = await fetch(`${API_BASE}/api/tautalk/profile`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(updates),
  });
  const data = await parseJson<{ profile: TalkProfile }>(res);
  return data.profile;
}

export async function uploadAvatar(token: string, uri: string, fileName: string, mime: string) {
  const form = new FormData();
  form.append('file', { uri, name: fileName, type: mime } as unknown as Blob);
  const res = await fetch(`${API_BASE}/api/tautalk/profile/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: form,
  });
  const data = await parseJson<{ avatarUrl: string; profile: TalkProfile }>(res);
  return data;
}

export async function uploadAttachment(
  token: string,
  uri: string,
  fileName: string,
  mime: string
) {
  const form = new FormData();
  form.append('file', { uri, name: fileName, type: mime } as unknown as Blob);
  const res = await fetch(`${API_BASE}/api/tautalk/attachments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: form,
  });
  const data = await parseJson<{
    attachment: { path: string; url: string; mime: string; size: number; name: string };
  }>(res);
  return data.attachment;
}

export async function signedAttachmentUrl(token: string, path: string) {
  const res = await fetch(
    `${API_BASE}/api/tautalk/attachments?path=${encodeURIComponent(path)}`,
    { headers: authHeaders(token) }
  );
  const data = await parseJson<{ url: string }>(res);
  return data.url;
}

export async function sendTyping(token: string, conversationId: string) {
  await fetch(`${API_BASE}/api/tautalk/conversations/typing`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ conversationId }),
  });
}

export async function fetchTyping(token: string, conversationId: string) {
  try {
    const res = await fetch(
      `${API_BASE}/api/tautalk/conversations/typing?conversationId=${encodeURIComponent(conversationId)}`,
      { headers: authHeaders(token) }
    );
    if (!res.ok) return [];
    const text = await res.text();
    if (text.trim().startsWith('<')) return [];
    const data = JSON.parse(text) as {
      typing: Array<{ username: string; full_name: string }>;
    };
    return data.typing ?? [];
  } catch {
    return [];
  }
}

export async function lookupUser(token: string, query: string) {
  const res = await fetch(
    `${API_BASE}/api/tautalk/identity?q=${encodeURIComponent(query)}`,
    { headers: authHeaders(token) }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    user: { id: string; username: string; email: string; full_name: string; avatar_url?: string | null };
  };
  if (!data.user) return null;
  return {
    id: data.user.id,
    username: data.user.username,
    email: data.user.email,
    full_name: data.user.full_name,
    avatar_url: data.user.avatar_url ?? null,
  };
}

export async function registerIdentityKey(token: string, publicKey: string) {
  const res = await fetch(`${API_BASE}/api/tautalk/identity`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ publicKey }),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error || 'Failed to register encryption key');
  }
}
