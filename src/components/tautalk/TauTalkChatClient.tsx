'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  encryptMessage,
  decryptMessage,
  registerIdentityKey,
  type ConversationCryptoContext,
} from '@/lib/tautalk-crypto';
import { useTauSession } from '@/hooks/useTauSession';
import { connectTauTalkSse, isTauNativeClient } from '@/lib/tautalk-sse';
import {
  displayNameForConversation,
  usernameLabel,
  peerAvatar,
  peerRealName,
  peerUserId,
  withContactLabel,
  normalizeConversations,
  type TalkConversation,
} from '@/lib/tautalk-conversation-utils';
import {
  buildCryptoContext,
  fetchConversationKeys,
  fetchIncomingCalls,
  fetchCallSession,
  fetchTyping,
  sendTyping,
  startCall,
  declineCall,
  uploadAttachment,
  type TalkProfile,
  type IncomingCall,
} from '@/lib/tautalk-web-api';
import { ensureCallNotificationPermission, notifyIncomingCall } from '@/lib/tautalk-call-notify';
import {
  contentTypeForPayload,
  parsePayload,
  payloadPreview,
  textPayload,
  type MessagePayload,
} from '@/lib/tautalk-message-payload';
import TauTalkMessageBubble from '@/components/tautalk/TauTalkMessageBubble';
import TauTalkAttachSheet from '@/components/tautalk/TauTalkAttachSheet';
import TauTalkEmojiPicker from '@/components/tautalk/TauTalkEmojiPicker';
import TauTalkMessageContextMenu, {
  TauTalkReplyBar,
  type MessageContextMenuState,
  type ReplyQuote,
} from '@/components/tautalk/TauTalkMessageContextMenu';
import { TAUTALK_UNAVAILABLE_MESSAGE } from '@/lib/tautalk-call-constants';
import { startIncomingRing, startOutgoingRingback, stopCallSounds } from '@/lib/tautalk-call-sounds';
import { WebCallManager, type WebCallMediaState } from '@/lib/tautalk-web-call';
import TauTalkAvatar from '@/components/tautalk/TauTalkAvatar';
import TauTalkProfileModal from '@/components/tautalk/TauTalkProfileModal';
import TauTalkContactModal from '@/components/tautalk/TauTalkContactModal';
import TauTalkCallOverlay from '@/components/tautalk/TauTalkCallOverlay';
import TauTalkIncomingCall from '@/components/tautalk/TauTalkIncomingCall';
import { tauTalkAssets } from '@/lib/tautalk-ui/assets';
import Image from 'next/image';
import {
  Send,
  Plus,
  Paperclip,
  Search,
  Shield,
  LogOut,
  Users,
  Lock,
  ArrowLeft,
  Phone,
  Video,
  User,
} from 'lucide-react';

function headers(token: string | null) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
};

const emptyCallMedia: WebCallMediaState = {
  localStream: null,
  remoteStream: null,
  muted: false,
  cameraOff: false,
  connectionState: 'idle',
};

export default function TauTalkChatClient() {
  const { user, token, ready, logout } = useTauSession({
    requireAuth: true,
    loginPath: '/tautalk/login?redirect=/tautalk/chat',
  });

  const [profile, setProfile] = useState<TalkProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [conversations, setConversations] = useState<TalkConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [decrypted, setDecrypted] = useState<Record<string, MessagePayload>>({});
  const [showAttach, setShowAttach] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [cryptoCtx, setCryptoCtx] = useState<ConversationCryptoContext | null>(null);
  const [cryptoReady, setCryptoReady] = useState(false);
  const [cryptoError, setCryptoError] = useState('');
  const [participants, setParticipants] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sendError, setSendError] = useState('');
  const [sending, setSending] = useState(false);
  const [newChatQuery, setNewChatQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [callOpen, setCallOpen] = useState(false);
  const [callMode, setCallMode] = useState<'voice' | 'video'>('voice');
  const [callError, setCallError] = useState('');
  const [callMedia, setCallMedia] = useState<WebCallMediaState>(emptyCallMedia);
  const [typingNames, setTypingNames] = useState<string[]>([]);
  const [replyTarget, setReplyTarget] = useState<ReplyQuote | null>(null);
  const [contextMenu, setContextMenu] = useState<MessageContextMenuState | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const eventSourceRef = useRef<(() => void) | null>(null);
  const callManagerRef = useRef<WebCallManager | null>(null);
  const cryptoCtxRef = useRef<ConversationCryptoContext | null>(null);
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [callPeerName, setCallPeerName] = useState('');
  const lastNotifiedCallRef = useRef<string | null>(null);
  const isOutgoingCallRef = useRef(false);
  const unavailableTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const identityRegisteredRef = useRef(false);
  const loadConvTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeConvTypeRef = useRef<'direct' | 'group'>('direct');
  const preparedConvIdRef = useRef<string | null>(null);
  const [decryptFailed, setDecryptFailed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    cryptoCtxRef.current = cryptoCtx;
  }, [cryptoCtx]);

  useEffect(() => {
    const mgr = new WebCallManager();
    callManagerRef.current = mgr;
    const unsub = mgr.subscribe(setCallMedia);
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!token) return;
    import('@/lib/tautalk-web-api').then(({ fetchProfile }) =>
      fetchProfile(token).then(setProfile).catch(() => {})
    );
  }, [token]);

  const loadConversations = useCallback(async () => {
    if (!token) return;
    const res = await fetch('/api/tautalk/conversations', { headers: headers(token) });
    if (res.ok) {
      const data = await res.json();
      setConversations(normalizeConversations(data.conversations ?? []));
    }
  }, [token]);

  const scheduleLoadConversations = useCallback(() => {
    if (loadConvTimerRef.current) clearTimeout(loadConvTimerRef.current);
    loadConvTimerRef.current = setTimeout(() => {
      void loadConversations();
    }, 350);
  }, [loadConversations]);

  const onContactLabelUpdated = useCallback((contactUserId: string, label: string | null) => {
    setConversations((prev) =>
      prev.map((c) => withContactLabel(c, contactUserId, label))
    );
  }, []);

  const replyQuoteFor = useCallback(
    (message: { reply_to?: string | null }): ReplyQuote | null => {
      if (!message.reply_to) return null;
      const parent = messages.find((x) => x.id === message.reply_to);
      if (!parent) {
        return {
          id: message.reply_to,
          senderUsername: 'Unknown',
          preview: 'Original message',
        };
      }
      const parentPayload = decrypted[parent.id];
      const isParentMe =
        String(parent.sender_id) === String(user?.id) ||
        parent.sender_username === user?.username;
      return {
        id: parent.id,
        senderUsername: isParentMe ? 'You' : parent.sender_username || 'Contact',
        preview: parentPayload ? payloadPreview(parentPayload) : '…',
      };
    },
    [messages, decrypted, user?.id, user?.username]
  );

  const startReplyToMessage = useCallback(
    (messageId: string) => {
      const m = messages.find((x) => x.id === messageId);
      if (!m) return;
      const payload = decrypted[m.id];
      if (!payload) return;
      const isMe =
        String(m.sender_id) === String(user?.id) || m.sender_username === user?.username;
      setReplyTarget({
        id: m.id,
        senderUsername: isMe ? 'You' : m.sender_username || 'Contact',
        preview: payloadPreview(payload),
      });
      setShowEmojiPicker(false);
      inputRef.current?.focus();
    },
    [messages, decrypted, user?.id, user?.username]
  );

  const insertEmoji = useCallback((emoji: string) => {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  }, []);

  const decryptAll = useCallback(
    async (msgs: any[], conversationId: string, ctx: ConversationCryptoContext | null) => {
      if (!ctx) return;
      const dec: Record<string, MessagePayload> = {};
      const failed: Record<string, boolean> = {};
      for (const m of msgs) {
        let success = false;
        for (let attempt = 0; attempt < 6; attempt++) {
          const plain = await decryptMessage(conversationId, m.content_encrypted, ctx);
          if (plain !== null) {
            dec[m.id] = parsePayload(plain);
            success = true;
            break;
          }
          if (attempt < 5) {
            await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
          }
        }
        if (!success) failed[m.id] = true;
      }
      setDecrypted((prev) => ({ ...prev, ...dec }));
      setDecryptFailed((prev) => {
        const next = { ...prev };
        for (const id of Object.keys(dec)) delete next[id];
        return { ...next, ...failed };
      });
    },
    []
  );

  const decryptOne = useCallback(
    async (conversationId: string, messageId: string, contentEncrypted: string) => {
      const ctx = cryptoCtxRef.current;
      if (!ctx) return;
      for (let attempt = 0; attempt < 6; attempt++) {
        const plain = await decryptMessage(conversationId, contentEncrypted, ctx);
        if (plain !== null) {
          const payload = parsePayload(plain);
          setDecrypted((prev) => ({ ...prev, [messageId]: payload }));
          setDecryptFailed((prev) => {
            const next = { ...prev };
            delete next[messageId];
            return next;
          });
          return;
        }
        if (attempt < 5) {
          await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
        }
      }
      setDecryptFailed((prev) => ({ ...prev, [messageId]: true }));
    },
    []
  );

  const prepareConversation = useCallback(
    async (conversationId: string, convType: string) => {
      if (!token) return null;
      const switching = preparedConvIdRef.current !== conversationId;
      if (switching) {
        setCryptoReady(false);
        setCryptoError('');
      }
      try {
        if (!identityRegisteredRef.current) {
          await registerIdentityKey(token);
          identityRegisteredRef.current = true;
        }
        const parts = await fetchConversationKeys(token, conversationId);
        setParticipants(parts);
        const ctx = await buildCryptoContext(conversationId, convType, parts, token);
        if (convType !== 'group' && parts.some((p) => !p.publicKey && !(p.publicKeys?.length))) {
          setCryptoError('Contact encryption keys are still syncing. Messages may take a moment.');
        } else {
          setCryptoError('');
        }
        setCryptoCtx(ctx);
        cryptoCtxRef.current = ctx;
        setCryptoReady(true);
        preparedConvIdRef.current = conversationId;
        return ctx;
      } catch (e) {
        setCryptoError(e instanceof Error ? e.message : 'Encryption setup failed');
        setCryptoReady(false);
        return null;
      }
    },
    [token]
  );

  const loadMessages = useCallback(
    async (conversationId: string, ctx: ConversationCryptoContext | null) => {
      if (!token) return;
      const res = await fetch(
        `/api/tautalk/messages?conversationId=${conversationId}`,
        { headers: headers(token) }
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
        await decryptAll(data.messages ?? [], conversationId, ctx);
      }
    },
    [token, decryptAll]
  );

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      setLoading(false);
      return;
    }
    registerIdentityKey(token)
      .then(() => {
        identityRegisteredRef.current = true;
        return loadConversations();
      })
      .finally(() => setLoading(false));
  }, [ready, token, loadConversations]);

  // Poll incoming calls (1s for fast ring)
  useEffect(() => {
    if (!token) return;
    void ensureCallNotificationPermission();
    const poll = async () => {
      try {
        const incoming = await fetchIncomingCalls(token);
        if (incoming.length > 0 && !callOpen && !isOutgoingCallRef.current) {
          const call = incoming[0];
          setIncomingCall(call);
          if (lastNotifiedCallRef.current !== call.id) {
            lastNotifiedCallRef.current = call.id;
            notifyIncomingCall(call);
          }
        } else if (incoming.length === 0) {
          lastNotifiedCallRef.current = null;
          setIncomingCall((prev) => {
            if (prev && !callOpen) stopCallSounds();
            return null;
          });
        }
      } catch {
        /* ignore */
      }
    };
    poll();
    const id = setInterval(poll, 2500);
    return () => clearInterval(id);
  }, [token, callOpen]);

  useEffect(() => {
    if (incomingCall && !callOpen) {
      startIncomingRing();
      return () => stopCallSounds();
    }
    return undefined;
  }, [incomingCall, callOpen]);

  useEffect(() => {
    if (
      callOpen &&
      isOutgoingCallRef.current &&
      callMedia.connectionState !== 'connected' &&
      callMedia.connectionState !== 'unavailable' &&
      !callMedia.remoteStream
    ) {
      startOutgoingRingback();
      return () => stopCallSounds();
    }
    if (callMedia.connectionState === 'connected' || callMedia.remoteStream) {
      stopCallSounds();
    }
    return undefined;
  }, [callOpen, callMedia.connectionState, callMedia.remoteStream]);

  useEffect(() => {
    return () => {
      stopCallSounds();
      if (unavailableTimerRef.current) clearTimeout(unavailableTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!activeId || !ready) return;
    if (isTauNativeClient && !token) return;
    let cancelled = false;
    const convType = activeConvTypeRef.current;

    (async () => {
      const ctx = await prepareConversation(activeId, convType);
      if (cancelled || !ctx) return;
      await loadMessages(activeId, ctx);
    })();

    eventSourceRef.current?.();
    eventSourceRef.current = connectTauTalkSse(activeId, token, {
      onMessage: async (m) => {
        try {
          const msg = m as { id: string; content_encrypted: string };
          setMessages((prev) => {
            if (prev.some((x) => x.id === msg.id)) return prev;
            return [...prev, msg];
          });
          setDecryptFailed((prev) => {
            const next = { ...prev };
            delete next[msg.id];
            return next;
          });
          const tryDecrypt = () => decryptOne(activeId, msg.id, msg.content_encrypted);
          if (cryptoCtxRef.current) {
            await tryDecrypt();
          } else {
            const waitId = window.setInterval(() => {
              if (cryptoCtxRef.current) {
                window.clearInterval(waitId);
                void tryDecrypt();
              }
            }, 200);
            window.setTimeout(() => window.clearInterval(waitId), 10000);
          }
        } catch {
          /* ignore */
        }
      },
    });

    return () => {
      cancelled = true;
      eventSourceRef.current?.();
      eventSourceRef.current = null;
    };
  }, [activeId, ready, token, prepareConversation, loadMessages, decryptOne]);

  // Retry decrypt for messages still pending
  useEffect(() => {
    if (!activeId || !cryptoCtx) return;

    const id = window.setInterval(() => {
      const pending = messages.filter((m) => !decrypted[m.id] && !decryptFailed[m.id]);
      for (const m of pending) {
        void decryptOne(activeId, m.id, m.content_encrypted);
      }
    }, 3000);
    return () => window.clearInterval(id);
  }, [activeId, cryptoCtx, messages, decrypted, decryptFailed, decryptOne]);

  useEffect(() => {
    if (!activeId || !token) {
      setTypingNames([]);
      return;
    }
    const poll = () => {
      fetchTyping(token, activeId)
        .then((rows) => {
          const names = rows
            .filter((r) => r.username !== user?.username)
            .map((r) => r.full_name || r.username);
          setTypingNames(names);
        })
        .catch(() => setTypingNames([]));
    };
    poll();
    const id = setInterval(poll, 2000);
    return () => clearInterval(id);
  }, [activeId, token, user?.username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectConversation = async (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    activeConvTypeRef.current = conv?.type ?? 'direct';
    preparedConvIdRef.current = null;
    setActiveId(id);
    setMobileShowChat(true);
    setSendError('');
    setDecrypted({});
    setDecryptFailed({});
    setMessages([]);
    setCryptoCtx(null);
    cryptoCtxRef.current = null;
    setCryptoReady(false);
    setCryptoError('');
    setReplyTarget(null);
    setContextMenu(null);
    setShowEmojiPicker(false);
  };

  const openProfile = () => setShowProfile(true);

  const sendPayload = async (payload: MessagePayload) => {
    if (!activeId || !token || !cryptoCtxRef.current) {
      setSendError('Securing connection… try again in a moment.');
      return;
    }

    setSending(true);
    setSendError('');
    const replyToId = replyTarget?.id;
    try {
      const json = JSON.stringify(payload);
      const encrypted = await encryptMessage(activeId, json, cryptoCtxRef.current);
      const res = await fetch('/api/tautalk/messages', {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify({
          conversationId: activeId,
          contentEncrypted: encrypted,
          contentType: contentTypeForPayload(payload),
          replyTo: replyToId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Send failed');

      const saved = data.message;
      setMessages((prev) => {
        if (prev.some((x) => x.id === saved.id)) return prev;
        return [...prev, { ...saved, sender_username: user?.username }];
      });
      setDecrypted((prev) => ({ ...prev, [saved.id]: payload }));
      setReplyTarget(null);
      scheduleLoadConversations();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    await sendPayload(textPayload(text));
  };

  const uploadAndSend = async (file: File, kind: 'image' | 'file') => {
    if (!token) return;
    try {
      setSending(true);
      const att = await uploadAttachment(token, file);
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
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setSending(false);
      setShowAttach(false);
    }
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setSendError('Location is not supported in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void sendPayload({
          v: 1,
          kind: 'location',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'My location',
        });
        setShowAttach(false);
      },
      () => setSendError('Could not get your location. Allow location access and try again.'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const startVoiceNote = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setSendError('Voice notes need microphone access.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceChunksRef.current = [];
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) voiceChunksRef.current.push(ev.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(voiceChunksRef.current, { type: mime });
        if (blob.size < 800) {
          setSendError('Recording too short.');
          return;
        }
        const ext = mime.includes('webm') ? 'webm' : 'm4a';
        const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: mime });
        await uploadAndSend(file, 'file');
      };
      recorder.start();
      setVoiceRecording(true);
    } catch {
      setSendError('Microphone permission is required for voice notes.');
    }
  };

  const stopVoiceNote = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    mediaRecorderRef.current = null;
    setVoiceRecording(false);
  };

  const onPhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) void uploadAndSend(file, 'image');
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) void uploadAndSend(file, 'file');
  };

  const beginCall = async (mode: 'voice' | 'video') => {
    if (!token || !activeId) return;
    const mgr = callManagerRef.current;
    if (!mgr) return;

    void ensureCallNotificationPermission();
    setCallError('');
    setCallMode(mode);
    setCallPeerName(activePeerName);
    isOutgoingCallRef.current = true;
    setIncomingCall(null);
    setCallOpen(true);
    startOutgoingRingback();

    mgr.onFailed = (msg) => {
      stopCallSounds();
      setCallError(msg);
      setCallOpen(false);
      setSendError(msg);
      isOutgoingCallRef.current = false;
    };
    mgr.onConnected = () => {
      setCallError('');
      stopCallSounds();
    };
    mgr.onUnanswered = () => {
      stopCallSounds();
      isOutgoingCallRef.current = false;
      setCallError(TAUTALK_UNAVAILABLE_MESSAGE);
      if (unavailableTimerRef.current) clearTimeout(unavailableTimerRef.current);
      unavailableTimerRef.current = setTimeout(() => {
        setCallOpen(false);
        setCallError('');
        setSendError(TAUTALK_UNAVAILABLE_MESSAGE);
      }, 1800);
    };

    try {
      const session = await startCall(token, activeId, mode);
      const ok = await mgr.startOutgoing(token, session, mode);
      if (!ok) {
        stopCallSounds();
        setCallOpen(false);
        isOutgoingCallRef.current = false;
      }
    } catch (err) {
      stopCallSounds();
      const msg = err instanceof Error ? err.message : 'Could not start call';
      setCallError(msg);
      setCallOpen(false);
      setSendError(msg);
      isOutgoingCallRef.current = false;
    }
  };

  const acceptIncoming = async () => {
    const call = incomingCall;
    if (!token || !call) return;
    const mgr = callManagerRef.current;
    if (!mgr) return;

    stopCallSounds();
    setIncomingCall(null);
    lastNotifiedCallRef.current = null;

    try {
      const session = await fetchCallSession(token, call.id);
      if (session.status !== 'ringing') {
        setSendError('This call has already ended.');
        return;
      }
    } catch {
      setSendError('Could not verify call. Try again.');
      return;
    }

    const callerName = call.caller?.full_name || call.caller?.username || 'Contact';
    setCallPeerName(callerName);
    setCallError('');
    setCallMode(call.mode);
    isOutgoingCallRef.current = false;

    if (call.conversation_id) {
      setActiveId(call.conversation_id);
      setMobileShowChat(true);
    }

    setCallOpen(true);

    mgr.onFailed = (msg) => {
      stopCallSounds();
      setCallError(msg);
      setCallOpen(false);
      setCallPeerName('');
    };
    mgr.onConnected = () => {
      setCallError('');
      stopCallSounds();
    };
    mgr.onUnanswered = null;

    try {
      const ok = await mgr.startIncoming(token, call, call.mode);
      if (!ok) {
        setCallOpen(false);
        setCallPeerName('');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not join call';
      setCallError(msg);
      setCallOpen(false);
      setCallPeerName('');
      setSendError(msg);
    }
  };

  const declineIncoming = async () => {
    if (!incomingCall || !token) return;
    stopCallSounds();
    lastNotifiedCallRef.current = null;
    await declineCall(token, incomingCall.id).catch(() => {});
    setIncomingCall(null);
  };

  const hangupCall = async () => {
    stopCallSounds();
    isOutgoingCallRef.current = false;
    lastNotifiedCallRef.current = null;
    if (unavailableTimerRef.current) {
      clearTimeout(unavailableTimerRef.current);
      unavailableTimerRef.current = null;
    }
    await callManagerRef.current?.hangup();
    setCallOpen(false);
    setCallError('');
    setCallPeerName('');
    setCallMedia(emptyCallMedia);
  };

  const startChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatQuery.trim() || !token) return;
    const res = await fetch('/api/tautalk/conversations', {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ query: newChatQuery.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setShowNewChat(false);
      setNewChatQuery('');
      await loadConversations();
      selectConversation(data.conversation.id);
    } else {
      alert(data.error || 'Could not start chat');
    }
  };

  const startGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupTitle.trim() || !groupMembers.trim() || !token) return;
    const memberQueries = groupMembers.split(',').map((s) => s.trim()).filter(Boolean);
    const memberIds: string[] = [];
    for (const q of memberQueries) {
      const res = await fetch(`/api/tautalk/identity?q=${encodeURIComponent(q)}`, {
        headers: headers(token),
      });
      if (res.ok) {
        const data = await res.json();
        memberIds.push(String(data.user.id));
      }
    }
    if (memberIds.length === 0) {
      alert('Add at least one valid member email or username');
      return;
    }
    const res = await fetch('/api/tautalk/conversations', {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ type: 'group', title: groupTitle.trim(), memberIds }),
    });
    const data = await res.json();
    if (res.ok) {
      setShowNewGroup(false);
      setGroupTitle('');
      setGroupMembers('');
      await loadConversations();
      selectConversation(data.conversation.id);
    } else {
      alert(data.error || 'Could not create group');
    }
  };

  if (!ready || loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center text-[#9ca3af]">
        Loading Tau Talk...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center text-[#9ca3af]">
        Redirecting to sign in…
      </div>
    );
  }

  const activeConv = conversations.find((c) => c.id === activeId);
  const activePeerName = activeConv ? displayNameForConversation(activeConv, user?.id) : '';
  const activePeerHandle = activeConv ? usernameLabel(activeConv) : null;
  const activePeerId = activeConv ? peerUserId(activeConv) : null;
  const activePeerRealName = activeConv ? peerRealName(activeConv) : '';

  const myName = profile?.fullName || user?.fullName || user?.username || user?.email || 'You';
  const myAvatar = profile?.avatarUrl ?? null;
  const typingLabel =
    typingNames.length === 0
      ? null
      : typingNames.length === 1
        ? `${typingNames[0]} is typing…`
        : `${typingNames.slice(0, 2).join(', ')} are typing…`;

  return (
    <div className="h-screen flex flex-col bg-[#050508] text-[#f5f5f7]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#0b141a]">
        <div className="flex items-center gap-3">
          {mobileShowChat && (
            <button
              onClick={() => setMobileShowChat(false)}
              className="sm:hidden p-1 text-[#9ca3af]"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Image
            src={tauTalkAssets.brand.icon}
            alt="Tau Talk"
            width={32}
            height={32}
            className="rounded-lg shrink-0"
          />
          <div>
            <h1 className="font-bold">Tau Talk</h1>
            <p className="text-xs text-[#D4AF37] flex items-center gap-1">
              <Lock className="w-3 h-3" /> E2EE Secured · Web
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-colors border border-transparent hover:border-[rgba(212,175,55,0.25)]"
            aria-label="Open your profile"
          >
            <TauTalkAvatar name={myName} imageUrl={myAvatar} size={36} />
            <span className="text-sm font-medium text-[#f5f5f7] max-w-[120px] sm:max-w-[140px] truncate">
              {myName}
            </span>
            <User className="w-4 h-4 text-[#D4AF37] shrink-0" />
          </button>
          <button
            onClick={() => logout('/tautalk')}
            className="p-2 text-[#9ca3af] hover:text-white"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        <aside
          className={`${
            mobileShowChat ? 'hidden sm:flex' : 'flex'
          } w-full sm:w-80 border-r border-white/[0.08] flex-col shrink-0 bg-[#0c0c12]`}
        >
          <div className="p-3 flex gap-2">
            <button
              onClick={() => setShowNewChat(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-[rgba(212,175,55,0.15)] text-[#D4AF37] rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> New chat
            </button>
            <button
              onClick={() => setShowNewGroup(true)}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-white/[0.06] text-[#9ca3af] rounded-lg text-sm"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-center text-[#6b7280] text-sm p-6">No conversations yet.</p>
            ) : (
              conversations.map((c) => {
                const name = displayNameForConversation(c, user?.id);
                const handle = usernameLabel(c);
                return (
                  <button
                    key={c.id}
                    onClick={() => selectConversation(c.id)}
                    className={`w-full text-left px-4 py-3 border-b border-white/[0.06] hover:bg-white/[0.04] flex gap-3 items-center ${
                      activeId === c.id ? 'bg-white/[0.06]' : ''
                    }`}
                  >
                    <TauTalkAvatar
                      name={name}
                      imageUrl={c.type === 'direct' ? peerAvatar(c) : null}
                      size={44}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-medium truncate">{name}</span>
                        {c.unread_count > 0 && (
                          <span className="text-xs bg-[#D4AF37] text-[#0f0f0f] px-1.5 rounded-full shrink-0">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                      {handle ? (
                        <p className="text-xs text-[#D4AF37]/80 truncate">{handle}</p>
                      ) : null}
                      <p className="text-xs text-[#6b7280] mt-0.5 truncate">
                        {c.last_message_at
                          ? new Date(c.last_message_at).toLocaleString()
                          : 'No messages'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={openProfile}
            className="m-3 mt-auto flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 text-left hover:bg-white/[0.06] hover:border-[rgba(212,175,55,0.25)] transition-colors"
          >
            <TauTalkAvatar name={myName} imageUrl={myAvatar} size={40} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate text-[#f5f5f7]">{myName}</p>
              <p className="text-xs text-[#D4AF37]">Edit profile · photo · username</p>
            </div>
            <User className="w-4 h-4 text-[#D4AF37] shrink-0" />
          </button>
        </aside>

        <main
          className={`${
            !mobileShowChat && !activeId ? 'hidden sm:flex' : 'flex'
          } flex-1 flex-col min-w-0 min-h-0 bg-[#0a1014]`}
        >
          {!activeId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-[#6b7280] gap-4 p-6">
              <Shield className="w-16 h-16 text-[#D4AF37]/30" />
              <p>Select a conversation or start a new chat</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between gap-3 shrink-0 bg-[#0b141a]">
                {activeConv?.type === 'direct' ? (
                  <button
                    type="button"
                    onClick={() => setShowContact(true)}
                    className="flex items-center gap-3 min-w-0 text-left hover:opacity-90 transition-opacity"
                    title="Edit contact name"
                  >
                    <TauTalkAvatar
                      name={activePeerName}
                      imageUrl={peerAvatar(activeConv)}
                      size={40}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{activePeerName}</p>
                      {typingLabel ? (
                        <p className="text-xs text-[#D4AF37] truncate">{typingLabel}</p>
                      ) : activePeerHandle ? (
                        <p className="text-xs text-[#D4AF37]/80 truncate">
                          {activePeerRealName !== activePeerName
                            ? `${activePeerRealName} · E2EE`
                            : 'E2EE Secured Session'}
                        </p>
                      ) : null}
                    </div>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 min-w-0">
                    <TauTalkAvatar
                      name={activePeerName}
                      imageUrl={null}
                      size={40}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{activePeerName}</p>
                      {typingLabel ? (
                        <p className="text-xs text-[#D4AF37] truncate">{typingLabel}</p>
                      ) : (
                        <p className="text-xs text-[#6b7280]">{participants.length} members</p>
                      )}
                    </div>
                  </div>
                )}
                {activeConv?.type === 'direct' ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => beginCall('voice')}
                      className="p-2.5 rounded-full hover:bg-white/[0.06] text-[#D4AF37]"
                      title="Voice call"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => beginCall('video')}
                      className="p-2.5 rounded-full hover:bg-white/[0.06] text-[#D4AF37]"
                      title="Video call"
                    >
                      <Video className="w-5 h-5" />
                    </button>
                  </div>
                ) : null}
              </div>

              {cryptoError ? (
                <p className="text-xs text-red-400 px-4 py-2 bg-red-950/30">{cryptoError}</p>
              ) : null}

              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.map((m) => {
                  const isMe =
                    String(m.sender_id) === String(user?.id) ||
                    m.sender_username === user?.username;
                  const payload = decrypted[m.id];
                  const time = new Date(m.created_at).toLocaleTimeString();
                  return (
                    <div key={m.id}>
                      {!isMe && activeConv?.type === 'group' && (
                        <p className="text-xs text-[#D4AF37] mb-1 px-1">{m.sender_username}</p>
                      )}
                      {payload ? (
                        <TauTalkMessageBubble
                          payload={payload}
                          isMe={isMe}
                          token={token!}
                          time={time}
                          replyQuote={replyQuoteFor(m)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenu({
                              x: e.clientX,
                              y: e.clientY,
                              messageId: m.id,
                            });
                          }}
                        />
                      ) : decryptFailed[m.id] ? (
                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className="px-4 py-2 rounded-2xl text-sm bg-white/[0.06] text-[#6b7280] border border-white/[0.08]">
                            🔒 Unable to decrypt — encryption keys may have changed
                          </div>
                        </div>
                      ) : (
                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className="px-4 py-2 rounded-2xl text-sm bg-white/[0.06] text-[#9ca3af]">
                            Decrypting…
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={onPhotoSelected}
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={onFileSelected}
              />

              <form
                onSubmit={sendMessage}
                className="p-4 border-t border-white/[0.08] flex flex-col gap-2 shrink-0 bg-[#0b141a]"
              >
                {sendError ? <p className="text-xs text-red-400">{sendError}</p> : null}
                {replyTarget ? (
                  <TauTalkReplyBar quote={replyTarget} onClear={() => setReplyTarget(null)} />
                ) : null}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmojiPicker(false);
                      setShowAttach(true);
                    }}
                    disabled={!cryptoReady || sending}
                    className="px-3 py-3 rounded-xl bg-white/[0.06] text-[#D4AF37] disabled:opacity-40"
                    title="Attach photo, file, voice note, or location"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <TauTalkEmojiPicker
                    open={showEmojiPicker}
                    onToggle={() => setShowEmojiPicker((v) => !v)}
                    onPick={insertEmoji}
                    disabled={!cryptoReady || sending}
                  />
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
                      if (!e.target.value.trim() || !activeId || !token) return;
                      typingDebounceRef.current = setTimeout(() => {
                        sendTyping(token, activeId).catch(() => {});
                      }, 400);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (input.trim() && cryptoReady && !sending) {
                          void sendMessage(e as unknown as React.FormEvent);
                        }
                      }
                    }}
                    placeholder={
                      cryptoReady ? 'Type a message · Enter to send' : 'Preparing encryption…'
                    }
                    disabled={!cryptoReady || sending}
                    className="flex-1 px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-white focus:border-[#D4AF37] outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || !cryptoReady || sending}
                    className="px-4 py-3 bg-[#D4AF37] text-[#0f0f0f] rounded-xl disabled:opacity-40 font-medium min-w-[52px]"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </main>
      </div>

      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0c0c12] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" /> New conversation
            </h3>
            <form onSubmit={startChat}>
              <input
                autoFocus
                placeholder="Email or @username"
                value={newChatQuery}
                onChange={(e) => setNewChatQuery(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white mb-4"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowNewChat(false)} className="flex-1 py-2 bg-white/[0.08] rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-[#D4AF37] text-[#0f0f0f] rounded-lg font-semibold">
                  Start
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0c0c12] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" /> New group
            </h3>
            <form onSubmit={startGroup} className="space-y-3">
              <input
                placeholder="Group name"
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
              />
              <input
                placeholder="Members: email1, email2, ..."
                value={groupMembers}
                onChange={(e) => setGroupMembers(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
              />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowNewGroup(false)} className="flex-1 py-2 bg-white/[0.08] rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-[#D4AF37] text-[#0f0f0f] rounded-lg font-semibold">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {incomingCall && !callOpen && !isOutgoingCallRef.current ? (
        <TauTalkIncomingCall
          call={incomingCall}
          onAccept={() => void acceptIncoming()}
          onDecline={() => void declineIncoming()}
        />
      ) : null}

      <TauTalkCallOverlay
        open={callOpen}
        mode={callMode}
        peerName={callPeerName || activePeerName}
        media={callMedia}
        error={callError}
        onToggleMute={() => callManagerRef.current?.toggleMute()}
        onToggleCamera={() => callManagerRef.current?.toggleCamera()}
        onHangup={hangupCall}
      />

      <TauTalkProfileModal
        token={token!}
        open={showProfile}
        onClose={() => setShowProfile(false)}
        onUpdated={(p) => {
          setProfile(p);
          if (user) {
            localStorage.setItem(
              'tauos_user',
              JSON.stringify({
                id: user.id,
                username: p.username,
                email: p.email,
                fullName: p.fullName,
                avatarUrl: p.avatarUrl,
              })
            );
          }
        }}
      />

      <TauTalkContactModal
        token={token!}
        open={showContact}
        contactUserId={activePeerId}
        realName={activePeerRealName}
        username={activePeerHandle?.replace(/^@/, '') ?? null}
        avatarUrl={activeConv?.type === 'direct' ? peerAvatar(activeConv) : null}
        onClose={() => setShowContact(false)}
        onUpdated={onContactLabelUpdated}
      />

      <TauTalkAttachSheet
        open={showAttach}
        recording={voiceRecording}
        onClose={() => {
          if (voiceRecording) stopVoiceNote();
          setShowAttach(false);
        }}
        onPhoto={() => photoInputRef.current?.click()}
        onFile={() => fileInputRef.current?.click()}
        onLocation={shareLocation}
        onStartVoice={startVoiceNote}
        onStopVoice={stopVoiceNote}
        onVoiceCall={() => void beginCall('voice')}
        onVideoCall={() => void beginCall('video')}
      />

      <TauTalkMessageContextMenu
        menu={contextMenu}
        onReply={() => {
          if (contextMenu) startReplyToMessage(contextMenu.messageId);
        }}
        onClose={() => setContextMenu(null)}
      />
    </div>
  );
}
