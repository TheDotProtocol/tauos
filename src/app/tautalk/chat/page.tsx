'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { encryptMessage, decryptMessage } from '@/lib/tautalk-crypto';
import {
  MessageCircle, Send, Plus, Search, Shield, LogOut, Users, Lock
} from 'lucide-react';

function headers() {
  const token = localStorage.getItem('tauos_token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export default function TauTalkChat() {
  const [user, setUser] = useState<{ id?: string; email?: string; username?: string } | null>(null);
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [decrypted, setDecrypted] = useState({});
  const [input, setInput] = useState('');
  const [newChatQuery, setNewChatQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const loadConversations = useCallback(async () => {
    const res = await fetch('/api/tautalk/conversations', { headers: headers() });
    if (res.ok) {
      const data = await res.json();
      setConversations(data.conversations ?? []);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    const res = await fetch(
      `/api/tautalk/messages?conversationId=${conversationId}`,
      { headers: headers() }
    );
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages ?? []);
      const dec: Record<string, string> = {};
      for (const m of data.messages ?? []) {
        dec[m.id] = await decryptMessage(conversationId, m.content_encrypted);
      }
      setDecrypted(dec);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('tauos_user');
    const token = localStorage.getItem('tauos_token');
    if (!storedUser || !token) {
      window.location.href = '/tautalk';
      return;
    }
    setUser(JSON.parse(storedUser));
    loadConversations().finally(() => setLoading(false));

    const interval = setInterval(() => {
      if (activeId) loadMessages(activeId);
      loadConversations();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeId, loadConversations, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectConversation = (id: string) => {
    setActiveId(id);
    loadMessages(id);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeId) return;
    const encrypted = await encryptMessage(activeId, input.trim());
    const res = await fetch('/api/tautalk/messages', {
      method: 'POST',
      headers: headers(),
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
    if (!newChatQuery.trim()) return;
    const res = await fetch('/api/tautalk/conversations', {
      method: 'POST',
      headers: headers(),
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

  const logout = () => {
    localStorage.removeItem('tauos_user');
    localStorage.removeItem('tauos_token');
    window.location.href = '/tautalk';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-gray-400">
        Loading Tau Talk...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/80">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-green-400" />
          <div>
            <h1 className="font-bold">Tau Talk</h1>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> E2E encrypted
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 hidden sm:block">{user?.email}</span>
          <button onClick={logout} className="p-2 text-gray-400 hover:text-white" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full sm:w-80 border-r border-gray-800 flex flex-col">
          <div className="p-3 flex gap-2">
            <button
              onClick={() => setShowNewChat(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> New chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-center text-gray-500 text-sm p-6">No conversations yet. Start a new chat!</p>
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
                    <span className="font-medium truncate">
                      {c.title || (c.type === 'direct' ? 'Direct message' : 'Group')}
                    </span>
                    {c.unread_count > 0 && (
                      <span className="text-xs bg-green-500 text-black px-1.5 rounded-full">{c.unread_count}</span>
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

        {/* Chat area */}
        <main className="hidden sm:flex flex-1 flex-col">
          {!activeId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
              <Shield className="w-16 h-16 text-green-500/30" />
              <p>Select a conversation or start a new chat</p>
              <p className="text-xs">Messages are encrypted before leaving your device</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const isMe = m.sender_id === user?.id || m.sender_username === user?.username;
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-green-600 text-white rounded-br-sm'
                            : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                        }`}
                      >
                        {!isMe && (
                          <p className="text-xs text-green-400 mb-1">{m.sender_username}</p>
                        )}
                        <p>{decrypted[m.id] ?? '...'}</p>
                        <p className="text-[10px] opacity-60 mt-1">
                          {new Date(m.created_at).toLocaleTimeString()}
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
    </div>
  );
}
