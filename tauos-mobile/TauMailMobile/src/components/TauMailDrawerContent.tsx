import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { fetchProfile, tokens } from '@tau/taumail-mobile-client';
import { RootState } from '../store';
import { TauMailLogo } from './TauMailLogo';
import { TauMailIcon } from './TauMailIcon';
import { TauMailUserAvatar } from './TauMailUserAvatar';
import { tauMailMobileNavItems, type TauMailMobileNavId } from '../navigation/navItems';

function getActiveNavId(props: DrawerContentComponentProps): TauMailMobileNavId {
  const drawerRoute = props.state.routes[props.state.index];
  const stackState = drawerRoute.state;
  if (!stackState) return 'inbox';

  const focused = stackState.routes[stackState.index ?? 0];
  if (focused.name === 'MailFolder') {
    return (focused.params?.folder as TauMailMobileNavId) ?? 'inbox';
  }
  if (focused.name === 'Dashboard') return 'dashboard';
  if (focused.name === 'Settings') return 'settings';
  if (focused.name === 'AiAssistant') return 'ai';
  if (focused.name === 'Compose') return 'compose';
  if (focused.name === 'Calendar') return 'calendar';
  if (focused.name === 'Contacts') return 'contacts';
  if (focused.name === 'Tasks') return 'tasks';
  if (focused.name === 'Notifications') return 'notifications';
  if (focused.name === 'Storage') return 'storage';
  return 'inbox';
}

export function TauMailDrawerContent(props: DrawerContentComponentProps) {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(user?.avatarUrl ?? null);
  const activeId = getActiveNavId(props);

  useEffect(() => {
    fetchProfile()
      .then((profile) => {
        setProfileEmail(profile.email);
        setProfileAvatar(profile.avatarUrl ?? null);
      })
      .catch(() => undefined);
  }, []);

  const handleNavPress = (item: (typeof tauMailMobileNavItems)[number]) => {
    const { target } = item;
    if (target.kind === 'folder') {
      navigation.navigate('AppRoot', {
        screen: 'MailFolder',
        params: { folder: target.folder, title: target.title },
      });
    } else {
      navigation.navigate('AppRoot', { screen: target.screen });
    }
    navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 12) + 8 }]}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.logoRow}
        onPress={() => {
          navigation.navigate('AppRoot', {
            screen: 'MailFolder',
            params: { folder: 'inbox', title: 'Inbox' },
          });
          navigation.closeDrawer();
        }}
      >
        <TauMailLogo size={32} />
      </TouchableOpacity>

      <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
        {tauMailMobileNavItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => handleNavPress(item)}
              activeOpacity={0.7}
            >
              <TauMailIcon
                name={item.icon}
                size={16}
                color={isActive ? tokens.colors.textPrimary : tokens.colors.textSecondary}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
              {isActive ? <TauMailIcon name="ellipseGold" size={6} color={tokens.colors.gold} /> : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.divider} />
        <View style={styles.userRow}>
          <TauMailUserAvatar name={user?.name} avatarUrl={profileAvatar} size={32} />
          <View style={styles.userText}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'Account'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {profileEmail}
            </Text>
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.pagePrimary,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  logoRow: {
    marginBottom: 24,
  },
  nav: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 2,
  },
  navItemActive: {
    backgroundColor: tokens.colors.goldSurface,
    borderColor: tokens.colors.goldBorder,
  },
  navLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: tokens.colors.textSecondary,
  },
  navLabelActive: {
    color: tokens.colors.textPrimary,
    fontWeight: '600',
  },
  footer: {
    marginTop: 16,
    gap: 16,
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    opacity: 0.6,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: tokens.colors.goldSurface,
    borderWidth: 1,
    borderColor: tokens.colors.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: tokens.colors.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  userText: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  userEmail: {
    fontSize: 11,
    color: tokens.colors.textTertiary,
    marginTop: 2,
  },
});
