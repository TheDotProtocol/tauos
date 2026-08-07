import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tauTheme } from '@tau/mobile-design';
import { GlassSurface } from '../GlassSurface';
import { useFormattedClock } from '../../hooks/useFormattedClock';

const { colors, typography } = tauTheme;

type Props = { scale: number };

export function TimeWidget({ scale }: Props): React.JSX.Element {
  const { time, date } = useFormattedClock();

  return (
    <GlassSurface style={styles.fullWidth}>
      <Text
        style={[
          styles.time,
          {
            fontSize: typography.timeDisplay.fontSize * scale,
            lineHeight: typography.timeDisplay.lineHeight * scale,
          },
        ]}>
        {time}
      </Text>
      <Text style={styles.date}>{date}</Text>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
    alignItems: 'center',
  },
  time: {
    ...typography.timeDisplay,
    color: colors.text.primary,
    marginBottom: tauTheme.spacing.xs,
  },
  date: {
    ...typography.dateDisplay,
    color: colors.text.secondary,
  },
});
