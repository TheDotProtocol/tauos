import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { hydrateSession as hydrateApiSession, tokens } from '@tau/taumail-mobile-client';
import { ensureTauMailMobileClient } from './lib/mobileClient';
import { hydrateSession } from './store/slices/authSlice';
import { startPushNotifications, stopPushNotifications } from './services/pushNotifications';
import { MainDrawerNavigator } from './navigation/MainDrawerNavigator';

import LoginScreen from './screens/LoginScreen';
import TwoFactorScreen from './screens/TwoFactorScreen';

ensureTauMailMobileClient();

const Stack = createStackNavigator();

function RootNavigator() {
  const dispatch = useDispatch();
  const [booting, setBooting] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Main'>('Login');

  useEffect(() => {
    (async () => {
      try {
        const session = await hydrateApiSession();
        if (session.user && session.token) {
          dispatch(
            hydrateSession({
              user: {
                id: String(session.user.id),
                email: session.user.email,
                name: session.user.fullName || session.user.username,
                avatarUrl: session.user.avatarUrl ?? null,
              },
              token: session.token,
            }),
          );
          setInitialRoute('Main');
          startPushNotifications().catch(() => undefined);
        }
      } catch {
        /* stay on login */
      } finally {
        setBooting(false);
      }
    })();

    return () => stopPushNotifications();
  }, [dispatch]);

  if (booting) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={tokens.colors.gold} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: tokens.colors.pageBase },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="TwoFactor" component={TwoFactorScreen} />
      <Stack.Screen name="Main" component={MainDrawerNavigator} />
    </Stack.Navigator>
  );
}

const App = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.pagePrimary} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  </Provider>
);

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.pageBase,
  },
});

export default App;
