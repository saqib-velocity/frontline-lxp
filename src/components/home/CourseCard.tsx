import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes, radii } from '@/constants/tokens';
import type { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
  onPress?: () => void;
  width?: number;
}

export function CourseCard({ course, onPress, width = 200 }: CourseCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {course.thumbnail ? (
          <Image
            source={{ uri: course.thumbnail }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={32} color={colors.gray[300]} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
        <View style={styles.meta}>
          {course.rating > 0 && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.metaText}>{course.rating}/5</Text>
            </View>
          )}
          {course.rating > 0 && <Text style={styles.metaDot}>·</Text>}
          <Ionicons name="time-outline" size={12} color={colors.gray[500]} />
          <Text style={styles.metaText}>{course.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 10,
    gap: 6,
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: fontSizes.sm * 1.4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
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
