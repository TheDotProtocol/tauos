import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  createGroupConversation,
  fetchConversationKeys,
  fetchConversations,
  lookupUser,
  registerIdentityKey,
} from '../api/client';
import Avatar from '../components/Avatar';
import GlassPanel from '../components/GlassPanel';
import MIcon from '../components/MIcon';
import PrivacyPledge from '../components/PrivacyPledge';
import { getOrCreateKeyPair } from '../crypto/tautalk-crypto';
import { colors, radii } from '../theme';
import type { TauUser } from '../storage/session';
import {
  displayNameForConversation,
  enrichConversationPeer,
  formatChatTime,
  matchesConversationSearch,
  usernameForConversation,
} from '../utils/conversation';

type Props = {
  token: string;
  user: TauUser;
  onOpenChat: (conversation: Conversation) => void;
  onOpenProfile: () => void;
  onLogout: () => void;
};

type NewMode = 'direct' | 'group';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newMode, setNewMode] = useState<NewMode>('direct');
  const [newQuery, setNewQuery] = useState('');
  const [groupTitle, setGroupTitle] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
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

  const filtered = useMemo(
    () => conversations.filter((c) => matchesConversationSearch(c, searchQuery)),
    [conversations, searchQuery]
  );

  const resolveMemberIds = async (raw: string): Promise<string[]> => {
    const queries = raw.split(',').map((s) => s.trim()).filter(Boolean);
    const ids: string[] = [];
    for (const q of queries) {
      const profile = await lookupUser(token, q);
      if (profile) ids.push(String(profile.id));
    }
    return ids;
  };

  const startDirectChat = async () => {
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

  const startGroupChat = async () => {
    if (!groupTitle.trim() || !groupMembers.trim()) return;
    setCreating(true);
    setError('');
    try {
      const memberIds = await resolveMemberIds(groupMembers);
      if (memberIds.length === 0) {
        setError('Add at least one valid member email or @username');
        return;
      }
      const data = await createGroupConversation(token, groupTitle.trim(), memberIds);
      const title = groupTitle.trim();
      setShowNew(false);
      setGroupTitle('');
      setGroupMembers('');
      await refresh();
      onOpenChat({
        id: data.conversation.id,
        type: 'group',
        title,
        updated_at: new Date().toISOString(),
        last_message_at: null,
        last_message_encrypted: null,
        unread_count: 0,
        peer: null,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create group');
    } finally {
      setCreating(false);
    }
  };

  const openNewModal = (mode: NewMode) => {
    setNewMode(mode);
    setShowNew(true);
    setError('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.whatsappHeader} />

      <View style={styles.header}>
        <Pressable style={styles.headerLeft} onPress={onOpenProfile}>
          <Avatar name={user.fullName || user.username} size={42} gold imageUrl={user.avatarUrl} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>TauTalk</Text>
            <Text style={styles.headerSub}>@{user.username} · tap for profile</Text>
          </View>
        </Pressable>
        <Pressable onPress={onLogout} style={styles.logoutBtn} hitSlop={8}>
          <Text style={styles.logout}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <MIcon name="search" size={20} color={colors.textSoft} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats"
          placeholderTextColor={colors.textSoft}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <MIcon name="close" size={18} color={colors.textSoft} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionChip} onPress={() => openNewModal('direct')}>
          <MIcon name="person-add" size={18} color={colors.goldLight} />
          <Text style={styles.actionChipText}>New chat</Text>
        </Pressable>
        <Pressable style={styles.actionChip} onPress={() => openNewModal('group')}>
          <MIcon name="group-add" size={18} color={colors.goldLight} />
          <Text style={styles.actionChipText}>New group</Text>
        </Pressable>
      </View>

      {error && !showNew ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator color={colors.goldLight} style={{ marginTop: 48 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            filtered.length === 0 ? styles.emptyList : styles.listContent
          }
          ListFooterComponent={<PrivacyPledge compact />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No matches' : 'No chats yet'}
              </Text>
              <Text style={styles.empty}>
                {searchQuery
                  ? 'Try a different name or @username'
                  : 'Start a new chat or create a group above'}
              </Text>
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
                      {item.type === 'group' ? 'Group · ' : handle ? `${handle} · ` : ''}
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

      <Modal visible={showNew} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <GlassPanel style={styles.modalCard} strong>
            <View style={styles.modeTabs}>
              <Pressable
                style={[styles.modeTab, newMode === 'direct' && styles.modeTabActive]}
                onPress={() => setNewMode('direct')}>
                <Text style={[styles.modeTabText, newMode === 'direct' && styles.modeTabTextActive]}>
                  Direct
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modeTab, newMode === 'group' && styles.modeTabActive]}
                onPress={() => setNewMode('group')}>
                <Text style={[styles.modeTabText, newMode === 'group' && styles.modeTabTextActive]}>
                  Group
                </Text>
              </Pressable>
            </View>

            {newMode === 'direct' ? (
              <>
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
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>New group</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Group name"
                  placeholderTextColor={colors.textSoft}
                  value={groupTitle}
                  onChangeText={setGroupTitle}
                />
                <TextInput
                  style={[styles.input, { marginTop: 10 }]}
                  placeholder="Members: emails or @usernames, comma separated"
                  placeholderTextColor={colors.textSoft}
                  autoCapitalize="none"
                  value={groupMembers}
                  onChangeText={setGroupMembers}
                />
              </>
            )}

            {error && showNew ? <Text style={styles.modalError}>{error}</Text> : null}

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => {
                  setShowNew(false);
                  setError('');
                }}
                style={styles.modalSecondary}>
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={newMode === 'direct' ? startDirectChat : startGroupChat}
                style={styles.modalPrimary}
                disabled={creating}>
                {creating ? (
                  <ActivityIndicator color="#1a1200" />
                ) : (
                  <Text style={styles.modalPrimaryText}>
                    {newMode === 'direct' ? 'Start' : 'Create'}
                  </Text>
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
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, padding: 0 },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.goldDim,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  actionChipText: { color: colors.goldLight, fontWeight: '700', fontSize: 13 },
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
  listContent: { paddingBottom: 24, paddingHorizontal: 12, paddingTop: 4 },
  error: { color: colors.danger, textAlign: 'center', paddingHorizontal: 16 },
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
  modeTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeTabActive: {
    backgroundColor: colors.goldDim,
    borderColor: colors.glassBorder,
  },
  modeTabText: { color: colors.textMuted, fontWeight: '700' },
  modeTabTextActive: { color: colors.goldLight },
  modalTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
  modalHint: { color: colors.textMuted, marginTop: 4, marginBottom: 14 },
  modalError: { color: colors.danger, marginTop: 10, fontSize: 13 },
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
