import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  name: string;
  size?: number;
  gold?: boolean;
  imageUrl?: string | null;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Avatar({ name, size = 48, gold = false, imageUrl }: Props) {
  const fontSize = Math.max(14, Math.floor(size * 0.36));
  const inner = size - 4;

  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: gold ? colors.gold : colors.glassBorder,
        },
      ]}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: inner, height: inner, borderRadius: inner / 2 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.fill,
            { width: inner, height: inner, borderRadius: inner / 2 },
          ]}>
          <Text style={[styles.text, { fontSize }]}>{initials(name)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.goldLight,
    fontWeight: '700',
  },
});
