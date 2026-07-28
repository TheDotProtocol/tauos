import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ChatsScreen from './src/screens/ChatsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatScreen from './src/screens/ChatScreen';
import { clearSession, loadSession, TauUser } from './src/storage/session';
import { colors } from './src/theme';
import type { Conversation } from './src/api/client';

type Screen = 'login' | 'register' | 'chats' | 'chat' | 'profile';

function App(): JSX.Element {
  const [booting, setBooting] = useState(true);
  const [screen, setScreen] = useState<Screen>('login');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<TauUser | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

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
    setScreen('login');
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
          onBack={() => setScreen('chats')}
        />
      ) : null}
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
