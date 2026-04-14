import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { CourseCard } from './CourseCard';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import type { Course } from '@/types/course';

interface CourseCarouselProps {
  courses: Course[];
  onCoursePress?: (course: Course) => void;
}

export function CourseCarousel({ courses, onCoursePress }: CourseCarouselProps) {
  const { width } = useWindowDimensions();
  const breakpoint = useBreakpoint();

  // Calculate card width based on breakpoint
  const cardWidth =
    breakpoint === 'desktop'
      ? 220
      : breakpoint === 'tablet'
      ? (width - 48) / 2
      : width * 0.58;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      decelerationRate="fast"
      snapToInterval={cardWidth + 12}
      snapToAlignment="start"
    >
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          width={cardWidth}
          onPress={() => onCoursePress?.(course)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
});
