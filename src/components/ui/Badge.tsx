import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, fontSizes } from '@/constants/tokens';

type BadgeColor = 'green' | 'yellow' | 'red' | 'gray';

interface BadgeProps {
  label: string;
  color?: BadgeColor;
  dot?: boolean;
}

const colorMap: Record<BadgeColor, { bg: string; text: string; dot: string }> = {
  green: { bg: colors.success.light, text: colors.success.DEFAULT, dot: colors.success.DEFAULT },
  yellow: { bg: colors.warning.light, text: colors.warning.DEFAULT, dot: colors.warning.DEFAULT },
  red: { bg: colors.error.light, text: colors.error.DEFAULT, dot: colors.error.DEFAULT },
  gray: { bg: colors.gray[100], text: colors.gray[500], dot: colors.gray[500] },
};

export function Badge({ label, color = 'gray', dot = true }: BadgeProps) {
  const palette = colorMap[color];
  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      {dot && (
        <View style={[styles.dot, { backgroundColor: palette.dot }]} />
      )}
      <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
});
