import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tauTheme } from '@tau/mobile-design';
import { useFormattedClock } from '../hooks/useFormattedClock';

const { colors, spacing, typography } = tauTheme;

type Props = {
  scale: number;
};

/** Figma status row — time, privacy pill, connectivity placeholders */
export function StatusBarArea({ scale }: Props): React.JSX.Element {
  const { time } = useFormattedClock();

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={[styles.statusTime, { fontSize: typography.statusTime.fontSize * scale }]}>
          {time}
        </Text>
        <View style={styles.privacy}>
          <View style={styles.privacyDot} />
          <Text style={styles.privacyLabel}>Private</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.statusIcon}>📶</Text>
        <Text style={styles.statusIcon}>📶</Text>
        <Text style={[styles.statusTime, { fontSize: typography.statusTime.fontSize * scale }]}>
          🔋 87%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.statusBarVertical,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusTime: {
    ...typography.statusTime,
    color: colors.text.primary,
  },
  statusIcon: {
    ...typography.navIcon,
    color: colors.text.primary,
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.privacyGap,
  },
  privacyDot: {
    width: spacing.privacyDotSize,
    height: spacing.privacyDotSize,
    borderRadius: spacing.privacyDotSize / 2,
    backgroundColor: colors.privacy.active,
  },
  privacyLabel: {
    ...typography.privacyLabel,
    color: colors.privacy.active,
  },
});
