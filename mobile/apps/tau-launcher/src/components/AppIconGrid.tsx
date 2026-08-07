import React from 'react';
import { StyleSheet, View } from 'react-native';
import { tauTheme } from '@tau/mobile-design';
import { AppIcon } from './AppIcon';

const { spacing, layout } = tauTheme;

/** Figma Home Screen — 4×2 app grid (Section 2 Launcher, frame 2) */
const FIGMA_APPS = [
  { id: 'ai-home', label: 'AI Home', glyph: 'τ' },
  { id: 'camera', label: 'Camera', glyph: '◉' },
  { id: 'calendar', label: 'Calendar', glyph: '▦' },
  { id: 'notes', label: 'Notes', glyph: '≡' },
  { id: 'home', label: 'Home', glyph: '⌂' },
  { id: 'browser', label: 'Browser', glyph: '◉' },
  { id: 'phone', label: 'Phone', glyph: '☎' },
  { id: 'messages', label: 'Messages', glyph: '✉' },
] as const;

type Props = { scale: number };

export function AppIconGrid({ scale }: Props): React.JSX.Element {
  const columns = layout.launcher.iconColumns;
  const rows: (typeof FIGMA_APPS)[number][][] = [];
  for (let i = 0; i < FIGMA_APPS.length; i += columns) {
    rows.push(FIGMA_APPS.slice(i, i + columns));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map(app => (
            <AppIcon
              key={app.id}
              label={app.label}
              glyph={app.glyph}
              scale={scale}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: layout.launcher.iconRowGap,
    marginTop: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
