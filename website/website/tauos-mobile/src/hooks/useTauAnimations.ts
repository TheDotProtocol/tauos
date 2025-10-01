import { useSharedValue, withSpring, withTiming, interpolate, Extrapolate } from 'react-native-reanimated';

export const useTauAnimations = () => {
  const fadeIn = (duration: number = 500) => {
    const opacity = useSharedValue(0);
    opacity.value = withTiming(1, { duration });
    return opacity;
  };

  const slideIn = (direction: 'up' | 'down' | 'left' | 'right' = 'up', duration: number = 500) => {
    const translateY = useSharedValue(direction === 'up' ? 50 : direction === 'down' ? -50 : 0);
    const translateX = useSharedValue(direction === 'left' ? 50 : direction === 'right' ? -50 : 0);
    
    translateY.value = withSpring(0, { damping: 15 });
    translateX.value = withSpring(0, { damping: 15 });
    
    return { translateY, translateX };
  };

  const scaleIn = (duration: number = 300) => {
    const scale = useSharedValue(0.8);
    scale.value = withSpring(1, { damping: 15 });
    return scale;
  };

  const pulse = () => {
    const scale = useSharedValue(1);
    const pulseAnimation = () => {
      scale.value = withSpring(1.1, { damping: 10 });
      setTimeout(() => {
        scale.value = withSpring(1, { damping: 10 });
      }, 150);
    };
    return { scale, pulseAnimation };
  };

  return {
    fadeIn,
    slideIn,
    scaleIn,
    pulse,
  };
};
