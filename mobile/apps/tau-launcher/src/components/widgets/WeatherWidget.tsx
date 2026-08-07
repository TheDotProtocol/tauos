import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { tauTheme } from '@tau/mobile-design';

const { colors, typography, radii, spacing, shadows } = tauTheme;

/** Figma placeholder weather — static copy, no network (M7.1) */
export function WeatherWidget(): React.JSX.Element {
  return (
    <LinearGradient
      colors={[
        colors.surface.weatherGradientStart,
        colors.surface.weatherGradientEnd,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, shadows.widget]}>
      <View style={styles.header}>
        <Text style={styles.title}>Weather</Text>
        <Text style={styles.icon}>🌤️</Text>
      </View>
      <Text style={styles.content}>72°</Text>
      <Text style={styles.subtitle}>San Francisco</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radii.widget,
    borderWidth: 1,
    borderColor: colors.border.glass,
    padding: spacing.screen,
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
