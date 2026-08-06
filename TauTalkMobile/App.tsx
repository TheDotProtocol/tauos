import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ChatsScreen from './src/screens/ChatsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatScreen from './src/screens/ChatScreen';
import IncomingCallModal from './src/components/IncomingCallModal';
import { startIncomingRing, stopCallSounds } from './src/calls/callSounds';
import {
  Conversation,
  declineCall,
  fetchConversations,
  fetchIncomingCalls,
  IncomingCall,
} from './src/api/client';
import { clearSession, loadSession, TauUser } from './src/storage/session';
import { colors } from './src/theme';

type Screen = 'login' | 'register' | 'chats' | 'chat' | 'profile';

function App(): JSX.Element {
  const [booting, setBooting] = useState(true);
  const [screen, setScreen] = useState<Screen>('login');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<TauUser | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [acceptedIncoming, setAcceptedIncoming] = useState<IncomingCall | null>(null);

  useEffect(() => {
    loadSession().then((session) => {
      if (session) {
        setToken(session.token);
        setUser(session.user);
        setScreen('chats');
      }
      setBooting(false);
    });
  }, []);

  useEffect(() => {
    if (!token || screen === 'login' || screen === 'register') return;

    const poll = async () => {
      const calls = await fetchIncomingCalls(token);
      if (calls.length > 0 && !incomingCall && !acceptedIncoming) {
        setIncomingCall(calls[0]);
      } else if (calls.length === 0 && incomingCall) {
        setIncomingCall(null);
        stopCallSounds();
      }
    };

    poll();
    const interval = setInterval(poll, 1000);
    return () => clearInterval(interval);
  }, [token, screen, incomingCall, acceptedIncoming]);

  useEffect(() => {
    if (incomingCall) {
      startIncomingRing();
      return () => stopCallSounds();
    }
    return undefined;
  }, [incomingCall]);

  const onAuthSuccess = (nextToken: string, nextUser: TauUser) => {
    setToken(nextToken);
    setUser(nextUser);
    setScreen('chats');
  };

  const onLogout = async () => {
    await clearSession();
    setToken(null);
    setUser(null);
    setActiveConversation(null);
    setIncomingCall(null);
    setAcceptedIncoming(null);
    setScreen('login');
  };

  const conversationFromIncoming = async (call: IncomingCall): Promise<Conversation> => {
    if (!token) {
      throw new Error('Not signed in');
    }
    const list = await fetchConversations(token);
    const existing = list.find((c) => c.id === call.conversation_id);
    if (existing) return existing;

    return {
      id: call.conversation_id,
      type: 'direct',
      title: null,
      updated_at: new Date().toISOString(),
      last_message_at: null,
      last_message_encrypted: null,
      unread_count: 0,
      peer: call.caller
        ? {
            id: call.caller.id,
            username: call.caller.username,
            email: '',
            full_name: call.caller.full_name,
            avatar_url: call.caller.avatar_url ?? null,
          }
        : null,
    };
  };

  const onAcceptIncoming = async () => {
    if (!incomingCall) return;
    stopCallSounds();
    try {
      const conversation = await conversationFromIncoming(incomingCall);
      setActiveConversation(conversation);
      setAcceptedIncoming(incomingCall);
      setIncomingCall(null);
      setScreen('chat');
    } catch {
      setIncomingCall(null);
    }
  };

  const onDeclineIncoming = async () => {
    stopCallSounds();
    if (incomingCall && token) {
      await declineCall(token, incomingCall.id).catch(() => {});
    }
    setIncomingCall(null);
  };

  if (booting) {
    return (
      <View style={styles.boot}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <ActivityIndicator size="large" color={colors.goldLight} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      {screen === 'login' ? (
        <LoginScreen
          onSuccess={onAuthSuccess}
          onRegister={() => setScreen('register')}
        />
      ) : null}
      {screen === 'register' ? (
        <RegisterScreen onSuccess={onAuthSuccess} onBack={() => setScreen('login')} />
      ) : null}
      {screen === 'chats' && token && user ? (
        <ChatsScreen
          token={token}
          user={user}
          onOpenChat={(c) => {
            setActiveConversation(c);
            setScreen('chat');
          }}
          onOpenProfile={() => setScreen('profile')}
          onLogout={onLogout}
        />
      ) : null}
      {screen === 'profile' && token && user ? (
        <ProfileScreen
          token={token}
          user={user}
          onBack={() => setScreen('chats')}
          onUpdated={(next) => setUser(next)}
        />
      ) : null}
      {screen === 'chat' && token && user && activeConversation ? (
        <ChatScreen
          token={token}
          user={user}
          conversation={activeConversation}
          onBack={() => {
            setAcceptedIncoming(null);
            setScreen('chats');
          }}
          onConversationUpdate={(updated) => setActiveConversation(updated)}
          incomingCall={acceptedIncoming}
          onIncomingHandled={() => setAcceptedIncoming(null)}
        />
      ) : null}

      <IncomingCallModal
        call={incomingCall}
        onAccept={onAcceptIncoming}
        onDecline={onDeclineIncoming}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  boot: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
