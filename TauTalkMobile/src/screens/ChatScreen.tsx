import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import DocumentPicker from 'react-native-document-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  Conversation,
  fetchConversationKeys,
  fetchMessages,
  fetchTyping,
  IncomingCall,
  Message,
  registerIdentityKey,
  sendMessage as sendMessageApi,
  sendTyping,
  startCall,
  uploadAttachment,
} from '../api/client';
import AttachmentSheet, { AttachmentAction } from '../components/AttachmentSheet';
import Avatar from '../components/Avatar';
import CallPreviewScreen, { CallConnectionState, CallMode } from '../components/CallPreviewScreen';
import ContactLabelModal, { ReplyBar, type ReplyQuote } from '../components/ContactLabelModal';
import EmojiPicker from '../components/EmojiPicker';
import ImageViewerModal from '../components/ImageViewerModal';
import MessageActionSheet from '../components/MessageActionSheet';
import MIcon from '../components/MIcon';
import MessageBubble from '../components/MessageBubble';
import { CallMediaState, TauCallManager } from '../calls/TauCallManager';
import { TAUTALK_UNAVAILABLE_MESSAGE } from '../calls/callConstants';
import { startOutgoingRingback, stopCallSounds } from '../calls/callSounds';
import { WEBRTC_MEDIA_ENABLED } from '../config';
import {
  buildCryptoContext,
  ConversationCryptoContext,
  decryptMessage,
  encryptMessage,
  getOrCreateKeyPair,
} from '../crypto/tautalk-crypto';
import { colors, radii } from '../theme';
import type { TauUser } from '../storage/session';
import {
  displayNameForConversation,
  peerRealName,
  usernameForConversation,
  withContactLabel,
} from '../utils/conversation';
import {
  contentTypeForPayload,
  MessagePayload,
  parsePayload,
  payloadPreview,
  textPayload,
} from '../types/message-payload';
import { startVoiceRecording, stopVoiceRecording } from '../utils/voiceRecorder';

type Props = {
  token: string;
  user: TauUser;
  conversation: Conversation;
  onBack: () => void;
  onConversationUpdate?: (conversation: Conversation) => void;
  incomingCall?: IncomingCall | null;
  onIncomingHandled?: () => void;
};

type ChatItem = Message & { payload?: MessagePayload };

export default function ChatScreen({
  token,
  user,
  conversation: initialConversation,
  onBack,
  onConversationUpdate,
  incomingCall,
  onIncomingHandled,
}: Props) {
  const [conversation, setConversation] = useState(initialConversation);
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [replyTarget, setReplyTarget] = useState<ReplyQuote | null>(null);
  const [actionMessageId, setActionMessageId] = useState<string | null>(null);
  const [callMode, setCallMode] = useState<CallMode | null>(null);
  const [callConnectionState, setCallConnectionState] = useState<CallConnectionState>('preview');
  const [callMedia, setCallMedia] = useState<CallMediaState>({
    localStreamURL: null,
    remoteStreamURL: null,
    muted: false,
    cameraOff: false,
  });
  const callManagerRef = useRef(new TauCallManager());
  const [viewerUri, setViewerUri] = useState<string | null>(null);
  const [typingNames, setTypingNames] = useState<string[]>([]);
  const [cryptoCtx, setCryptoCtx] = useState<ConversationCryptoContext | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTimestampRef = useRef<string | undefined>(undefined);
  const [cryptoError, setCryptoError] = useState('');

  const peerName = displayNameForConversation(conversation, user.id);
  const peerReal = peerRealName(conversation);
  const peerHandle = usernameForConversation(conversation);
  const peerAvatar = conversation.peer?.avatar_url ?? null;
  const peerId = conversation.peer?.id ?? null;
  const isDirect = conversation.type === 'direct';

  useEffect(() => {
    setConversation(initialConversation);
  }, [initialConversation]);

  const replyQuoteFor = useCallback(
    (message: Message): ReplyQuote | null => {
      if (!message.reply_to) return null;
      const parent = messages.find((x) => x.id === message.reply_to);
      if (!parent) {
        return { id: message.reply_to, senderUsername: 'Unknown', preview: 'Original message' };
      }
      const isParentMe =
        String(parent.sender_id) === String(user.id) ||
        parent.sender_username === user.username;
      return {
        id: parent.id,
        senderUsername: isParentMe ? 'You' : parent.sender_username || 'Contact',
        preview: parent.payload ? payloadPreview(parent.payload) : '…',
      };
    },
    [messages, user.id, user.username]
  );

  const startReplyToMessage = (messageId: string) => {
    const m = messages.find((x) => x.id === messageId);
    if (!m?.payload) return;
    const isMe =
      String(m.sender_id) === String(user.id) || m.sender_username === user.username;
    setReplyTarget({
      id: m.id,
      senderUsername: isMe ? 'You' : m.sender_username || 'Contact',
      preview: payloadPreview(m.payload),
    });
    setShowEmoji(false);
  };

  const decryptBatch = useCallback(
    async (msgs: Message[], ctx: ConversationCryptoContext | null) => {
      const out: ChatItem[] = [];
      for (const m of msgs) {
        let payload: MessagePayload | undefined;
        for (let attempt = 0; attempt < 5; attempt++) {
          const plain = await decryptMessage(conversation.id, m.content_encrypted, ctx ?? undefined);
          if (plain !== null) {
            payload = parsePayload(plain);
            break;
          }
          if (attempt < 4) {
            await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
          }
        }
        out.push(payload ? { ...m, payload } : { ...m });
      }
      return out;
    },
    [conversation.id]
  );

  const sendPayload = async (payload: MessagePayload) => {
    if (!cryptoCtx) return;
    setSending(true);
    const replyToId = replyTarget?.id;
    try {
      const json = JSON.stringify(payload);
      const encrypted = await encryptMessage(conversation.id, json, cryptoCtx);
      const saved = await sendMessageApi(
        token,
        conversation.id,
        encrypted,
        contentTypeForPayload(payload),
        replyToId
      );
      setMessages((prev) => [
        ...prev,
        { ...saved, sender_username: user.username, payload },
      ]);
      lastTimestampRef.current = saved.created_at;
      setReplyTarget(null);
    } catch (e) {
      Alert.alert('Send failed', e instanceof Error ? e.message : 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  const loadAll = useCallback(async () => {
    try {
      setCryptoError('');
      const { publicKey } = await getOrCreateKeyPair();
      await registerIdentityKey(token, publicKey).catch(() => {});
      const keyData = await fetchConversationKeys(token, conversation.id);
      const ctx = await buildCryptoContext(
        conversation.id,
        conversation.type,
        keyData.participants.map((p) => ({
          publicKey: p.publicKey,
          publicKeys: p.publicKeys,
        }))
      );
      setCryptoCtx(ctx);
      const msgs = await fetchMessages(token, conversation.id);
      const decrypted = await decryptBatch(msgs, ctx);
      setMessages(decrypted);
      if (msgs.length > 0) {
        lastTimestampRef.current = msgs[msgs.length - 1].created_at;
      }
    } catch (e) {
      setCryptoError(e instanceof Error ? e.message : 'Could not load encrypted chat');
    } finally {
      setLoading(false);
    }
  }, [token, conversation.id, conversation.type, decryptBatch]);

  const pollNew = useCallback(async () => {
    if (!cryptoCtx) return;
    try {
      const since = lastTimestampRef.current;
      const msgs = await fetchMessages(token, conversation.id, since);
      if (msgs.length === 0) return;
      const decrypted = await decryptBatch(msgs, cryptoCtx);
      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        const merged = [...prev];
        for (const m of decrypted) {
          if (!ids.has(m.id)) merged.push(m);
        }
        return merged.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
      lastTimestampRef.current = msgs[msgs.length - 1].created_at;
    } catch {
      /* non-fatal */
    }
  }, [token, conversation.id, cryptoCtx, decryptBatch]);

  const pollTyping = useCallback(async () => {
    try {
      const rows = await fetchTyping(token, conversation.id);
      const names = rows
        .filter((r) => r.username !== user.username)
        .map((r) => r.full_name || r.username);
      setTypingNames(names);
    } catch {
      setTypingNames([]);
    }
  }, [token, conversation.id, user.username]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    pollRef.current = setInterval(pollNew, 3000);
    typingPollRef.current = setInterval(pollTyping, 2000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (typingPollRef.current) clearInterval(typingPollRef.current);
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    };
  }, [pollNew, pollTyping]);

  const onInputChange = (text: string) => {
    setInput(text);
    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    if (!text.trim()) return;
    typingDebounceRef.current = setTimeout(() => {
      sendTyping(token, conversation.id).catch(() => {});
    }, 400);
  };

  const typingLabel =
    typingNames.length === 0
      ? null
      : typingNames.length === 1
        ? `${typingNames[0]} is typing…`
        : `${typingNames.slice(0, 2).join(', ')} are typing…`;

  const submitText = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    await sendPayload(textPayload(text));
  };

  const uploadAndSend = async (uri: string, name: string, mime: string, kind: 'image' | 'file') => {
    try {
      const att = await uploadAttachment(token, uri, name, mime);
      if (kind === 'image') {
        await sendPayload({
          v: 1,
          kind: 'image',
          path: att.path,
          url: att.url,
          mime: att.mime,
          name: att.name,
          caption: input.trim() || undefined,
        });
        setInput('');
      } else {
        await sendPayload({
          v: 1,
          kind: 'file',
          path: att.path,
          url: att.url,
          name: att.name,
          mime: att.mime,
          size: att.size,
        });
      }
    } catch (e) {
      Alert.alert(
        'Upload failed',
        e instanceof Error ? e.message : 'Server storage may not be configured yet'
      );
    }
  };

  useEffect(() => {
    return callManagerRef.current.subscribe(setCallMedia);
  }, []);

  useEffect(() => {
    if (callMedia.remoteStreamURL) {
      stopCallSounds();
      setCallConnectionState('connected');
    }
  }, [callMedia.remoteStreamURL]);

  useEffect(() => {
    callManagerRef.current.onConnected = () => {
      stopCallSounds();
      setCallConnectionState('connected');
    };
    callManagerRef.current.onFailed = (message) => {
      stopCallSounds();
      if (callMode !== null) {
        Alert.alert('Call ended', message);
        closeCall();
      }
    };
    callManagerRef.current.onUnanswered = () => {
      stopCallSounds();
      setCallConnectionState('unavailable');
      Alert.alert('TauTalk', TAUTALK_UNAVAILABLE_MESSAGE);
      setTimeout(() => {
        void closeCall();
      }, 1500);
    };
  }, [callMode]);

  const beginCallMedia = async (
    session: NonNullable<Awaited<ReturnType<typeof startCall>>>,
    mode: CallMode,
    incoming: boolean
  ) => {
    if (!WEBRTC_MEDIA_ENABLED) {
      setCallConnectionState('preview');
      return;
    }
    setCallConnectionState(incoming ? 'connecting' : 'ringing');
    if (!incoming) startOutgoingRingback();
    const ok = incoming
      ? await callManagerRef.current.startIncoming(token, session, mode)
      : await callManagerRef.current.startOutgoing(token, session, mode);
    if (!ok) {
      stopCallSounds();
      setCallConnectionState('preview');
    } else if (!incoming) {
      setCallConnectionState('ringing');
    }
  };

  const openCall = async (mode: CallMode) => {
    setCallMode(mode);
    setCallConnectionState('ringing');
    startOutgoingRingback();
    const session = await startCall(token, conversation.id, mode);
    if (!session) {
      stopCallSounds();
      setCallConnectionState('preview');
      setCallMode(null);
      return;
    }
    await beginCallMedia(session, mode, false);
  };

  const closeCall = async () => {
    stopCallSounds();
    await callManagerRef.current.hangup();
    setCallMode(null);
    setCallConnectionState('preview');
  };

  const onLivePhotoCaptured = async (uri: string) => {
    try {
      const att = await uploadAttachment(
        token,
        uri,
        `live-photo-${Date.now()}.jpg`,
        'image/jpeg'
      );
      await sendPayload({
        v: 1,
        kind: 'image',
        path: att.path,
        url: att.url,
        mime: att.mime,
        name: att.name,
        caption: '📸 Live photo during call',
      });
    } catch (e) {
      Alert.alert(
        'Live photo',
        e instanceof Error ? e.message : 'Could not save photo to chat'
      );
    }
  };

  useEffect(() => {
    if (!incomingCall) return;
    let cancelled = false;
    (async () => {
      setCallMode(incomingCall.mode);
      await beginCallMedia(incomingCall, incomingCall.mode, true);
      if (!cancelled) {
        onIncomingHandled?.();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [incomingCall]);

  const startVoiceNote = async () => {
    try {
      await startVoiceRecording();
      setVoiceRecording(true);
    } catch (e) {
      Alert.alert(
        'Voice note',
        e instanceof Error ? e.message : 'Microphone recording is unavailable. Rebuild the app after npm install.'
      );
    }
  };

  const stopVoiceNote = async () => {
    if (!voiceRecording) return;
    setVoiceRecording(false);
    setSheetOpen(false);
    try {
      const path = await stopVoiceRecording();
      const uri = path.startsWith('file://') ? path : `file://${path}`;
      const mime = Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mp4';
      await uploadAndSend(uri, `voice-${Date.now()}.${Platform.OS === 'ios' ? 'm4a' : 'mp4'}`, mime, 'file');
    } catch (e) {
      Alert.alert('Voice note', e instanceof Error ? e.message : 'Could not save voice note');
    }
  };

  const onContactLabelUpdated = (contactUserId: string, label: string | null) => {
    const next = withContactLabel(conversation, contactUserId, label);
    setConversation(next);
    onConversationUpdate?.(next);
  };

  const onAttachment = async (action: AttachmentAction) => {
    if (action === 'camera') {
      launchCamera({ mediaType: 'photo', quality: 0.85 }, async (res) => {
        const asset = res.assets?.[0];
        if (asset?.uri) {
          await uploadAndSend(asset.uri, asset.fileName || 'photo.jpg', asset.type || 'image/jpeg', 'image');
        }
      });
      return;
    }
    if (action === 'gallery') {
      launchImageLibrary({ mediaType: 'photo', quality: 0.85 }, async (res) => {
        const asset = res.assets?.[0];
        if (asset?.uri) {
          await uploadAndSend(asset.uri, asset.fileName || 'photo.jpg', asset.type || 'image/jpeg', 'image');
        }
      });
      return;
    }
    if (action === 'document') {
      try {
        const doc = await DocumentPicker.pickSingle({ copyTo: 'cachesDirectory' });
        const uri = doc.fileCopyUri || doc.uri;
        await uploadAndSend(uri, doc.name ?? 'file', doc.type ?? 'application/octet-stream', 'file');
      } catch (e) {
        if (!DocumentPicker.isCancel(e)) {
          Alert.alert('Document picker error', String(e));
        }
      }
      return;
    }
    if (action === 'location') {
      Geolocation.getCurrentPosition(
        (pos) => {
          sendPayload({
            v: 1,
            kind: 'location',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            label: 'My location',
          });
        },
        () => Alert.alert('Location', 'Could not get your location. Check permissions in Settings.'),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
      <StatusBar barStyle="light-content" backgroundColor={colors.whatsappHeader} />

      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
          <MIcon name="arrow-back" size={24} color={colors.goldLight} />
        </Pressable>
        <Pressable
          style={styles.headerProfile}
          onPress={() => isDirect && peerId && setShowContact(true)}
          disabled={!isDirect || !peerId}>
          <Avatar name={peerName} size={40} gold imageUrl={peerAvatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {peerName}
            </Text>
            {typingLabel ? (
              <Text style={styles.typingSub} numberOfLines={1}>
                {typingLabel}
              </Text>
            ) : peerHandle ? (
              <Text style={styles.headerSub} numberOfLines={1}>
                {peerReal !== peerName ? `${peerReal} · ` : ''}
                {peerHandle} · encrypted
              </Text>
            ) : (
              <Text style={styles.headerSub}>End-to-end encrypted</Text>
            )}
          </View>
        </Pressable>
        <Pressable
          style={styles.headerAction}
          onPress={() => openCall('voice')}
          hitSlop={8}>
          <MIcon name="call" size={22} color={colors.goldLight} />
        </Pressable>
        <Pressable
          style={styles.headerAction}
          onPress={() => openCall('video')}
          hitSlop={8}>
          <MIcon name="videocam" size={22} color={colors.goldLight} />
        </Pressable>
      </View>

      <View style={styles.wallpaper}>
        {cryptoError ? <Text style={styles.error}>{cryptoError}</Text> : null}
        {loading ? (
          <ActivityIndicator color={colors.goldLight} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            renderItem={({ item }) => {
              const isMe =
                String(item.sender_id) === String(user.id) ||
                item.sender_username === user.username;
              const time = new Date(item.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const showSender = conversation.type === 'group' && !isMe;
              return item.payload ? (
                <MessageBubble
                  payload={item.payload}
                  isMe={isMe}
                  token={token}
                  time={time}
                  replyQuote={replyQuoteFor(item)}
                  senderName={showSender ? item.sender_username : undefined}
                  onImagePress={(uri) => setViewerUri(uri)}
                  onLongPress={() => setActionMessageId(item.id)}
                />
              ) : (
                <View style={[styles.row, isMe ? styles.rowMe : styles.rowOther]}>
                  <View style={styles.decrypting}>
                    <Text style={styles.decryptingText}>Decrypting…</Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>

      <View style={styles.composer}>
        {replyTarget ? <ReplyBar quote={replyTarget} onClear={() => setReplyTarget(null)} /> : null}
        <View style={styles.composerRow}>
          <Pressable style={styles.attachBtn} onPress={() => setSheetOpen(true)}>
            <MIcon name="add" size={26} color={colors.goldLight} />
          </Pressable>
          <Pressable style={styles.attachBtn} onPress={() => setShowEmoji(true)}>
            <MIcon name="insert-emoticon" size={24} color={colors.goldLight} />
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Message"
            placeholderTextColor={colors.textSoft}
            value={input}
            onChangeText={onInputChange}
            multiline
          />
          <Pressable
            style={[styles.send, (!input.trim() || sending) && styles.sendDisabled]}
            onPress={submitText}
            disabled={sending || !input.trim()}>
            {sending ? (
              <ActivityIndicator color="#1a1200" size="small" />
            ) : (
              <MIcon name="send" size={22} color="#1a1200" />
            )}
          </Pressable>
        </View>
      </View>

      <EmojiPicker
        visible={showEmoji}
        onClose={() => setShowEmoji(false)}
        onPick={(emoji) => setInput((prev) => prev + emoji)}
      />

      <MessageActionSheet
        visible={actionMessageId !== null}
        onReply={() => {
          if (actionMessageId) startReplyToMessage(actionMessageId);
        }}
        onClose={() => setActionMessageId(null)}
      />

      <ContactLabelModal
        visible={showContact}
        token={token}
        contactUserId={peerId}
        realName={peerReal}
        username={conversation.peer?.username ?? null}
        avatarUrl={peerAvatar}
        onClose={() => setShowContact(false)}
        onUpdated={onContactLabelUpdated}
      />

      <AttachmentSheet
        visible={sheetOpen}
        onClose={() => {
          if (voiceRecording) void stopVoiceNote();
          setSheetOpen(false);
        }}
        onPick={onAttachment}
        onCallPreview={(mode) => openCall(mode)}
        recording={voiceRecording}
        onStartVoice={startVoiceNote}
        onStopVoice={stopVoiceNote}
      />

      <ImageViewerModal
        visible={viewerUri !== null}
        uri={viewerUri}
        onClose={() => setViewerUri(null)}
      />

      <CallPreviewScreen
        visible={callMode !== null}
        mode={callMode ?? 'voice'}
        peerName={peerName}
        peerAvatar={peerAvatar}
        connectionState={callConnectionState}
        localStreamURL={callMedia.localStreamURL}
        remoteStreamURL={callMedia.remoteStreamURL}
        muted={callMedia.muted}
        cameraOff={callMedia.cameraOff}
        onClose={closeCall}
        onToggleMute={() => callManagerRef.current.toggleMute()}
        onToggleCamera={() => callManagerRef.current.toggleCamera()}
        onFlipCamera={() => callManagerRef.current.flipCamera()}
        onLivePhotoCaptured={callMode === 'video' ? onLivePhotoCaptured : undefined}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.chatBg },
  header: {
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.whatsappHeader,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: { paddingHorizontal: 4, paddingVertical: 4 },
  headerProfile: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0 },
  headerInfo: { flex: 1, minWidth: 0 },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.goldDim,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  headerTitle: { color: colors.text, fontWeight: '700', fontSize: 17 },
  headerSub: { color: colors.gold, fontSize: 12, marginTop: 2 },
  typingSub: { color: colors.goldLight, fontSize: 12, marginTop: 2, fontStyle: 'italic' },
  wallpaper: { flex: 1, backgroundColor: colors.chatBg },
  messageList: { padding: 12, paddingBottom: 8 },
  composer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: colors.whatsappHeader,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  composerRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.goldDim,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 120,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  send: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.45 },
  error: {
    color: colors.danger,
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
  },
  row: { marginVertical: 4 },
  rowMe: { alignItems: 'flex-end' },
  rowOther: { alignItems: 'flex-start' },
  decrypting: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
  },
  decryptingText: { color: colors.textMuted, fontSize: 14 },
});
