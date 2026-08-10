import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { CommonActions, DrawerActions } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout as logoutAction } from '../store/slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { TauMailIcon } from '../components/TauMailIcon';
import { TauMailUserAvatar } from '../components/TauMailUserAvatar';
import {
  fetchProfile,
  logout as apiLogout,
  fetchPushPreference,
  setPushPreference,
  tokens,
} from '@tau/taumail-mobile-client';
import { startPushNotifications, stopPushNotifications } from '../services/pushNotifications';

const SettingsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [remotePush, setRemotePush] = useState(false);
  const [pushLoading, setPushLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const profile = await fetchProfile();
        setProfileEmail(profile.email);
      } catch {
        /* use session user */
      } finally {
        setProfileLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const prefs = await fetchPushPreference();
        setPushEnabled(prefs.enabled);
        setRemotePush(prefs.remotePushConfigured);
      } catch {
        /* defaults */
      } finally {
        setPushLoading(false);
      }
    })();
  }, []);

  const handlePushToggle = async (enabled: boolean) => {
    setPushEnabled(enabled);
    try {
      await setPushPreference(enabled);
      if (enabled) {
        await startPushNotifications();
      } else {
        stopPushNotifications();
      }
    } catch {
      setPushEnabled(!enabled);
      Alert.alert('Error', 'Could not update notification preference');
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          stopPushNotifications();
          await apiLogout();
          dispatch(logoutAction());
          const root = navigation.getParent()?.getParent();
          root?.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            }),
          );
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Settings" onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProfileEdit')}>
            <TauMailUserAvatar name={user?.name} avatarUrl={user?.avatarUrl} size={48} />
            <View style={styles.cardText}>
              <Text style={styles.title}>{user?.name || 'Tau user'}</Text>
              {profileLoading ? (
                <ActivityIndicator color={tokens.colors.gold} />
              ) : (
                <Text style={styles.subtitle}>{profileEmail}</Text>
              )}
              <Text style={styles.editHint}>Tap to edit profile</Text>
            </View>
            <View style={styles.chevronWrap}>
              <TauMailIcon name="chevronLeft" size={16} color={tokens.colors.textTertiary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <View style={styles.cardText}>
              <Text style={styles.title}>Push notifications</Text>
              <Text style={styles.subtitle}>
                {remotePush
                  ? 'Instant alerts via Firebase Cloud Messaging'
                  : 'Checks for new mail every 60 seconds and shows a banner alert'}
              </Text>
            </View>
            {pushLoading ? (
              <ActivityIndicator color={tokens.colors.gold} />
            ) : (
              <Switch
                value={pushEnabled}
                onValueChange={handlePushToggle}
                trackColor={{ false: tokens.colors.border, true: tokens.colors.goldBorder }}
                thumbColor={pushEnabled ? tokens.colors.gold : tokens.colors.textTertiary}
              />
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.signOut} onPress={handleLogout}>
          <TauMailIcon name="arrowUpRight" size={22} color={tokens.colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>TauMail Mobile v0.1 · Phase 3 beta</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { color: tokens.colors.gold, fontWeight: '700', marginBottom: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.pageSecondary,
    padding: 16,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    gap: 12,
  },
  cardText: { flex: 1 },
  title: { color: tokens.colors.textPrimary, fontSize: 16, fontWeight: '600' },
  subtitle: { color: tokens.colors.textSecondary, marginTop: 4, fontSize: 13 },
  editHint: { color: tokens.colors.gold, marginTop: 6, fontSize: 12, fontWeight: '500' },
  chevronWrap: { transform: [{ scaleX: -1 }] },
  signOut: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    marginTop: 32,
    padding: 16,
    borderRadius: tokens.radius.lg,
    backgroundColor: 'rgba(239,68,68,0.1)',
    gap: 8,
  },
  signOutText: { color: tokens.colors.danger, fontWeight: '600', fontSize: 16 },
  version: { textAlign: 'center', color: tokens.colors.textTertiary, fontSize: 12, marginBottom: 24 },
});

export default SettingsScreen;
