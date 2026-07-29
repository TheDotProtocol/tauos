export type TalkPeer = {
  id: string;
  username: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
};

export type TalkConversation = {
  id: string;
  type: 'direct' | 'group';
  title: string | null;
  updated_at: string;
  last_message_at: string | null;
  unread_count: number;
  peer?: TalkPeer | null;
};

export function parsePeer(raw: unknown): TalkPeer | null {
  if (!raw) return null;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as TalkPeer;
    } catch {
      return null;
    }
  }
  return raw as TalkPeer;
}

export function displayNameForConversation(
  conv: TalkConversation,
  currentUserId?: string | number | null
): string {
  if (conv.type === 'group' && conv.title) return conv.title;
  const peer = parsePeer(conv.peer);
  if (peer?.full_name) return peer.full_name;
  if (peer?.username) return peer.username.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  if (conv.title) return conv.title;
  return conv.type === 'group' ? 'Group chat' : 'Unknown contact';
}

export function usernameLabel(conv: TalkConversation): string | null {
  const peer = parsePeer(conv.peer);
  if (peer?.username) return `@${peer.username}`;
  return null;
}

export function peerAvatar(conv: TalkConversation): string | null {
  return parsePeer(conv.peer)?.avatar_url ?? null;
}

export function normalizeConversations(rows: TalkConversation[]): TalkConversation[] {
  return rows.map((c) => ({ ...c, peer: parsePeer(c.peer) }));
}
