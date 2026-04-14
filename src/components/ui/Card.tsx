import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, radii, shadows } from '@/constants/tokens';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export function Card({ children, noPadding = false, style, ...props }: CardProps) {
  return (
    <View
      style={[styles.card, !noPadding && styles.padding, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.card,
  },
  padding: {
    padding: 16,
  },
});
