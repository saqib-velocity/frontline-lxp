import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes, radii, shadows } from '@/constants/tokens';

interface ToastProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function Toast({ visible, title, message, onClose }: ToastProps) {
  const slideY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY, {
          toValue: 0,
          tension: 80,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: -120,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideY }], opacity },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {/* Green check */}
      <View style={styles.iconWrap}>
        <Ionicons name="checkmark-circle" size={22} color={colors.success.DEFAULT} />
      </View>

      {/* Text */}
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message} numberOfLines={3}>{message}</Text>
      </View>

      {/* Close */}
      <TouchableOpacity
        onPress={onClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.closeBtn}
      >
        <Ionicons name="close" size={18} color={colors.gray[400]} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: radii.md,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.card,
  },
  iconWrap: {
    marginTop: 1,
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.gray[900],
  },
  message: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
    lineHeight: fontSizes.sm * 1.5,
  },
  closeBtn: {
    flexShrink: 0,
    marginTop: 1,
  },
});
