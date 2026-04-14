import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { colors, fontSizes, spacing } from '@/constants/tokens';
import type { TrainingPlan } from '@/types/course';

interface MandatoryTrainingCardProps {
  plan: TrainingPlan;
  onCoursesPress?: () => void;
  onEventsPress?: () => void;
  onStartHerePress?: () => void;
}

export function MandatoryTrainingCard({
  plan,
  onCoursesPress,
  onEventsPress,
  onStartHerePress,
}: MandatoryTrainingCardProps) {
  return (
    <Card style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.categoryLabel}>Mandatory training</Text>
        <Badge label={`Due ${plan.dueDate}`} color="green" dot />
      </View>

      {/* Status */}
      <Text style={styles.statusHeading}>{plan.status === 'on-track' ? 'On-Track' : plan.status}</Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statItem} onPress={onCoursesPress}>
          <View style={styles.statLabelRow}>
            <Ionicons name="document-text-outline" size={14} color={colors.gray[500]} />
            <Text style={styles.statLabel}>Courses</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.gray[300]} />
          </View>
          <Text style={styles.statValue}>
            <Text style={styles.statValueHighlight}>{plan.courses.completed}</Text>
            <Text style={styles.statValueTotal}> of {plan.courses.total}</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.statDivider} />

        <TouchableOpacity style={styles.statItem} onPress={onEventsPress}>
          <View style={styles.statLabelRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.gray[500]} />
            <Text style={styles.statLabel}>Events</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.gray[300]} />
          </View>
          <Text style={styles.statValueHighlight}>{plan.events}</Text>
        </TouchableOpacity>
      </View>

      {/* Start here section */}
      {plan.startHereCourse && (
        <View style={styles.startHereSection}>
          <Text style={styles.startHereLabel}>Start here</Text>
          <TouchableOpacity
            style={styles.courseItem}
            onPress={onStartHerePress}
            activeOpacity={0.8}
          >
            <View style={styles.courseThumbnail}>
              {plan.startHereCourse.thumbnail ? (
                <Image
                  source={{ uri: plan.startHereCourse.thumbnail }}
                  style={styles.thumbnailImage}
                />
              ) : (
                <View style={styles.thumbnailPlaceholder}>
                  <Ionicons name="fast-food-outline" size={20} color={colors.gray[300]} />
                </View>
              )}
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle} numberOfLines={2}>
                {plan.startHereCourse.title}
              </Text>
              <View style={styles.courseMeta}>
                <Text style={styles.metaText}>00/00</Text>
                <Text style={styles.metaDot}>·</Text>
                <Ionicons name="time-outline" size={12} color={colors.gray[500]} />
                <Text style={styles.metaText}>{plan.startHereCourse.duration}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.gray[300]} />
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryLabel: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
    fontWeight: '500',
  },
  statusHeading: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingTop: 12,
  },
  statItem: {
    flex: 1,
    gap: 6,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.gray[200],
    marginHorizontal: 12,
  },
  statValue: {
    flexDirection: 'row',
  },
  statValueHighlight: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.gray[900],
  },
  statValueTotal: {
    fontSize: fontSizes.base,
    color: colors.gray[500],
    alignSelf: 'flex-end',
    paddingBottom: 2,
  },
  startHereSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingTop: 12,
    gap: 8,
  },
  startHereLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.gray[500],
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  courseThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseInfo: {
    flex: 1,
    gap: 4,
  },
  courseTitle: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: fontSizes.base * 1.3,
  },
  courseMeta: {
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
});
