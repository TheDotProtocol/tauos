import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { tokens } from '@tau/taumail-mobile-client';

const logoIcon = require('../../assets/brand/logo-icon.png');

type TauMailLogoProps = {
  size?: number;
  showWordmark?: boolean;
  style?: ViewStyle;
};

export function TauMailLogo({ size = 36, showWordmark = true, style }: TauMailLogoProps) {
  return (
    <View style={[styles.row, style]}>
      <Image source={logoIcon} style={{ width: size, height: size, borderRadius: 8 }} resizeMode="contain" />
      {showWordmark ? (
        <Text style={[styles.wordmark, { fontSize: size * 0.55 }]}>
          Tau<Text style={styles.gold}>Mail</Text>
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  gold: {
    color: tokens.colors.gold,
  },
});
