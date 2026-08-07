import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tauTheme } from '@tau/mobile-design';

const { colors, typography, spacing, radii } = tauTheme;

/** Figma Home — search field (static, no input logic M7.1) */
export function SearchBar(): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={styles.icon}>⌕</Text>
      <Text style={styles.placeholder}>Search apps</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: tauTheme.layout.launcher.searchHeight,
    backgroundColor: colors.launcher.searchField,
    borderWidth: 1,
    borderColor: colors.launcher.searchBorder,
    borderRadius: radii.search,
    paddingHorizontal: spacing.searchHorizontal,
    gap: spacing.sm,
  },
  icon: {
    fontSize: typography.searchPlaceholder.fontSize + 2,
    color: colors.text.muted,
  },
  placeholder: {
    ...typography.searchPlaceholder,
    color: colors.launcher.searchPlaceholder,
    flex: 1,
  },
});
