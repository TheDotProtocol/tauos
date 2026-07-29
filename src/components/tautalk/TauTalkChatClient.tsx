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
  startCall,
  declineCall,
  type TalkProfile,
  type IncomingCall,
} from '@/lib/tautalk-web-api';
import { WebCallManager, type WebCallMediaState } from '@/lib/tautalk-web-call';
import TauTalkAvatar from '@/components/tautalk/TauTalkAvatar';
import TauTalkProfileModal from '@/components/tautalk/TauTalkProfileModal';
import TauTalkCallOverlay from '@/components/tautalk/TauTalkCallOverlay';
import {
  MessageCircle,
  Send,
  Plus,
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
  const [decrypted, setDecrypted] = useState<Record<string, string>>({});
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
  const [callMedia, setCallMedia] = useState<WebCallMediaState>(emptyCallMedia);

  const bottomRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const callManagerRef = useRef<WebCallManager | null>(null);
  const cryptoCtxRef = useRef<ConversationCryptoContext | null>(null);

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
      const dec: Record<string, string> = {};
      for (const m of msgs) {
        dec[m.id] = await decryptMessage(conversationId, m.content_encrypted, ctx ?? undefined);
      }
      setDecrypted(dec);
    },
    []
  );

  const prepareConversation = useCallback(
    async (conversationId: string, convType: string) => {
      if (!token) return null;
      setCryptoReady(false);
      setCryptoError('');
      try {
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

  // Poll incoming calls
  useEffect(() => {
    if (!token) return;
    const poll = async () => {
      try {
        const incoming = await fetchIncomingCalls(token);
        if (incoming.length > 0 && !callOpen) {
          setIncomingCall(incoming[0]);
        }
      } catch {
        /* ignore */
      }
    };
    poll();
    const id = setInterval(poll, 3000);
    return () => clearInterval(id);
  }, [token, callOpen]);

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
        const text = await decryptMessage(
          activeId,
          m.content_encrypted,
          cryptoCtxRef.current ?? undefined
        );
        setDecrypted((prev) => ({ ...prev, [m.id]: text }));
      } catch {
        /* ignore */
      }
    });
    eventSourceRef.current = es;

    return () => {
      cancelled = true;
      es.close();
    };
  }, [activeId, token, conversations, prepareConversation, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectConversation = async (id: string) => {
    setActiveId(id);
    setMobileShowChat(true);
    setSendError('');
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError('');
    if (!input.trim() || !activeId || !token) return;
    if (!cryptoReady || !cryptoCtxRef.current) {
      setSendError('Securing connection… try again in a moment.');
      return;
    }

    setSending(true);
    try {
      const encrypted = await encryptMessage(activeId, input.trim(), cryptoCtxRef.current);
      const res = await fetch('/api/tautalk/messages', {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify({ conversationId: activeId, contentEncrypted: encrypted }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Send failed');
      }
      setInput('');
      await loadMessages(activeId, cryptoCtxRef.current);
      await loadConversations();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  const beginCall = async (mode: 'voice' | 'video') => {
    if (!token || !activeId) return;
    const mgr = callManagerRef.current;
    if (!mgr) return;

    setCallMode(mode);
    mgr.onFailed = (msg) => {
      setCallOpen(false);
      setSendError(msg);
    };
    mgr.onConnected = () => {};

    const session = await startCall(token, activeId, mode);
    const ok = await mgr.startOutgoing(token, session, mode);
    if (ok) setCallOpen(true);
  };

  const acceptIncoming = async () => {
    if (!token || !incomingCall) return;
    const mgr = callManagerRef.current;
    if (!mgr) return;
    setCallMode(incomingCall.mode);
    mgr.onFailed = () => {
      setCallOpen(false);
      setIncomingCall(null);
    };
    const ok = await mgr.startIncoming(token, incomingCall, incomingCall.mode);
    if (ok) {
      setCallOpen(true);
      setIncomingCall(null);
      if (incomingCall.conversation_id) {
        selectConversation(incomingCall.conversation_id);
      }
    }
  };

  const hangupCall = async () => {
    await callManagerRef.current?.hangup();
    setCallOpen(false);
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
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-green-600 text-white rounded-br-sm'
                            : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                        }`}
                      >
                        {!isMe && (
                          <p className="text-xs text-green-400 mb-1">{m.sender_username}</p>
                        )}
                        <p className="whitespace-pre-wrap break-words">
                          {decrypted[m.id] ?? '…'}
                        </p>
                        <p className="text-[10px] opacity-60 mt-1">
                          {new Date(m.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <form
                onSubmit={sendMessage}
                className="p-4 border-t border-gray-800 flex flex-col gap-2 shrink-0"
              >
                {sendError ? <p className="text-xs text-red-400">{sendError}</p> : null}
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      cryptoReady ? 'Type an encrypted message…' : 'Preparing encryption…'
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

      {incomingCall && !callOpen ? (
        <div className="fixed inset-0 z-[55] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8 max-w-sm w-full text-center">
            <p className="text-green-400 text-sm mb-2">Incoming {incomingCall.mode} call</p>
            <p className="text-xl font-bold mb-6">
              {incomingCall.caller?.full_name || incomingCall.caller?.username || 'Someone'}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  declineCall(token!, incomingCall.id);
                  setIncomingCall(null);
                }}
                className="flex-1 py-3 rounded-xl bg-gray-700 font-medium"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={acceptIncoming}
                className="flex-1 py-3 rounded-xl bg-green-500 text-black font-semibold"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <TauTalkCallOverlay
        open={callOpen}
        mode={callMode}
        peerName={activePeerName}
        media={callMedia}
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
    </div>
  );
}
