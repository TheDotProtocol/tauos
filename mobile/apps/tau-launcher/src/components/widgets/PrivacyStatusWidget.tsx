import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tauTheme } from '@tau/mobile-design';
import { GlassSurface } from '../GlassSurface';

const { colors, typography, spacing } = tauTheme;

export function PrivacyStatusWidget(): React.JSX.Element {
  return (
    <GlassSurface style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy Status</Text>
        <Text style={styles.icon}>🔒</Text>
      </View>
      <Text style={styles.content}>Secure</Text>
      <Text style={styles.subtitle}>Zero telemetry active</Text>
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
  content: {
    ...typography.widgetContent,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.widgetSubtitle,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
