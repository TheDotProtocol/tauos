import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens } from '@tau/taumail-mobile-client';
import { ScreenHeader } from '../components/ScreenHeader';

type PlaceholderScreenProps = {
  navigation: any;
  route: { params?: { title?: string } };
};

const PlaceholderScreen = ({ navigation, route }: PlaceholderScreenProps) => {
  const title = route.params?.title ?? 'Coming soon';

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={title} onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
      <View style={styles.body}>
        <Text style={styles.message}>{title} is coming soon in TauMail Mobile.</Text>
        <Text style={styles.hint}>Use the sidebar to open Inbox, Drafts, Sent, Trash, or Settings.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  message: { fontSize: 16, color: tokens.colors.textSecondary, textAlign: 'center' },
  hint: { fontSize: 13, color: tokens.colors.textTertiary, textAlign: 'center', marginTop: 12 },
});

export default PlaceholderScreen;
