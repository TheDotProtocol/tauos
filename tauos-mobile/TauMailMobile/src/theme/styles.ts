import { StyleSheet } from 'react-native';
import { tauMailMobileTokens as t } from '@tau/taumail-mobile-client';

export const appStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: t.colors.pageBase,
  },
  card: {
    backgroundColor: t.colors.pageSecondary,
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  goldText: {
    color: t.colors.gold,
  },
  primaryText: {
    color: t.colors.textPrimary,
  },
  secondaryText: {
    color: t.colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: t.colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});

export { t as tokens };
