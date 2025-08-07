import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './store';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import LoginScreen from './screens/LoginScreen';
import InboxScreen from './screens/InboxScreen';
import ComposeScreen from './screens/ComposeScreen';
import EmailDetailScreen from './screens/EmailDetailScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#1a1a1a',
              },
              headerTintColor: '#ffffff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              cardStyle: { backgroundColor: '#2a2a2a' },
            }}>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Inbox" 
              component={InboxScreen}
              options={{ title: 'TauMail' }}
            />
            <Stack.Screen 
              name="Compose" 
              component={ComposeScreen}
              options={{ title: 'New Email' }}
            />
            <Stack.Screen 
              name="EmailDetail" 
              component={EmailDetailScreen}
              options={{ title: 'Email' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App; 