import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tauMailMobileTokens as t } from '@tau/taumail-mobile-client';

export function OfflineBanner() {
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>You&apos;re offline. Mail will retry when connected.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: t.colors.offlineBanner,
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
  },
  text: {
    color: t.colors.textPrimary,
    fontSize: t.typography.caption,
    textAlign: 'center',
  },
});
