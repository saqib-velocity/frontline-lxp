import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes, radii } from '@/constants/tokens';
import type { LearningCourse, DueDateStatus } from '@/types/course';

interface CourseListItemProps {
  course: LearningCourse;
  onPress?: () => void;
  showDivider?: boolean;
}

const DUE_BADGE: Record<
  Exclude<DueDateStatus, 'none'>,
  { bg: string; text: string; icon: React.ComponentProps<typeof Ionicons>['name'] }
> = {
  overdue: { bg: '#FEE2E2', text: '#DC2626', icon: 'alert-circle' },
  warning: { bg: '#FFF7ED', text: '#EA580C', icon: 'warning' },
  due:     { bg: '#F3F4F6', text: '#374151', icon: 'calendar-outline' },
};

export function CourseListItem({
  course,
  onPress,
  showDivider = true,
}: CourseListItemProps) {
  const badge =
    course.dueDateStatus && course.dueDateStatus !== 'none'
      ? DUE_BADGE[course.dueDateStatus]
      : null;

  return (
    <>
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        activeOpacity={0.75}
      >
        {/* Thumbnail */}
        <View style={styles.thumb}>
          {course.thumbnail ? (
            <Image
              source={{ uri: course.thumbnail }}
              style={styles.thumbImg}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <Ionicons name="image-outline" size={20} color={colors.gray[300]} />
            </View>
          )}
        </View>

        {/* Text content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>{course.progress ?? '00/00'}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Ionicons name="time-outline" size={12} color={colors.gray[400]} />
            <Text style={styles.metaText}>{course.duration}</Text>
          </View>
          {badge && course.dueDate && (
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Ionicons name={badge.icon} size={12} color={badge.text} />
              <Text style={[styles.badgeLabel, { color: badge.text }]}>
                {course.dueDate}
              </Text>
            </View>
          )}
        </View>

        <Ionicons name="chevron-forward" size={18} color={colors.gray[300]} />
      </TouchableOpacity>

      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: colors.white,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    flexShrink: 0,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: fontSizes.base * 1.35,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: fontSizes.xs,
    color: colors.gray[500],
  },
  metaDot: {
    fontSize: fontSizes.xs,
    color: colors.gray[300],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  badgeLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginHorizontal: 16,
  },
});
