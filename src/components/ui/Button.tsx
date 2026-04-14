import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, radii, fontSizes } from '@/constants/tokens';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'pill' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  label,
  onPress,
  variant = 'pill',
  size = 'lg',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.base,
        styles[size],
        variant === 'pill' ? styles.pill : styles.outline,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.gray[900]} />
      ) : (
        <Text
          style={[
            styles.label,
            styles[`label_${size}` as keyof typeof styles],
            variant === 'outline' && styles.outlineLabel,
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  pill: {
    backgroundColor: colors.gray[100],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.gray[200],
  },
  disabled: {
    opacity: 0.5,
  },
  sm: { paddingVertical: 8, paddingHorizontal: 20 },
  md: { paddingVertical: 12, paddingHorizontal: 24 },
  lg: { paddingVertical: 16, paddingHorizontal: 32 },
  xl: { paddingVertical: 18, paddingHorizontal: 40 },
  label: {
    fontWeight: '600',
    color: colors.gray[900],
  },
  label_sm: { fontSize: fontSizes.sm },
  label_md: { fontSize: fontSizes.base },
  label_lg: { fontSize: fontSizes.lg },
  label_xl: { fontSize: fontSizes.xl },
  outlineLabel: {
    color: colors.gray[900],
  },
});
