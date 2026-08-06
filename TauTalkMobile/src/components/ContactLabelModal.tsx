import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Avatar from './Avatar';
import GlassPanel from './GlassPanel';
import {
  fetchContactLabel,
  removeContactLabel,
  saveContactLabel,
} from '../api/client';
import { colors, radii } from '../theme';

type Props = {
  visible: boolean;
  token: string;
  contactUserId: string | null;
  realName: string;
  username: string | null;
  avatarUrl?: string | null;
  onClose: () => void;
  onUpdated: (contactUserId: string, label: string | null) => void;
};

export default function ContactLabelModal({
  visible,
  token,
  contactUserId,
  realName,
  username,
  avatarUrl,
  onClose,
  onUpdated,
}: Props) {
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible || !contactUserId) return;
    setLoading(true);
    fetchContactLabel(token, contactUserId)
      .then((saved) => setLabel(saved ?? ''))
      .catch(() => setLabel(''))
      .finally(() => setLoading(false));
  }, [visible, token, contactUserId]);

  const save = async () => {
    if (!contactUserId) return;
    setSaving(true);
    try {
      const trimmed = label.trim();
      if (!trimmed) {
        await removeContactLabel(token, contactUserId);
        onUpdated(contactUserId, null);
      } else {
        const saved = await saveContactLabel(token, contactUserId, trimmed);
        onUpdated(contactUserId, saved);
      }
      onClose();
    } catch (e) {
      /* Alert handled by caller if needed */
    } finally {
      setSaving(false);
    }
  };

  if (!visible || !contactUserId) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <GlassPanel style={styles.card} strong>
          <Text style={styles.title}>Contact name</Text>
          <Text style={styles.hint}>Only you see this nickname</Text>

          <View style={styles.profileRow}>
            <Avatar name={realName} size={56} gold imageUrl={avatarUrl} />
            <View style={styles.profileText}>
              <Text style={styles.realName}>{realName}</Text>
              {username ? <Text style={styles.handle}>@{username}</Text> : null}
            </View>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.goldLight} style={{ marginVertical: 16 }} />
          ) : (
            <TextInput
              style={styles.input}
              value={label}
              onChangeText={setLabel}
              placeholder={realName}
              placeholderTextColor={colors.textSoft}
            />
          )}

          <View style={styles.actions}>
            <Pressable
              style={styles.secondary}
              onPress={async () => {
                if (!contactUserId) return;
                setSaving(true);
                try {
                  await removeContactLabel(token, contactUserId);
                  onUpdated(contactUserId, null);
                  onClose();
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}>
              <Text style={styles.secondaryText}>Use real name</Text>
            </Pressable>
            <Pressable style={styles.primary} onPress={save} disabled={saving || loading}>
              {saving ? (
                <ActivityIndicator color="#1a1200" />
              ) : (
                <Text style={styles.primaryText}>Save</Text>
              )}
            </Pressable>
          </View>

          <Pressable onPress={onClose} style={styles.cancelWrap}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </GlassPanel>
      </View>
    </Modal>
  );
}

export type ReplyQuote = {
  id: string;
  senderUsername: string;
  preview: string;
};

type ReplyBarProps = {
  quote: ReplyQuote;
  onClear: () => void;
};

export function ReplyBar({ quote, onClear }: ReplyBarProps) {
  return (
    <View style={replyStyles.bar}>
      <View style={replyStyles.accent} />
      <View style={replyStyles.body}>
        <Text style={replyStyles.name} numberOfLines={1}>
          {quote.senderUsername}
        </Text>
        <Text style={replyStyles.preview} numberOfLines={1}>
          {quote.preview}
        </Text>
      </View>
      <Pressable onPress={onClear} hitSlop={8}>
        <Text style={replyStyles.close}>×</Text>
      </Pressable>
    </View>
  );
}

const replyStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: 8,
  },
  accent: { width: 3, alignSelf: 'stretch', borderRadius: 2, backgroundColor: colors.gold },
  body: { flex: 1, minWidth: 0 },
  name: { color: colors.gold, fontSize: 12, fontWeight: '700' },
  preview: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  close: { color: colors.textMuted, fontSize: 22, lineHeight: 22 },
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  card: { padding: 22 },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  hint: { color: colors.textMuted, fontSize: 12, marginTop: 4, marginBottom: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  profileText: { flex: 1 },
  realName: { color: colors.text, fontWeight: '700', fontSize: 16 },
  handle: { color: colors.gold, fontSize: 12, marginTop: 2 },
  input: {
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    marginBottom: 16,
  },
  actions: { flexDirection: 'row', gap: 10 },
  secondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  secondaryText: { color: colors.textMuted, fontWeight: '600' },
  primary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: colors.goldLight,
    alignItems: 'center',
  },
  primaryText: { color: '#1a1200', fontWeight: '800' },
  cancelWrap: { marginTop: 14, alignItems: 'center' },
  cancel: { color: colors.textSoft, fontWeight: '600' },
});
