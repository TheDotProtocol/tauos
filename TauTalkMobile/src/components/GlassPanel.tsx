import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii } from '../theme';

type Props = PropsWithChildren<{
  style?: ViewStyle;
  strong?: boolean;
}>;

export default function GlassPanel({ children, style, strong }: Props) {
  return (
    <View style={[styles.base, strong ? styles.strong : styles.soft, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  soft: {
    backgroundColor: colors.glass,
  },
  strong: {
    backgroundColor: colors.surfaceStrong,
  },
});
