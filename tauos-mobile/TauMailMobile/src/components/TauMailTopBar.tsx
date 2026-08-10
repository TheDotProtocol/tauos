import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchProfile, tokens } from '@tau/taumail-mobile-client';
import { TauMailLogo } from './TauMailLogo';
import { TauMailIcon } from './TauMailIcon';
import { TauMailUserAvatar } from './TauMailUserAvatar';

type TauMailTopBarProps = {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
  onNotificationsPress?: () => void;
};

export function TauMailTopBar({
  userName,
  userEmail,
  avatarUrl: avatarUrlProp,
  onNotificationsPress,
}: TauMailTopBarProps) {
  const [profileAvatar, setProfileAvatar] = useState<string | null | undefined>(avatarUrlProp);

  useEffect(() => {
    fetchProfile()
      .then((profile) => setProfileAvatar(profile.avatarUrl ?? null))
      .catch(() => undefined);
  }, []);

  const avatarUrl = profileAvatar ?? avatarUrlProp ?? null;

  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <TauMailLogo size={28} showWordmark={false} />
        <Text style={styles.brandText}>
          Tau<Text style={styles.brandGold}>Mail</Text>
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn} onPress={onNotificationsPress}>
          <TauMailIcon name="bellRing" size={20} color={tokens.colors.textSecondary} />
          <View style={styles.dot} />
        </TouchableOpacity>
        <TauMailUserAvatar name={userName} email={userEmail} avatarUrl={avatarUrl} size={32} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  brandGold: {
    color: tokens.colors.gold,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: tokens.colors.gold,
    borderWidth: 1,
    borderColor: tokens.colors.pageBase,
  },
});
