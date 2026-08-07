import React from 'react';
import { StyleSheet, View } from 'react-native';
import { tauTheme } from '@tau/mobile-design';
import { TimeWidget } from './TimeWidget';
import { WeatherWidget } from './WeatherWidget';
import { PrivacyStatusWidget } from './PrivacyStatusWidget';
import { SystemStatsWidget } from './SystemStatsWidget';

const { spacing } = tauTheme;

type Props = { scale: number };

export function WidgetGrid({ scale }: Props): React.JSX.Element {
  return (
    <View style={styles.grid}>
      <TimeWidget scale={scale} />
      <View style={styles.row}>
        <View style={styles.cell}>
          <WeatherWidget />
        </View>
        <View style={styles.cell}>
          <PrivacyStatusWidget />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.cell}>
          <SystemStatsWidget />
        </View>
        <View style={styles.cell} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.widgetGap,
    marginVertical: spacing.screen,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.widgetGap,
  },
  cell: {
    flex: 1,
  },
});
