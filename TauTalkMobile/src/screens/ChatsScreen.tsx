import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Conversation,
  createConversation,
  fetchConversationKeys,
  fetchConversations,
  lookupUser,
  registerIdentityKey,
} from '../api/client';
import Avatar from '../components/Avatar';
import GlassPanel from '../components/GlassPanel';
import PrivacyPledge from '../components/PrivacyPledge';
import { getOrCreateKeyPair } from '../crypto/tautalk-crypto';
import { colors, radii } from '../theme';
import type { TauUser } from '../storage/session';
import {
  displayNameForConversation,
  enrichConversationPeer,
  formatChatTime,
  usernameForConversation,
} from '../utils/conversation';

type Props = {
  token: string;
  user: TauUser;
  onOpenChat: (conversation: Conversation) => void;
  onOpenProfile: () => void;
  onLogout: () => void;
};

function normalizePeer(raw: Conversation['peer']): Conversation['peer'] {
  if (!raw) return null;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Conversation['peer'];
    } catch {
      return null;
    }
  }
  return raw;
}

export default function ChatsScreen({ token, user, onOpenChat, onOpenProfile, onLogout }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newQuery, setNewQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      let list = (await fetchConversations(token)).map((c) => ({
        ...c,
        peer: normalizePeer(c.peer),
      }));
      list = await Promise.all(
        list.map((c) =>
          enrichConversationPeer(token, user.id, c, fetchConversationKeys, lookupUser)
        )
      );
      setConversations(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, [token, user.id]);

  useEffect(() => {
    (async () => {
      try {
        const { publicKey } = await getOrCreateKeyPair();
        await registerIdentityKey(token, publicKey);
      } catch {
        /* best-effort */
      }
      await refresh();
    })();
  }, [token, refresh]);

  const startChat = async () => {
    if (!newQuery.trim()) return;
    setCreating(true);
    setError('');
    try {
      const data = await createConversation(token, newQuery.trim());
      setShowNew(false);
      setNewQuery('');
      await refresh();
      const peer = data.conversation.peer ?? null;
      onOpenChat({
        id: data.conversation.id,
        type: 'direct',
        title: peer?.full_name ?? null,
        updated_at: new Date().toISOString(),
        last_message_at: null,
        last_message_encrypted: null,
        unread_count: 0,
        peer: peer ?? null,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start chat');
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.whatsappHeader} />

      <View style={styles.header}>
        <Pressable style={styles.headerLeft} onPress={onOpenProfile}>
          <Avatar name={user.fullName || user.username} size={42} gold imageUrl={user.avatarUrl} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>TauTalk</Text>
            <Text style={styles.headerSub}>
              @{user.username} · tap for profile
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={onLogout} style={styles.logoutBtn} hitSlop={8}>
          <Text style={styles.logout}>Logout</Text>
        </Pressable>
      </View>

      <Pressable style={styles.searchBar} onPress={() => setShowNew(true)}>
        <Text style={styles.searchPlaceholder}>Search or start new chat</Text>
        <View style={styles.fabMini}>
          <Text style={styles.fabMiniText}>+</Text>
        </View>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator color={colors.goldLight} style={{ marginTop: 48 }} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            conversations.length === 0 ? styles.emptyList : styles.listContent
          }
          ListFooterComponent={<PrivacyPledge compact />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No chats yet</Text>
              <Text style={styles.empty}>Tap above to message someone by email or @username</Text>
            </View>
          }
          renderItem={({ item }) => {
            const name = displayNameForConversation(item, user.id);
            const handle = usernameForConversation(item);
            const avatar = item.peer?.avatar_url ?? null;
            return (
              <Pressable style={styles.row} onPress={() => onOpenChat(item)}>
                <Avatar name={name} size={52} imageUrl={avatar} />
                <View style={styles.rowBody}>
                  <View style={styles.rowTop}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {name}
                    </Text>
                    <Text style={styles.rowTime}>{formatChatTime(item.last_message_at)}</Text>
                  </View>
                  <View style={styles.rowBottom}>
                    <Text style={styles.rowPreview} numberOfLines={1}>
                      {handle ? `${handle} · ` : ''}
                      {item.last_message_at ? 'Encrypted message' : 'Say hello 👋'}
                    </Text>
                    {item.unread_count > 0 ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.unread_count}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}

      <Pressable style={styles.fab} onPress={() => setShowNew(true)}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Modal visible={showNew} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <GlassPanel style={styles.modalCard} strong>
            <Text style={styles.modalTitle}>New chat</Text>
            <Text style={styles.modalHint}>Email, phone, or @username</Text>
            <TextInput
              style={styles.input}
              placeholder="arun@taumail.org or @arun-mail"
              placeholderTextColor={colors.textSoft}
              autoCapitalize="none"
              value={newQuery}
              onChangeText={setNewQuery}
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowNew(false)} style={styles.modalSecondary}>
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={startChat} style={styles.modalPrimary} disabled={creating}>
                {creating ? (
                  <ActivityIndicator color="#1a1200" />
                ) : (
                  <Text style={styles.modalPrimaryText}>Start</Text>
                )}
              </Pressable>
            </View>
          </GlassPanel>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.chatBg },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: colors.whatsappHeader,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  headerText: { flex: 1 },
  headerTitle: { color: colors.goldLight, fontSize: 22, fontWeight: '800' },
  headerSub: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  logoutBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.sm,
    backgroundColor: colors.goldDim,
  },
  logout: { color: colors.goldLight, fontWeight: '700', fontSize: 13 },
  searchBar: {
    marginHorizontal: 14,
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchPlaceholder: { color: colors.textSoft, fontSize: 15 },
  fabMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabMiniText: { color: '#1a1200', fontWeight: '800', fontSize: 18, marginTop: -1 },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowBody: { flex: 1 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowTitle: { color: colors.text, fontWeight: '700', fontSize: 17, flex: 1, paddingRight: 8 },
  rowTime: { color: colors.textSoft, fontSize: 12 },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  rowPreview: { color: colors.textMuted, fontSize: 14, flex: 1, paddingRight: 8 },
  badge: {
    backgroundColor: colors.goldLight,
    borderRadius: radii.full,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#1a1200', fontSize: 12, fontWeight: '800' },
  emptyWrap: { padding: 40, alignItems: 'center' },
  emptyTitle: { color: colors.goldLight, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  empty: { color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  listContent: { paddingBottom: 88, paddingHorizontal: 12, paddingTop: 4 },
  error: { color: colors.danger, textAlign: 'center', paddingHorizontal: 16 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.goldLight,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  fabText: { color: '#1a1200', fontSize: 32, fontWeight: '300', marginTop: -2 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 22,
  },
  modalTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
  modalHint: { color: colors.textMuted, marginTop: 4, marginBottom: 14 },
  input: {
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 18 },
  modalSecondary: { paddingVertical: 10, paddingHorizontal: 16 },
  modalSecondaryText: { color: colors.textMuted, fontWeight: '600' },
  modalPrimary: {
    backgroundColor: colors.goldLight,
    borderRadius: radii.md,
    paddingVertical: 11,
    paddingHorizontal: 22,
    minWidth: 88,
    alignItems: 'center',
  },
  modalPrimaryText: { color: '#1a1200', fontWeight: '800' },
});
