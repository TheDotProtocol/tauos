import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LottieView from 'lottie-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// TauOS Color Palette
export const TauColors = {
  primary: '#667eea',
  secondary: '#1a1a1a',
  accent: '#ffffff',
  background: '#2a2a2a',
  surface: 'rgba(255,255,255,0.1)',
  success: '#4ade80',
  warning: '#fbbf24',
  error: '#f87171',
  text: '#ffffff',
  textSecondary: '#a1a1aa',
};

// Glassmorphism Styles
const glassmorphismStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.2)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.3,
  shadowRadius: 16,
  elevation: 8,
};

// Haptic feedback hook
const useHapticFeedback = () => {
  const trigger = (type: 'impactLight' | 'impactMedium' | 'impactHeavy') => {
    ReactNativeHapticFeedback.trigger(type);
  };
  return { trigger };
};

// Enhanced Primary Button with Glassmorphism
export const PrimaryButton: React.FC<{
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}> = ({ title, onPress, disabled = false, loading = false, style }) => {
  const scale = useSharedValue(1);
  const hapticFeedback = useHapticFeedback();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    hapticFeedback.trigger('impactLight');
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <GestureDetector
      gesture={Gesture.Pan()
        .onBegin(() => handlePressIn())
        .onFinalize(() => handlePressOut())}
    >
      <Reanimated.View style={[styles.primaryButton, animatedStyle, style]}>
        <LinearGradient
          colors={[TauColors.primary, '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={styles.buttonContent}
          >
            {loading ? (
              <LottieView
                source={require('../animations/loading.json')}
                autoPlay
                loop
                style={styles.loadingAnimation}
              />
            ) : (
              <Text style={styles.buttonText}>{title}</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </Reanimated.View>
    </GestureDetector>
  );
};

// Floating Action Button
export const FloatingActionButton: React.FC<{
  icon: string;
  onPress: () => void;
  style?: any;
}> = ({ icon, onPress, style }) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const hapticFeedback = useHapticFeedback();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 10 });
    rotation.value = withSpring(rotation.value + 90);
    hapticFeedback.trigger('impactMedium');
    onPress();
    setTimeout(() => {
      scale.value = withSpring(1);
    }, 100);
  };

  return (
    <Reanimated.View style={[styles.fab, animatedStyle, style]}>
      <LinearGradient
        colors={[TauColors.primary, '#8b5cf6']}
        style={styles.fabGradient}
      >
        <TouchableOpacity onPress={handlePress} style={styles.fabContent}>
          <Text style={styles.fabIcon}>{icon}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Reanimated.View>
  );
};

// Glassmorphism Card
export const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: any;
}> = ({ children, style }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withSpring(0, { damping: 15 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Reanimated.View style={[styles.glassCard, animatedStyle, style]}>
      <View style={styles.blurView}>
        {children}
      </View>
    </Reanimated.View>
  );
};

// Enhanced Input Field
export const TauInput: React.FC<{
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  style?: any;
}> = ({ placeholder, value, onChangeText, secureTextEntry = false, style }) => {
  const focusAnim = useSharedValue(0);
  const hapticFeedback = useHapticFeedback();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(focusAnim.value, [0, 1], [1, 1.02]) }],
  }));

  const handleFocus = () => {
    focusAnim.value = withTiming(1, { duration: 200 });
    hapticFeedback.trigger('impactLight');
  };

  const handleBlur = () => {
    focusAnim.value = withTiming(0, { duration: 200 });
  };

  return (
    <Reanimated.View style={[styles.inputContainer, animatedStyle, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={TauColors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Reanimated.View>
  );
};

// Loading Animation Component
export const TauLoading: React.FC<{
  size?: number;
  style?: any;
}> = ({ size = 100, style }) => {
  return (
    <View style={[styles.loadingContainer, style]}>
      <LottieView
        source={require('../animations/loading.json')}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    </View>
  );
};

// Progress Bar with Animation
export const TauProgressBar: React.FC<{
  progress: number;
  style?: any;
}> = ({ progress, style }) => {
  const progressAnim = useSharedValue(0);

  React.useEffect(() => {
    progressAnim.value = withTiming(progress, { duration: 1000 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  return (
    <View style={[styles.progressContainer, style]}>
      <Reanimated.View style={[styles.progressBar, animatedStyle]} />
    </View>
  );
};

// Swipeable Card
export const SwipeableCard: React.FC<{
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  style?: any;
}> = ({ children, onSwipeLeft, onSwipeRight, style }) => {
  const translateX = useSharedValue(0);
  const hapticFeedback = useHapticFeedback();

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > 100 && onSwipeRight) {
        translateX.value = withSpring(width);
        hapticFeedback.trigger('impactHeavy');
        onSwipeRight();
      } else if (event.translationX < -100 && onSwipeLeft) {
        translateX.value = withSpring(-width);
        hapticFeedback.trigger('impactHeavy');
        onSwipeLeft();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Reanimated.View style={[styles.swipeableCard, animatedStyle, style]}>
        {children}
      </Reanimated.View>
    </GestureDetector>
  );
};

// Styles
const styles = StyleSheet.create({
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
  },
  gradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: TauColors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingAnimation: {
    width: 24,
    height: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    ...glassmorphismStyle,
  },
  fabGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: TauColors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  glassCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...glassmorphismStyle,
  },
  blurView: {
    padding: 16,
  },
  inputContainer: {
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  input: {
    padding: 16,
    color: TauColors.text,
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  progressContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: TauColors.primary,
    borderRadius: 4,
  },
  swipeableCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...glassmorphismStyle,
  },
});

export default {
  PrimaryButton,
  FloatingActionButton,
  GlassCard,
  TauInput,
  TauLoading,
  TauProgressBar,
  SwipeableCard,
  TauColors,
}; 