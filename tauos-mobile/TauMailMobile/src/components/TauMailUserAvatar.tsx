import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { tokens } from '@tau/taumail-mobile-client';
import { resolveAvatarUrl } from '../utils/resolveAvatarUrl';

type TauMailUserAvatarProps = {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  size?: number;
};

function getInitials(name?: string): string {
  if (!name) return 'T';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function TauMailUserAvatar({ name, avatarUrl, size = 32 }: TauMailUserAvatarProps) {
  const [failed, setFailed] = useState(false);
  const resolved = !failed ? resolveAvatarUrl(avatarUrl) : null;
  const radius = size >= 32 ? 10 : size / 2;

  if (resolved) {
    return (
      <View
        style={[
          styles.imageWrap,
          { width: size, height: size, borderRadius: radius },
        ]}
      >
        <Image
          source={{ uri: resolved }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: radius }]}>
      <Text style={[styles.initials, { fontSize: Math.max(10, size * 0.34) }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrap: {
    overflow: 'hidden',
    backgroundColor: tokens.colors.pageSecondary,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    backgroundColor: tokens.colors.pageSecondary,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: tokens.colors.gold,
    fontWeight: '700',
  },
});
