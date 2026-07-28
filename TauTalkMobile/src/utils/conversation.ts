import type { Conversation, ConversationPeer } from '../api/client';

export function displayNameForConversation(
  conv: Conversation,
  currentUserId?: string
): string {
  if (conv.type === 'group' && conv.title) return conv.title;
  if (conv.peer?.full_name) return conv.peer.full_name;
  if (conv.title) return conv.title;
  if (conv.peer?.username) return conv.peer.username;
  return conv.type === 'group' ? 'Group chat' : 'Unknown';
}

export function usernameForConversation(conv: Conversation): string | null {
  if (conv.peer?.username) return `@${conv.peer.username}`;
  return null;
}

export function peerFromCreateResponse(
  id: string,
  peer?: ConversationPeer
): Conversation['peer'] {
  if (!peer) return null;
  return peer;
}

export function formatChatTime(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/** Client fallback when API has not deployed peer enrichment yet */
export async function enrichConversationPeer(
  token: string,
  userId: string,
  conv: Conversation,
  fetchKeys: (
    t: string,
    id: string
  ) => Promise<{ participants: Array<{ userId: string; username: string; fullName?: string | null }> }>,
  lookupUser?: (t: string, q: string) => Promise<ConversationPeer | null>
): Promise<Conversation> {
  if (conv.type !== 'direct' || conv.peer?.full_name) return conv;
  try {
    const keys = await fetchKeys(token, conv.id);
    const other = keys.participants.find((p) => String(p.userId) !== String(userId));
    if (!other) return conv;
    if (lookupUser) {
      const profile = await lookupUser(token, other.username);
      if (profile) {
        return { ...conv, peer: profile };
      }
    }
    const displayName =
      other.fullName ||
      other.username.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      ...conv,
      peer: {
        id: other.userId,
        username: other.username,
        email: '',
        full_name: displayName,
        avatar_url: null,
      },
    };
  } catch {
    return conv;
  }
}
