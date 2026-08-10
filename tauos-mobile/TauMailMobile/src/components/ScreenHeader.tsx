import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { tokens } from '@tau/taumail-mobile-client';
import { TauMailIcon } from './TauMailIcon';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onMenuPress: () => void;
  rightAction?: React.ReactNode;
};

export function ScreenHeader({ title, subtitle, onMenuPress, rightAction }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onMenuPress}
        style={styles.menuBtn}
        accessibilityLabel="Open menu"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <TauMailIcon name="list" size={20} color={tokens.colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.titles}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 4,
  },
  menuBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  rightAction: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
