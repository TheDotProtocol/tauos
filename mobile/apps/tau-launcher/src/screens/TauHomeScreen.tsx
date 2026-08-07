import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tauTheme } from '@tau/mobile-design';
import { SearchBar } from '../components/SearchBar';
import { AppIconGrid } from '../components/AppIconGrid';
import { useResponsiveScale } from '../hooks/useResponsiveScale';

const { colors, spacing } = tauTheme;

/**
 * M7.1 — Figma Home Screen (Section 2 Launcher, frame 2)
 * Source: Tau Core Mobile OS UI — NOT HTML mockups
 */
export function TauHomeScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const scale = useResponsiveScale();

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom,
          paddingHorizontal: spacing.screen,
        },
      ]}>
      <SearchBar />
      <AppIconGrid scale={scale} />
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.launcher.screen,
  },
  spacer: {
    flex: 1,
  },
});
