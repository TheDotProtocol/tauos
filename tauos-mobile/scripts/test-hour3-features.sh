#!/bin/bash

echo "🧪 Testing Hour 3 Features"
echo "=========================="

# Test component library
echo "Testing component library..."
if [ -f "src/components/TauUIComponents.tsx" ]; then
    echo "✅ Component library exists"
else
    echo "❌ Component library missing"
fi

# Test animations
echo "Testing animations..."
if [ -f "src/animations/loading.json" ]; then
    echo "✅ Loading animation exists"
else
    echo "❌ Loading animation missing"
fi

# Test navigation
echo "Testing navigation..."
if [ -f "src/navigation/TauNavigation.tsx" ]; then
    echo "✅ Navigation system exists"
else
    echo "❌ Navigation system missing"
fi

# Test gestures
echo "Testing gestures..."
if [ -f "src/gestures/TauGestures.tsx" ]; then
    echo "✅ Gesture system exists"
else
    echo "❌ Gesture system missing"
fi

# Test accessibility
echo "Testing accessibility..."
if [ -f "src/accessibility/TauAccessibility.tsx" ]; then
    echo "✅ Accessibility system exists"
else
    echo "❌ Accessibility system missing"
fi

# Test theme
echo "Testing theme system..."
if [ -f "src/theme/TauTheme.ts" ]; then
    echo "✅ Theme system exists"
else
    echo "❌ Theme system missing"
fi

# Test hooks
echo "Testing animation hooks..."
if [ -f "src/hooks/useTauAnimations.ts" ]; then
    echo "✅ Animation hooks exist"
else
    echo "❌ Animation hooks missing"
fi

# Test performance monitoring
echo "Testing performance monitoring..."
if [ -f "src/utils/PerformanceMonitor.ts" ]; then
    echo "✅ Performance monitoring exists"
else
    echo "❌ Performance monitoring missing"
fi

echo "🎉 Hour 3 feature testing complete!"
