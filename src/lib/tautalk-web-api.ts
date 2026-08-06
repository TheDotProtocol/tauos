import type { ConversationCryptoContext } from '@/lib/tautalk-crypto';

export type TalkProfile = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
};

export type TalkMessage = {
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
  /** Current + historical keys for decrypt after browser/device changes */
  publicKeys?: string[];
  lastReadAt?: string | null;
};

export type CallSession = {
  id: string;
  conversation_id: string;
  caller_id: string;
  callee_id: string;
  mode: 'voice' | 'video';
  status: string;
  started_at: string;
  caller?: { username: string; full_name: string; avatar_url?: string | null };
};

export type IncomingCall = CallSession & {
  caller?: { username: string; full_name: string; avatar_url?: string | null };
};

function headers(token: string) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as T;
}

export async function fetchProfile(token: string): Promise<TalkProfile> {
  const res = await fetch('/api/tautalk/profile', { headers: headers(token) });
  const data = await parseJson<{ profile: TalkProfile }>(res);
  return data.profile;
}

export async function updateProfile(
  token: string,
  updates: { username?: string; fullName?: string }
): Promise<TalkProfile> {
  const res = await fetch('/api/tautalk/profile', {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(updates),
  });
  const data = await parseJson<{ profile: TalkProfile }>(res);
  return data.profile;
}

export async function uploadAvatar(token: string, file: File): Promise<TalkProfile> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/tautalk/profile/avatar', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await parseJson<{ profile: TalkProfile; avatarUrl: string }>(res);
  return { ...data.profile, avatarUrl: data.avatarUrl ?? data.profile.avatarUrl };
}

export async function fetchConversationKeys(
  token: string,
  conversationId: string
): Promise<KeyParticipant[]> {
  const res = await fetch(
    `/api/tautalk/conversations/keys?conversationId=${encodeURIComponent(conversationId)}`,
    { headers: headers(token) }
  );
  const data = await parseJson<{ participants: KeyParticipant[] }>(res);
  return data.participants ?? [];
}

export async function buildCryptoContext(
  conversationId: string,
  convType: string,
  participants: KeyParticipant[],
  token?: string
): Promise<ConversationCryptoContext> {
  const { getOrCreateKeyPair } = await import('@/lib/tautalk-crypto');
  const { publicKey } = await getOrCreateKeyPair();

  const enriched = await Promise.all(
    participants.map(async (p) => {
      const fromApi = p.publicKeys?.length
        ? p.publicKeys
        : p.publicKey
          ? [p.publicKey]
          : [];
      if (fromApi.length > 0) {
        return { ...p, publicKey: p.publicKey ?? fromApi[0], publicKeys: fromApi };
      }
      if (!token) return p;
      try {
        const res = await fetch(
          `/api/tautalk/identity?q=${encodeURIComponent(p.username)}`,
          { headers: headers(token) }
        );
        if (!res.ok) return p;
        const data = (await res.json()) as {
          key?: { public_key?: string } | null;
        };
        const pk = data.key?.public_key ?? null;
        return pk ? { ...p, publicKey: pk, publicKeys: [pk] } : p;
      } catch {
        return p;
      }
    })
  );

  const participantPublicKeys: string[] = [];
  for (const p of enriched) {
    const keys = p.publicKeys?.length
      ? p.publicKeys
      : p.publicKey
        ? [p.publicKey]
        : [];
    for (const k of keys) {
      if (k && !participantPublicKeys.includes(k)) participantPublicKeys.push(k);
    }
  }
  if (!participantPublicKeys.includes(publicKey)) {
    participantPublicKeys.push(publicKey);
  }
  return {
    type: convType === 'group' ? 'group' : 'direct',
    myPublicKey: publicKey,
    participantPublicKeys,
  };
}

export async function startCall(
  token: string,
  conversationId: string,
  mode: 'voice' | 'video'
): Promise<CallSession> {
  const res = await fetch('/api/tautalk/calls', {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ conversationId, mode }),
  });
  const data = await parseJson<{ session: CallSession }>(res);
  return data.session;
}

export async function fetchIncomingCalls(token: string): Promise<IncomingCall[]> {
  const res = await fetch('/api/tautalk/calls', { headers: headers(token) });
  const data = await parseJson<{ incoming: IncomingCall[] }>(res);
  return data.incoming ?? [];
}

export async function fetchCallSession(token: string, sessionId: string): Promise<CallSession> {
  const res = await fetch(`/api/tautalk/calls?sessionId=${encodeURIComponent(sessionId)}`, {
    headers: headers(token),
  });
  const data = await parseJson<{ session: CallSession }>(res);
  return data.session;
}

export async function acceptCall(token: string, sessionId: string) {
  const res = await fetch(`/api/tautalk/calls/${sessionId}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ action: 'accept' }),
  });
  return parseJson<{ session: CallSession }>(res);
}

export async function declineCall(token: string, sessionId: string) {
  await fetch(`/api/tautalk/calls/${sessionId}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ action: 'decline' }),
  });
}

export async function endCall(token: string, sessionId: string) {
  await fetch(`/api/tautalk/calls/${sessionId}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ action: 'end' }),
  });
}

export async function missCall(token: string, sessionId: string) {
  await fetch(`/api/tautalk/calls/${sessionId}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ action: 'miss' }),
  });
}

export async function uploadAttachment(token: string, file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/tautalk/attachments', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await parseJson<{
    attachment: { path: string; url: string; mime: string; size: number; name: string };
  }>(res);
  return data.attachment;
}

export async function signedAttachmentUrl(token: string, path: string) {
  const res = await fetch(`/api/tautalk/attachments?path=${encodeURIComponent(path)}`, {
    headers: headers(token),
  });
  const data = await parseJson<{ url: string }>(res);
  return data.url;
}

export async function sendCallSignal(
  token: string,
  sessionId: string,
  signalType: string,
  payload: unknown
) {
  await fetch(`/api/tautalk/calls/${sessionId}/signals`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ signalType, payload }),
  });
}

export async function pollCallSignals(token: string, sessionId: string, since?: string) {
  const qs = since ? `?since=${encodeURIComponent(since)}` : '';
  try {
    const res = await fetch(`/api/tautalk/calls/${sessionId}/signals${qs}`, {
      headers: headers(token),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      signals?: Array<{ id: string; signal_type: string; payload: unknown; created_at: string }>;
      error?: string;
    };
    return data.signals ?? [];
  } catch {
    return [];
  }
}

export type TypingUser = {
  user_id: string;
  username: string;
  full_name?: string | null;
  updated_at: string;
};

export async function fetchTyping(token: string, conversationId: string): Promise<TypingUser[]> {
  const res = await fetch(
    `/api/tautalk/conversations/typing?conversationId=${encodeURIComponent(conversationId)}`,
    { headers: headers(token) }
  );
  const data = await parseJson<{ typing: TypingUser[] }>(res);
  return data.typing ?? [];
}

export async function sendTyping(token: string, conversationId: string) {
  await fetch('/api/tautalk/conversations/typing', {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ conversationId }),
  });
}

export async function fetchContactLabel(
  token: string,
  contactUserId: string
): Promise<string | null> {
  const res = await fetch(
    `/api/tautalk/contacts/label?contactUserId=${encodeURIComponent(contactUserId)}`,
    { headers: headers(token) }
  );
  const data = await parseJson<{ label: string | null }>(res);
  return data.label ?? null;
}

export async function saveContactLabel(
  token: string,
  contactUserId: string,
  displayName: string
): Promise<string> {
  const res = await fetch('/api/tautalk/contacts/label', {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ contactUserId, displayName }),
  });
  const data = await parseJson<{ label: string }>(res);
  return data.label;
}

export async function removeContactLabel(token: string, contactUserId: string) {
  await fetch(
    `/api/tautalk/contacts/label?contactUserId=${encodeURIComponent(contactUserId)}`,
    { method: 'DELETE', headers: headers(token) }
  );
}
