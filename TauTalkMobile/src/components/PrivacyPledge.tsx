import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MIcon from './MIcon';
import { colors, radii } from '../theme';

type Props = {
  compact?: boolean;
};

const ITEMS = [
  { icon: 'lock', text: 'Your messages are end-to-end encrypted' },
  { icon: 'shield', text: 'Your data stays private — we cannot read your chats' },
  { icon: 'block', text: 'All telemetry blocked — no tracking SDKs' },
  { icon: 'map', text: 'Locations open in OpenStreetMap (no Google Maps)' },
] as const;

export default function PrivacyPledge({ compact }: Props) {
  const rows = compact ? ITEMS.slice(0, 2) : ITEMS;

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.header}>
        <MIcon name="verified-user" size={compact ? 16 : 18} color={colors.goldLight} />
        <Text style={[styles.title, compact && styles.titleCompact]}>Privacy by design</Text>
      </View>
      {rows.map((item) => (
        <View key={item.text} style={styles.row}>
          <MIcon name={item.icon} size={compact ? 14 : 16} color={colors.gold} family="material" />
          <Text style={[styles.line, compact && styles.lineCompact]}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 14,
    gap: 8,
  },
  wrapCompact: {
    padding: 10,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  title: {
    color: colors.goldLight,
    fontWeight: '800',
    fontSize: 14,
  },
  titleCompact: {
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  line: {
    flex: 1,
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 17,
  },
  lineCompact: {
    fontSize: 11,
    lineHeight: 15,
  },
});
