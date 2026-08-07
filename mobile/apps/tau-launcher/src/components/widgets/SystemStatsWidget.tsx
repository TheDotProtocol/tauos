import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tauTheme } from '@tau/mobile-design';
import { GlassSurface } from '../GlassSurface';

const { colors, typography, spacing } = tauTheme;

const STATS = [
  { label: 'Battery', value: '87%' },
  { label: 'Memory', value: '2.1GB' },
  { label: 'Storage', value: '45GB' },
] as const;

export function SystemStatsWidget(): React.JSX.Element {
  return (
    <GlassSurface style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>System</Text>
        <Text style={styles.icon}>⚡</Text>
      </View>
      <View style={styles.statsRow}>
        {STATS.map(stat => (
          <View key={stat.label} style={styles.stat}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: spacing.xxxl * 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.widgetTitle,
    color: colors.text.secondary,
  },
  icon: {
    fontSize: typography.widgetTitle.fontSize + 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  statValue: {
    ...typography.statValue,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.statLabel,
    color: colors.text.secondary,
  },
});
