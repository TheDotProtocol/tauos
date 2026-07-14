'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  encryptMessage,
  decryptMessage,
  registerIdentityKey,
  getOrCreateKeyPair,
  type ConversationCryptoContext,
} from '@/lib/tautalk-crypto';
import { useTauSession } from '@/hooks/useTauSession';
import {
  MessageCircle, Send, Plus, Search, Shield, LogOut, Users, Lock, ArrowLeft
} from 'lucide-react';

function headers(token: string | null) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export default function TauTalkChat() {
  const { user, token, ready } = useTauSession({
    requireAuth: true,
    loginPath: '/tauid/login?redirect=/tautalk/chat',
  });
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [decrypted, setDecrypted] = useState<Record<string, string>>({});
  const [cryptoCtx, setCryptoCtx] = useState<ConversationCryptoContext | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [newChatQuery, setNewChatQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const loadConversations = useCallback(async () => {
    if (!token) return;
    const res = await fetch('/api/tautalk/conversations', { headers: headers(token) });
    if (res.ok) {
      const data = await res.json();
      setConversations(data.conversations ?? []);
    }
  }, [token]);

  const loadCryptoContext = useCallback(
    async (conversationId: string, convType: string) => {
      if (!token) return;
      const { publicKey } = await getOrCreateKeyPair();
      const res = await fetch(
        `/api/tautalk/conversations/keys?conversationId=${conversationId}`,
        { headers: headers(token) }
      );
      if (!res.ok) return;
      const data = await res.json();
      setParticipants(data.participants ?? []);
      const keys = (data.participants ?? [])
        .map((p: { publicKey: string | null }) => p.publicKey)
        .filter(Boolean);
      setCryptoCtx({
        type: convType === 'group' ? 'group' : 'direct',
        myPublicKey: publicKey,
        participantPublicKeys: keys,
      });
    },
    [token]
  );

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

  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!token) return;
      const res = await fetch(
        `/api/tautalk/messages?conversationId=${conversationId}`,
        { headers: headers(token) }
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
        await decryptAll(data.messages ?? [], conversationId, cryptoCtx);
      }
    },
    [token, cryptoCtx, decryptAll]
  );

  useEffect(() => {
    if (!ready || !token) return;
    registerIdentityKey(token).then(() => loadConversations()).finally(() => setLoading(false));
  }, [ready, token, loadConversations]);

  useEffect(() => {
    if (!activeId || !token) return;
    const conv = conversations.find((c) => c.id === activeId);
    loadCryptoContext(activeId, conv?.type ?? 'direct').then(() => loadMessages(activeId));

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
        const text = await decryptMessage(activeId, m.content_encrypted, cryptoCtx ?? undefined);
        setDecrypted((prev) => ({ ...prev, [m.id]: text }));
      } catch {
        /* ignore parse errors */
      }
    });
    eventSourceRef.current = es;
    return () => es.close();
  }, [activeId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectConversation = (id: string) => {
    setActiveId(id);
    setMobileShowChat(true);
    loadMessages(id);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeId || !token) return;
    const encrypted = await encryptMessage(activeId, input.trim(), cryptoCtx ?? undefined);
    const res = await fetch('/api/tautalk/messages', {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ conversationId: activeId, contentEncrypted: encrypted }),
    });
    if (res.ok) {
      setInput('');
      loadMessages(activeId);
      loadConversations();
    }
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
          <MessageCircle className="w-6 h-6 text-green-400" />
          <div>
            <h1 className="font-bold">Tau Talk</h1>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Public Beta · ECDH encrypted
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 hidden sm:block">{user?.email}</span>
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

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`${
            mobileShowChat ? 'hidden sm:flex' : 'flex'
          } w-full sm:w-80 border-r border-gray-800 flex-col`}
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
              title="New group"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-center text-gray-500 text-sm p-6">No conversations yet.</p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/50 ${
                    activeId === c.id ? 'bg-gray-800' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium truncate flex items-center gap-1">
                      {c.type === 'group' && <Users className="w-3 h-3 text-green-400 shrink-0" />}
                      {c.title || (c.type === 'direct' ? 'Direct message' : 'Group')}
                    </span>
                    {c.unread_count > 0 && (
                      <span className="text-xs bg-green-500 text-black px-1.5 rounded-full">
                        {c.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {c.last_message_at ? new Date(c.last_message_at).toLocaleString() : 'No messages'}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        <main
          className={`${
            !mobileShowChat && !activeId ? 'hidden sm:flex' : 'flex'
          } flex-1 flex-col`}
        >
          {!activeId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
              <Shield className="w-16 h-16 text-green-500/30" />
              <p>Select a conversation or start a new chat</p>
              <p className="text-xs px-4 text-center">Messages encrypted with per-conversation ECDH keys</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-gray-800 text-sm text-gray-400">
                {activeConv?.type === 'group' ? (
                  <span>{activeConv.title} · {participants.length} members</span>
                ) : (
                  <span>Direct message</span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const isMe =
                    String(m.sender_id) === String(user?.id) ||
                    m.sender_username === user?.username;
                  const readByOthers = participants.filter(
                    (p) =>
                      p.userId !== user?.id &&
                      p.lastReadAt &&
                      new Date(p.lastReadAt) >= new Date(m.created_at)
                  );
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
                        <p>{decrypted[m.id] ?? '...'}</p>
                        <p className="text-[10px] opacity-60 mt-1 flex items-center gap-2">
                          {new Date(m.created_at).toLocaleTimeString()}
                          {isMe && readByOthers.length > 0 && (
                            <span title="Read">✓✓</span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-800 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type an encrypted message..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-green-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-4 py-3 bg-green-500 text-black rounded-xl disabled:opacity-40"
                >
                  <Send className="w-5 h-5" />
                </button>
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
                placeholder="Email or username@tauos.org"
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
                  Create group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
