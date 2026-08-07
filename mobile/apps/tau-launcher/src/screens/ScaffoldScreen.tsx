/**
 * M7.0 — Scaffold screen proving design tokens + gradient background.
 * Full TauHomeScreen layout begins in M7.1.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tauTheme } from '@tau/mobile-design';

const { colors, spacing, typography, radii } = tauTheme;

export function ScaffoldScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.background.gradientStart, colors.background.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.root}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + spacing.statusBarVertical,
            paddingBottom: insets.bottom + spacing.screen,
            paddingHorizontal: spacing.screen,
          },
        ]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>M7.0</Text>
        </View>
        <Text style={styles.title}>Tau Launcher</Text>
        <Text style={styles.caption}>
          Design system connected — Figma tokens active
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.surface.glass,
    borderColor: colors.border.glass,
    borderWidth: 1,
    borderRadius: radii.widget,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
  },
  badgeText: {
    ...typography.widgetTitle,
    color: colors.primary.start,
  },
  title: {
    ...typography.scaffoldTitle,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  caption: {
    ...typography.scaffoldCaption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
