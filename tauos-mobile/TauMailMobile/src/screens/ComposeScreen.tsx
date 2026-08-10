import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TauMailIcon } from '../components/TauMailIcon';
import DocumentPicker from 'react-native-document-picker';
import {
  sendEmail,
  uploadAttachment,
  saveLocalDraft,
  loadLocalDraft,
  clearLocalDraft,
  getTauMailMobileConfig,
  OfflineError,
  tokens,
  type TauMailAttachmentRef,
} from '@tau/taumail-mobile-client';

const DRAFT_ID = 'compose-active';

type PendingAttachment = TauMailAttachmentRef & { localUri?: string };

const ComposeScreen = ({ navigation, route }: any) => {
  const replyTo = route.params?.replyTo;
  const forward = route.params?.forward;
  const prefillTo = route.params?.to as string | undefined;

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      if (replyTo) {
        setTo(replyTo.from);
        setSubject(replyTo.subject.startsWith('Re:') ? replyTo.subject : `Re: ${replyTo.subject}`);
        setBody(`\n\n---\n${replyTo.body}`);
        return;
      }
      if (forward) {
        setSubject(forward.subject.startsWith('Fwd:') ? forward.subject : `Fwd: ${forward.subject}`);
        setBody(`\n\n--- Forwarded ---\n${forward.body}`);
        return;
      }
      if (prefillTo) {
        setTo(prefillTo);
        return;
      }
      const draft = await loadLocalDraft(getTauMailMobileConfig().storage, DRAFT_ID);
      if (draft) {
        setTo(draft.to);
        setSubject(draft.subject);
        setBody(draft.body);
      }
    })();
  }, [replyTo, forward, prefillTo]);

  const persistDraft = async () => {
    if (!to && !subject && !body) return;
    await saveLocalDraft(getTauMailMobileConfig().storage, DRAFT_ID, { to, subject, body });
  };

  const handleAddAttachment = async () => {
    try {
      const picked = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });
      setUploading(true);
      const uri = picked.fileCopyUri || picked.uri;
      const result = await uploadAttachment({
        uri,
        name: picked.name || 'attachment',
        type: picked.type || 'application/octet-stream',
        size: picked.size ?? 0,
      });
      if (!result.ok) {
        Alert.alert('Upload failed', result.error);
        return;
      }
      setAttachments((prev) => [...prev, { ...result.ref, localUri: uri }]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Attachment error', 'Could not attach file');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async () => {
    if (!to || !subject || !body) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSending(true);
    try {
      const result = await sendEmail({
        to: to.trim(),
        subject,
        body,
        inReplyTo: replyTo?.id,
        attachments: attachments.map(({ attachmentId, path, filename, contentType, size }) => ({
          attachmentId,
          path,
          filename,
          contentType,
          size,
        })),
      });
      if (!result.ok) {
        Alert.alert('Send failed', result.error);
        return;
      }
      await clearLocalDraft(getTauMailMobileConfig().storage, DRAFT_ID);
      Alert.alert('Sent', 'Your message was sent.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof OfflineError ? 'Offline — draft saved locally.' : 'Could not send message',
      );
      await persistDraft();
    } finally {
      setSending(false);
    }
  };

  const handleCancel = () => {
    if (to || subject || body || attachments.length) {
      Alert.alert('Discard draft?', undefined, [
        { text: 'Keep editing', style: 'cancel' },
        {
          text: 'Save draft',
          onPress: async () => {
            await persistDraft();
            navigation.goBack();
          },
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: async () => {
            await clearLocalDraft(getTauMailMobileConfig().storage, DRAFT_ID);
            navigation.goBack();
          },
        },
      ]);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Compose</Text>
          <TouchableOpacity onPress={handleSend} disabled={sending || uploading}>
            {sending ? (
              <ActivityIndicator color={tokens.colors.gold} />
            ) : (
              <TauMailIcon name="send" size={24} color={tokens.colors.gold} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>To</Text>
          <TextInput
            style={styles.input}
            value={to}
            onChangeText={setTo}
            placeholder="recipient@tauos.org"
            placeholderTextColor={tokens.colors.textTertiary}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholderTextColor={tokens.colors.textTertiary}
          />
          <TextInput
            style={styles.bodyInput}
            value={body}
            onChangeText={setBody}
            placeholder="Message"
            placeholderTextColor={tokens.colors.textTertiary}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.attachBtn} onPress={handleAddAttachment} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color={tokens.colors.gold} />
            ) : (
              <>
                <TauMailIcon name="paperclip" size={20} color={tokens.colors.gold} />
                <Text style={styles.attachText}>Add attachment</Text>
              </>
            )}
          </TouchableOpacity>

          {attachments.map((file, index) => (
            <View key={`${file.filename}-${index}`} style={styles.attachmentRow}>
              <TauMailIcon name="file" size={18} color={tokens.colors.gold} />
              <Text style={styles.attachmentName} numberOfLines={1}>
                {file.filename}
              </Text>
              <TouchableOpacity onPress={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}>
                <TauMailIcon name="xCircle" size={18} color={tokens.colors.textTertiary} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  cancelText: { color: tokens.colors.gold, fontSize: 16 },
  headerTitle: { color: tokens.colors.textPrimary, fontSize: 18, fontWeight: '700' },
  content: { padding: 16 },
  label: { color: tokens.colors.textSecondary, marginBottom: 8, fontWeight: '600' },
  input: {
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: tokens.radius.md,
    padding: 12,
    color: tokens.colors.textPrimary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  bodyInput: {
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: tokens.radius.md,
    padding: 12,
    color: tokens.colors.textPrimary,
    minHeight: 200,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.goldBorder,
    backgroundColor: tokens.colors.goldSurface,
  },
  attachText: { color: tokens.colors.gold, fontWeight: '600' },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 10,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.pageSecondary,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  attachmentName: { flex: 1, color: tokens.colors.textPrimary },
});

export default ComposeScreen;
