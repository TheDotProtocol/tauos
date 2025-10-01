import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native';
import { TauColors } from '../components/TauUIComponents';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// Import the new phone apps
import PhoneApp from '../apps/PhoneApp';
import MessagesApp from '../apps/MessagesApp';
import ContactsApp from '../apps/ContactsApp';
import SettingsApp from '../apps/SettingsApp';

// Haptic feedback hook
const useHapticFeedback = () => {
  const trigger = (type: 'impactLight' | 'impactMedium' | 'impactHeavy') => {
    ReactNativeHapticFeedback.trigger(type);
  };
  return { trigger };
};

// Placeholder screen components for existing apps
const LoginScreen = () => <Text>Login Screen</Text>;
const InboxScreen = () => <Text>Inbox Screen</Text>;
const ComposeScreen = () => <Text>Compose Screen</Text>;
const EmailDetailScreen = () => <Text>Email Detail Screen</Text>;
const SettingsScreen = () => <Text>Settings Screen</Text>;
const CloudHomeScreen = () => <Text>Cloud Home Screen</Text>;
const IdentityHomeScreen = () => <Text>Identity Home Screen</Text>;

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom transition animations
const fadeTransition = {
  cardStyleInterpolator: ({ current, layouts }: any) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
};

const slideTransition = {
  cardStyleInterpolator: ({ current, layouts }: any) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
  }),
};

// Enhanced Tab Navigator with animations
const TauTabNavigator = () => {
  const hapticFeedback = useHapticFeedback();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Phone') {
            iconName = focused ? '📞' : '📞';
          } else if (route.name === 'Messages') {
            iconName = focused ? '💬' : '💬';
          } else if (route.name === 'Contacts') {
            iconName = focused ? '👥' : '👥';
          } else if (route.name === 'TauMail') {
            iconName = focused ? '📧' : '📧';
          } else if (route.name === 'TauCloud') {
            iconName = focused ? '☁️' : '☁️';
          } else if (route.name === 'TauID') {
            iconName = focused ? '🆔' : '🆔';
          } else if (route.name === 'Settings') {
            iconName = focused ? '⚙️' : '⚙️';
          }

          return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: TauColors.primary,
        tabBarInactiveTintColor: TauColors.textSecondary,
        tabBarStyle: {
          backgroundColor: 'rgba(42, 42, 42, 0.95)',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
      screenListeners={{
        tabPress: (e) => {
          hapticFeedback.trigger('impactLight');
        },
      }}
    >
      <Tab.Screen 
        name="Phone" 
        component={PhoneApp}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesApp}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsApp}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="TauMail" 
        component={TauMailStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="TauCloud" 
        component={TauCloudStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="TauID" 
        component={TauIDStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsApp}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// TauMail Stack Navigator
const TauMailStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: TauColors.background,
        },
        headerTintColor: TauColors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: { backgroundColor: TauColors.background },
      }}
    >
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
        options={{ title: 'Compose' }}
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
  );
};

// TauCloud Stack Navigator
const TauCloudStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: TauColors.background,
        },
        headerTintColor: TauColors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: { backgroundColor: TauColors.background },
      }}
    >
      <Stack.Screen 
        name="CloudHome" 
        component={CloudHomeScreen}
        options={{ title: 'TauCloud' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

// TauID Stack Navigator
const TauIDStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: TauColors.background,
        },
        headerTintColor: TauColors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: { backgroundColor: TauColors.background },
      }}
    >
      <Stack.Screen 
        name="IdentityHome" 
        component={IdentityHomeScreen}
        options={{ title: 'TauID' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

// Main Navigation Container
const TauNavigation = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: TauColors.primary,
            background: TauColors.background,
            card: TauColors.surface,
            text: TauColors.text,
            border: 'rgba(255, 255, 255, 0.1)',
            notification: TauColors.error,
          },
        }}
      >
        <TauTabNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default TauNavigation; 