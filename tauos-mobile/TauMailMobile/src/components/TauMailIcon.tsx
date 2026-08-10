import React from 'react';
import { SvgXml } from 'react-native-svg';
import { iconSources, type TauMailIconName } from './iconSources';

type TauMailIconProps = {
  name: TauMailIconName;
  size?: number;
  color?: string;
};

function prepareSvg(svg: string, color: string): string {
  return svg
    .replace(/stroke="#[^"]+"/g, `stroke="${color}"`)
    .replace(/fill="(?!none|white)[^"]+"/g, `fill="${color}"`);
}

export function TauMailIcon({ name, size = 16, color = '#A1A1AA' }: TauMailIconProps) {
  const xml = prepareSvg(iconSources[name], color);
  return <SvgXml xml={xml} width={size} height={size} />;
}
