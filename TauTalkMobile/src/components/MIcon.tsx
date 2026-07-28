import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';

type IconFamily = 'material' | 'community';

type Props = {
  name: string;
  size?: number;
  color?: string;
  family?: IconFamily;
  style?: object;
};

export default function MIcon({
  name,
  size = 24,
  color = colors.goldLight,
  family = 'material',
  style,
}: Props) {
  if (family === 'community') {
    return (
      <MaterialCommunityIcons name={name} size={size} color={color} style={style} />
    );
  }
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
}
