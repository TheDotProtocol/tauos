import React from 'react';
import { View, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const { width, height } = Dimensions.get('window');

// Haptic feedback hook
const useHapticFeedback = () => {
  const trigger = (type: 'impactLight' | 'impactMedium' | 'impactHeavy') => {
    ReactNativeHapticFeedback.trigger(type);
  };
  return { trigger };
};

// Custom Gesture Hook for Swipe Actions
export const useSwipeGesture = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold: number = 100
) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const hapticFeedback = useHapticFeedback();

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const { translationX, translationY, velocityX, velocityY } = event;

      // Horizontal swipe detection
      if (Math.abs(translationX) > threshold) {
        if (translationX > 0 && onSwipeRight) {
          hapticFeedback.trigger('impactHeavy');
          runOnJS(onSwipeRight)();
        } else if (translationX < 0 && onSwipeLeft) {
          hapticFeedback.trigger('impactHeavy');
          runOnJS(onSwipeLeft)();
        }
      }

      // Vertical swipe detection
      if (Math.abs(translationY) > threshold) {
        if (translationY > 0 && onSwipeDown) {
          hapticFeedback.trigger('impactMedium');
          runOnJS(onSwipeDown)();
        } else if (translationY < 0 && onSwipeUp) {
          hapticFeedback.trigger('impactMedium');
          runOnJS(onSwipeUp)();
        }
      }

      // Reset position with spring animation
      translateX.value = withSpring(0, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return { gesture, animatedStyle };
};

// Pinch to Zoom Gesture Hook
export const usePinchGesture = (
  onZoomChange?: (scale: number) => void,
  minScale: number = 0.5,
  maxScale: number = 3.0
) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const hapticFeedback = useHapticFeedback();

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.min(Math.max(newScale, minScale), maxScale);
      
      if (onZoomChange) {
        runOnJS(onZoomChange)(scale.value);
      }
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      } else if (scale.value > maxScale) {
        scale.value = withSpring(maxScale);
        savedScale.value = maxScale;
      }
      
      hapticFeedback.trigger('impactLight');
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { pinchGesture, animatedStyle, scale };
};

// Long Press Gesture Hook
export const useLongPressGesture = (
  onLongPress?: () => void,
  duration: number = 500
) => {
  const hapticFeedback = useHapticFeedback();

  const longPressGesture = Gesture.LongPress()
    .minDuration(duration)
    .onStart(() => {
      hapticFeedback.trigger('impactMedium');
      if (onLongPress) {
        runOnJS(onLongPress)();
      }
    });

  return { longPressGesture };
};

// Double Tap Gesture Hook
export const useDoubleTapGesture = (onDoubleTap?: () => void) => {
  const hapticFeedback = useHapticFeedback();

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      hapticFeedback.trigger('impactLight');
      if (onDoubleTap) {
        runOnJS(onDoubleTap)();
      }
    });

  return { doubleTapGesture };
};

// Pull to Refresh Gesture Hook
export const usePullToRefreshGesture = (
  onRefresh?: () => void,
  threshold: number = 100
) => {
  const translateY = useSharedValue(0);
  const isRefreshing = useSharedValue(false);
  const hapticFeedback = useHapticFeedback();

  const pullToRefreshGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0 && !isRefreshing.value) {
        translateY.value = event.translationY * 0.5;
      }
    })
    .onEnd((event) => {
      if (event.translationY > threshold && !isRefreshing.value) {
        isRefreshing.value = true;
        hapticFeedback.trigger('impactMedium');
        
        if (onRefresh) {
          runOnJS(onRefresh)();
        }
        
        // Simulate refresh completion
        setTimeout(() => {
          isRefreshing.value = false;
          translateY.value = withSpring(0);
        }, 2000);
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return { pullToRefreshGesture, animatedStyle, isRefreshing };
};

// Enhanced Swipeable Component
export const SwipeableItem: React.FC<{
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  style?: any;
}> = ({ children, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, style }) => {
  const { gesture, animatedStyle } = useSwipeGesture(
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  );

  return (
    <GestureDetector gesture={gesture}>
      <Reanimated.View style={[animatedStyle, style]}>
        {children}
      </Reanimated.View>
    </GestureDetector>
  );
};

// Zoomable Component
export const ZoomableItem: React.FC<{
  children: React.ReactNode;
  onZoomChange?: (scale: number) => void;
  style?: any;
}> = ({ children, onZoomChange, style }) => {
  const { pinchGesture, animatedStyle } = usePinchGesture(onZoomChange);

  return (
    <GestureDetector gesture={pinchGesture}>
      <Reanimated.View style={[animatedStyle, style]}>
        {children}
      </Reanimated.View>
    </GestureDetector>
  );
};

// Long Pressable Component
export const LongPressableItem: React.FC<{
  children: React.ReactNode;
  onLongPress?: () => void;
  duration?: number;
  style?: any;
}> = ({ children, onLongPress, duration = 500, style }) => {
  const { longPressGesture } = useLongPressGesture(onLongPress, duration);

  return (
    <GestureDetector gesture={longPressGesture}>
      <View style={style}>
        {children}
      </View>
    </GestureDetector>
  );
};

// Double Tappable Component
export const DoubleTappableItem: React.FC<{
  children: React.ReactNode;
  onDoubleTap?: () => void;
  style?: any;
}> = ({ children, onDoubleTap, style }) => {
  const { doubleTapGesture } = useDoubleTapGesture(onDoubleTap);

  return (
    <GestureDetector gesture={doubleTapGesture}>
      <View style={style}>
        {children}
      </View>
    </GestureDetector>
  );
};

// Pull to Refresh Component
export const PullToRefreshContainer: React.FC<{
  children: React.ReactNode;
  onRefresh?: () => void;
  style?: any;
}> = ({ children, onRefresh, style }) => {
  const { pullToRefreshGesture, animatedStyle } = usePullToRefreshGesture(onRefresh);

  return (
    <GestureDetector gesture={pullToRefreshGesture}>
      <Reanimated.View style={[animatedStyle, style]}>
        {children}
      </Reanimated.View>
    </GestureDetector>
  );
};

// Combined Gesture Component
export const MultiGestureItem: React.FC<{
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  style?: any;
}> = ({ children, onSwipeLeft, onSwipeRight, onLongPress, onDoubleTap, style }) => {
  const { gesture: swipeGesture, animatedStyle: swipeStyle } = useSwipeGesture(
    onSwipeLeft,
    onSwipeRight
  );
  const { longPressGesture } = useLongPressGesture(onLongPress);
  const { doubleTapGesture } = useDoubleTapGesture(onDoubleTap);

  const combinedGesture = Gesture.Race(swipeGesture, longPressGesture, doubleTapGesture);

  return (
    <GestureDetector gesture={combinedGesture}>
      <Reanimated.View style={[swipeStyle, style]}>
        {children}
      </Reanimated.View>
    </GestureDetector>
  );
};

export default {
  useSwipeGesture,
  usePinchGesture,
  useLongPressGesture,
  useDoubleTapGesture,
  usePullToRefreshGesture,
  SwipeableItem,
  ZoomableItem,
  LongPressableItem,
  DoubleTappableItem,
  PullToRefreshContainer,
  MultiGestureItem,
}; 