import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSizes } from '@/constants/tokens';

interface CourseSectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
}

export function CourseSectionHeader({
  title,
  subtitle,
  onSeeAll,
}: CourseSectionHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.leftBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.seeAll}>See all →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  leftBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
    fontWeight: '400',
  },
  seeAll: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.success.DEFAULT,
    marginTop: 2,
  },
});
