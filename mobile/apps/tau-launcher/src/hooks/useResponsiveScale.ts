import { useWindowDimensions } from 'react-native';
import { tauTheme } from '@tau/mobile-design';

/** Scale factor clamped for reference devices (Redmi Note 9 Pro baseline) */
export function useResponsiveScale(): number {
  const { width } = useWindowDimensions();
  const ref = tauTheme.layout.referenceWidth;
  return Math.min(Math.max(width / ref, 0.85), 1.15);
}
