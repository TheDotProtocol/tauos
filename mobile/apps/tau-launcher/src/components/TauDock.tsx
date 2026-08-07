import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tauTheme } from '@tau/mobile-design';

const { colors, typography, spacing, layout } = tauTheme;

type DockTab = {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
};

const DOCK_TABS: DockTab[] = [
  { id: 'taumail', icon: '📧', label: 'TauMail', active: true },
  { id: 'taucloud', icon: '☁️', label: 'TauCloud' },
  { id: 'tauid', icon: '🆔', label: 'TauID' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

/** Figma bottom dock — static visual only (M7.1, no navigation) */
export function TauDock(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.dock,
        {
          paddingBottom: insets.bottom + spacing.navPaddingBottom,
        },
      ]}>
      <View style={styles.tabs}>
        {DOCK_TABS.map(tab => (
          <View key={tab.id} style={styles.tab}>
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                tab.active && styles.tabLabelActive,
              ]}>
              {tab.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface.glassStrong,
    borderTopWidth: 1,
    borderTopColor: colors.border.nav,
    paddingTop: spacing.navPaddingTop,
    minHeight: layout.dockHeight,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  tabIcon: {
    ...typography.navIcon,
    color: colors.text.primary,
  },
  tabLabel: {
    ...typography.navLabel,
    color: colors.text.secondary,
  },
  tabLabelActive: {
    color: colors.primary.start,
  },
});
