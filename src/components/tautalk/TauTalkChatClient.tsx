'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  encryptMessage,
  decryptMessage,
  registerIdentityKey,
  type ConversationCryptoContext,
} from '@/lib/tautalk-crypto';
import { useTauSession } from '@/hooks/useTauSession';
import {
  displayNameForConversation,
  usernameLabel,
  peerAvatar,
  normalizeConversations,
  type TalkConversation,
} from '@/lib/tautalk-conversation-utils';
import {
  buildCryptoContext,
  fetchConversationKeys,
  fetchIncomingCalls,
  fetchCallSession,
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
  textPayload,
  type MessagePayload,
} from '@/lib/tautalk-message-payload';
import TauTalkMessageBubble from '@/components/tautalk/TauTalkMessageBubble';
import TauTalkAttachSheet from '@/components/tautalk/TauTalkAttachSheet';
import { TAUTALK_UNAVAILABLE_MESSAGE } from '@/lib/tautalk-call-constants';
import { startIncomingRing, startOutgoingRingback, stopCallSounds } from '@/lib/tautalk-call-sounds';
import { WebCallManager, type WebCallMediaState } from '@/lib/tautalk-web-call';
import TauTalkAvatar from '@/components/tautalk/TauTalkAvatar';
import TauTalkProfileModal from '@/components/tautalk/TauTalkProfileModal';
import TauTalkCallOverlay from '@/components/tautalk/TauTalkCallOverlay';
import TauTalkIncomingCall from '@/components/tautalk/TauTalkIncomingCall';
import {
  MessageCircle,
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
  const { user, token, ready } = useTauSession({
    requireAuth: true,
    loginPath: '/tauid/login?redirect=/tautalk/chat',
  });

  const [profile, setProfile] = useState<TalkProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);
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

  const bottomRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const callManagerRef = useRef<WebCallManager | null>(null);
  const cryptoCtxRef = useRef<ConversationCryptoContext | null>(null);
  const [callPeerName, setCallPeerName] = useState('');
  const lastNotifiedCallRef = useRef<string | null>(null);
  const isOutgoingCallRef = useRef(false);
  const unavailableTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);

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

  const decryptAll = useCallback(
    async (msgs: any[], conversationId: string, ctx: ConversationCryptoContext | null) => {
      const dec: Record<string, MessagePayload> = {};
      for (const m of msgs) {
        const plain = await decryptMessage(conversationId, m.content_encrypted, ctx ?? undefined);
        dec[m.id] = parsePayload(plain);
      }
      setDecrypted(dec);
    },
    []
  );

  const decryptOne = useCallback(
    async (conversationId: string, messageId: string, contentEncrypted: string) => {
      const ctx = cryptoCtxRef.current;
      if (!ctx) return;
      const plain = await decryptMessage(conversationId, contentEncrypted, ctx);
      const payload = parsePayload(plain);
      setDecrypted((prev) => ({ ...prev, [messageId]: payload }));
    },
    []
  );

  const prepareConversation = useCallback(
    async (conversationId: string, convType: string) => {
      if (!token) return null;
      setCryptoReady(false);
      setCryptoError('');
      try {
        await registerIdentityKey(token);
        const parts = await fetchConversationKeys(token, conversationId);
        setParticipants(parts);
        const ctx = await buildCryptoContext(conversationId, convType, parts);
        setCryptoCtx(ctx);
        cryptoCtxRef.current = ctx;
        setCryptoReady(true);
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
    if (!ready || !token) return;
    registerIdentityKey(token)
      .then(() => loadConversations())
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
    const id = setInterval(poll, 1000);
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
    if (!cryptoCtx || !activeId || messages.length === 0) return;
    void decryptAll(messages, activeId, cryptoCtx);
  }, [cryptoCtx, activeId, messages, decryptAll]);

  useEffect(() => {
    if (!activeId || !token) return;
    let cancelled = false;
    const conv = conversations.find((c) => c.id === activeId);

    (async () => {
      const ctx = await prepareConversation(activeId, conv?.type ?? 'direct');
      if (cancelled || !ctx) return;
      await loadMessages(activeId, ctx);
    })();

    eventSourceRef.current?.close();
    const es = new EventSource(
      `/api/tautalk/messages/stream?conversationId=${activeId}&token=${encodeURIComponent(token)}`
    );
    es.addEventListener('message', async (ev) => {
      try {
        const m = JSON.parse(ev.data);
        setMessages((prev) => {
          if (prev.some((x) => x.id === m.id)) return prev;
          return [...prev, m];
        });
        const tryDecrypt = () => decryptOne(activeId, m.id, m.content_encrypted);
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
    });
    eventSourceRef.current = es;

    return () => {
      cancelled = true;
      es.close();
    };
  }, [activeId, token, conversations, prepareConversation, loadMessages, decryptOne]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectConversation = async (id: string) => {
    setActiveId(id);
    setMobileShowChat(true);
    setSendError('');
    setDecrypted({});
    setMessages([]);
  };

  const sendPayload = async (payload: MessagePayload) => {
    if (!activeId || !token || !cryptoCtxRef.current) {
      setSendError('Securing connection… try again in a moment.');
      return;
    }

    setSending(true);
    setSendError('');
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
      await loadConversations();
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

  if (loading || !ready) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-gray-400">
        Loading Tau Talk...
      </div>
    );
  }

  const activeConv = conversations.find((c) => c.id === activeId);
  const activePeerName = activeConv ? displayNameForConversation(activeConv, user?.id) : '';
  const activePeerHandle = activeConv ? usernameLabel(activeConv) : null;
  const myName = profile?.fullName || user?.fullName || user?.username || user?.email || 'You';
  const myAvatar = profile?.avatarUrl ?? null;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/80">
        <div className="flex items-center gap-3">
          {mobileShowChat && (
            <button
              onClick={() => setMobileShowChat(false)}
              className="sm:hidden p-1 text-gray-400"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <MessageCircle className="w-6 h-6 text-green-400 shrink-0" />
          <div>
            <h1 className="font-bold">Tau Talk</h1>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Encrypted · Web
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <TauTalkAvatar name={myName} imageUrl={myAvatar} size={36} />
            <span className="text-sm text-gray-300 hidden md:block max-w-[140px] truncate">
              {myName}
            </span>
            <User className="w-4 h-4 text-gray-500 hidden sm:block" />
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('tauos_user');
              localStorage.removeItem('tauos_token');
              window.location.href = '/tautalk';
            }}
            className="p-2 text-gray-400 hover:text-white"
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
          } w-full sm:w-80 border-r border-gray-800 flex-col shrink-0`}
        >
          <div className="p-3 flex gap-2">
            <button
              onClick={() => setShowNewChat(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> New chat
            </button>
            <button
              onClick={() => setShowNewGroup(true)}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-center text-gray-500 text-sm p-6">No conversations yet.</p>
            ) : (
              conversations.map((c) => {
                const name = displayNameForConversation(c, user?.id);
                const handle = usernameLabel(c);
                return (
                  <button
                    key={c.id}
                    onClick={() => selectConversation(c.id)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/50 flex gap-3 items-center ${
                      activeId === c.id ? 'bg-gray-800' : ''
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
                          <span className="text-xs bg-green-500 text-black px-1.5 rounded-full shrink-0">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                      {handle ? (
                        <p className="text-xs text-green-400/80 truncate">{handle}</p>
                      ) : null}
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
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
        </aside>

        <main
          className={`${
            !mobileShowChat && !activeId ? 'hidden sm:flex' : 'flex'
          } flex-1 flex-col min-w-0 min-h-0`}
        >
          {!activeId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4 p-6">
              <Shield className="w-16 h-16 text-green-500/30" />
              <p>Select a conversation or start a new chat</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <TauTalkAvatar
                    name={activePeerName}
                    imageUrl={activeConv?.type === 'direct' ? peerAvatar(activeConv) : null}
                    size={40}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{activePeerName}</p>
                    {activePeerHandle ? (
                      <p className="text-xs text-green-400/80 truncate">{activePeerHandle}</p>
                    ) : activeConv?.type === 'group' ? (
                      <p className="text-xs text-gray-500">{participants.length} members</p>
                    ) : null}
                  </div>
                </div>
                {activeConv?.type === 'direct' ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => beginCall('voice')}
                      className="p-2.5 rounded-full hover:bg-gray-800 text-green-400"
                      title="Voice call"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => beginCall('video')}
                      className="p-2.5 rounded-full hover:bg-gray-800 text-green-400"
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
                      {!isMe && (
                        <p className="text-xs text-green-400 mb-1 px-1">{m.sender_username}</p>
                      )}
                      {payload ? (
                        <TauTalkMessageBubble
                          payload={payload}
                          isMe={isMe}
                          token={token!}
                          time={time}
                        />
                      ) : (
                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className="px-4 py-2 rounded-2xl text-sm bg-gray-800 text-gray-400 animate-pulse">
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
                className="p-4 border-t border-gray-800 flex flex-col gap-2 shrink-0"
              >
                {sendError ? <p className="text-xs text-red-400">{sendError}</p> : null}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAttach(true)}
                    disabled={!cryptoReady || sending}
                    className="px-3 py-3 rounded-xl bg-gray-800 text-green-400 disabled:opacity-40"
                    title="Attach photo, file, voice note, or location"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
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
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-green-500 outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || !cryptoReady || sending}
                    className="px-4 py-3 bg-green-500 text-black rounded-xl disabled:opacity-40 font-medium min-w-[52px]"
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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" /> New conversation
            </h3>
            <form onSubmit={startChat}>
              <input
                autoFocus
                placeholder="Email or @username"
                value={newChatQuery}
                onChange={(e) => setNewChatQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white mb-4"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowNewChat(false)} className="flex-1 py-2 bg-gray-700 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-green-500 text-black rounded-lg font-semibold">
                  Start
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" /> New group
            </h3>
            <form onSubmit={startGroup} className="space-y-3">
              <input
                placeholder="Group name"
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <input
                placeholder="Members: email1, email2, ..."
                value={groupMembers}
                onChange={(e) => setGroupMembers(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowNewGroup(false)} className="flex-1 py-2 bg-gray-700 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-green-500 text-black rounded-lg font-semibold">
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
        onUpdated={(p) => setProfile(p)}
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
    </div>
  );
}
