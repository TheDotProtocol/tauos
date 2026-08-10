import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { tokens } from '@tau/taumail-mobile-client';
import { TauMailIcon } from './TauMailIcon';
import type { TauMailIconName } from './iconSources';

export type MobileTabId = 'home' | 'inbox' | 'compose' | 'calendar' | 'more';

type TauMailMobileTabBarProps = {
  active: MobileTabId;
  navigation: any;
};

const tabs: { id: MobileTabId; label: string; icon: TauMailIconName }[] = [
  { id: 'home', label: 'Home', icon: 'chartColumn' },
  { id: 'inbox', label: 'Inbox', icon: 'mail' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'more', label: 'More', icon: 'list' },
];

export function TauMailMobileTabBar({ active, navigation }: TauMailMobileTabBarProps) {
  const go = (tab: MobileTabId) => {
    switch (tab) {
      case 'home':
        navigation.navigate('Dashboard');
        break;
      case 'inbox':
        navigation.navigate('MailFolder', { folder: 'inbox', title: 'Inbox' });
        break;
      case 'compose':
        navigation.navigate('Compose');
        break;
      case 'calendar':
        navigation.navigate('Calendar');
        break;
      case 'more':
        navigation.dispatch(DrawerActions.openDrawer());
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.bar}>
      {tabs.slice(0, 2).map((tab) => {
        const isActive = active === tab.id;
        return (
          <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => go(tab.id)}>
            <TauMailIcon
              name={tab.icon}
              size={20}
              color={isActive ? tokens.colors.gold : tokens.colors.textTertiary}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity style={styles.composeBtn} onPress={() => go('compose')}>
        <TauMailIcon name="plus" size={22} color={tokens.colors.pageBase} />
      </TouchableOpacity>

      {tabs.slice(2).map((tab) => {
        const isActive = active === tab.id;
        return (
          <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => go(tab.id)}>
            <TauMailIcon
              name={tab.icon}
              size={20}
              color={isActive ? tokens.colors.gold : tokens.colors.textTertiary}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.pagePrimary,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingBottom: 4,
  },
  label: {
    fontSize: 11,
    color: tokens.colors.textTertiary,
    fontWeight: '500',
  },
  labelActive: {
    color: tokens.colors.gold,
    fontWeight: '600',
  },
  composeBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: tokens.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginHorizontal: 4,
  },
});
