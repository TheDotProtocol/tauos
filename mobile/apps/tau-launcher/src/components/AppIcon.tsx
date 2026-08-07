import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tauTheme } from '@tau/mobile-design';

const { colors, typography, spacing, radii, layout } = tauTheme;

type Props = {
  label: string;
  glyph: string;
  scale: number;
};

/** Figma — circular gold app icon + label */
export function AppIcon({ label, glyph, scale }: Props): React.JSX.Element {
  const size = layout.launcher.iconSize * scale;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}>
        <Text
          style={[
            styles.glyph,
            { fontSize: typography.appIconGlyph.fontSize * scale },
          ]}>
          {glyph}
        </Text>
      </View>
      <Text
        style={[
          styles.label,
          { fontSize: typography.appIconLabel.fontSize * scale },
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flex: 1,
    gap: layout.launcher.iconLabelGap,
  },
  circle: {
    backgroundColor: colors.launcher.iconCircle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    ...typography.appIconGlyph,
    color: colors.launcher.iconGlyph,
  },
  label: {
    ...typography.appIconLabel,
    color: colors.launcher.iconLabel,
    textAlign: 'center',
  },
});
