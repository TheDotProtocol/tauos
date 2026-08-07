import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { tauTheme } from '@tau/mobile-design';

const { colors, spacing, radii, shadows } = tauTheme;

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'weather';
};

/** Figma glass widget surface — token-based (blur fallback: translucent fill) */
export function GlassSurface({
  children,
  style,
  variant = 'default',
}: Props): React.JSX.Element {
  const backgroundStyle =
    variant === 'weather'
      ? styles.weatherSurface
      : styles.defaultSurface;

  return (
    <View style={[styles.base, backgroundStyle, shadows.widget, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.widget,
    borderWidth: 1,
    borderColor: colors.border.glass,
    padding: spacing.screen,
    overflow: 'hidden',
  },
  defaultSurface: {
    backgroundColor: colors.surface.glass,
  },
  weatherSurface: {
    backgroundColor: colors.surface.glass,
    borderColor: colors.border.glass,
  },
});
