import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { tokens } from '@tau/taumail-mobile-client';
import { TauMailDrawerContent } from '../components/TauMailDrawerContent';
import MailFolderScreen from '../screens/MailFolderScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AiAssistantScreen from '../screens/AiAssistantScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ContactsScreen from '../screens/ContactsScreen';
import TasksScreen from '../screens/TasksScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import StorageScreen from '../screens/StorageScreen';
import ComposeScreen from '../screens/ComposeScreen';
import EmailDetailScreen from '../screens/EmailDetailScreen';
import AddEventScreen from '../screens/AddEventScreen';
import AddContactScreen from '../screens/AddContactScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: tokens.colors.pageBase },
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen
        name="MailFolder"
        component={MailFolderScreen}
        initialParams={{ folder: 'inbox', title: 'Inbox' }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AiAssistant" component={AiAssistantScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="Tasks" component={TasksScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Storage" component={StorageScreen} />
      <Stack.Screen name="Compose" component={ComposeScreen} />
      <Stack.Screen name="EmailDetail" component={EmailDetailScreen} />
      <Stack.Screen name="AddEvent" component={AddEventScreen} />
      <Stack.Screen name="AddContact" component={AddContactScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
}

export function MainDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <TauMailDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: 240,
          backgroundColor: tokens.colors.pagePrimary,
        },
        overlayColor: 'rgba(0,0,0,0.55)',
        swipeEdgeWidth: 48,
      }}
    >
      <Drawer.Screen name="AppRoot" component={MainStack} />
    </Drawer.Navigator>
  );
}
