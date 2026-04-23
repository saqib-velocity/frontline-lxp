import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { FilterTabBar } from '@/components/layout/FilterTabBar';
import { MandatoryTrainingCard } from '@/components/home/MandatoryTrainingCard';
import { MandatoryTrainingSheet } from '@/components/home/MandatoryTrainingSheet';
import { CourseSectionHeader } from '@/components/home/CourseSectionHeader';
import { CourseCarousel } from '@/components/home/CourseCarousel';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { colors } from '@/constants/tokens';
import { useAppTheme } from '@/context/ThemeContext';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { FilterTab, TrainingPlan, Course } from '@/types/course';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PLAN: TrainingPlan = {
  id: '1',
  title: 'Mandatory training',
  status: 'on-track',
  dueDate: '01 Jan',
  courses: { total: 4, completed: 0 },
  events: 3,
  startHereCourse: {
    id: 'c1',
    title: 'ShiftUp: Step Into Leadership',
    thumbnail: 'https://shiftup-scorm.vercel.app/story_content/thumbnail.jpg',
    duration: '20 min',
    rating: 0,
  },
};

const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'ShiftUp: Step Into Leadership',
    thumbnail: 'https://shiftup-scorm.vercel.app/story_content/thumbnail.jpg',
    duration: '20 min',
    rating: 4.5,
    progress: '4/5',
  },
  {
    id: 'c2',
    title: 'Check the Label: Allergen Awareness',
    thumbnail: 'https://check-the-label-scorm.vercel.app/course-config/assets/images/02-allergens/2-1_IM_BG_Desktop.png',
    duration: '15 min',
    rating: 4.8,
    progress: '4/5',
  },
  {
    id: 'c3',
    title: 'Setting the Tone: Manager Responsibilities',
    thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80',
    duration: '15 min',
    rating: 4.3,
    progress: '0/5',
  },
  {
    id: 'c4',
    title: 'Engaging Safely at the UN',
    thumbnail: 'https://engaging-safely-scorm.vercel.app/story_content/thumbnail.jpg',
    duration: '3 hr',
    rating: 4.6,
    progress: '0/5',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { tokens } = useAppTheme();
  const breakpoint = useBreakpoint();
  const isDesktop = breakpoint === 'desktop';

  const tabBarHeight = useBottomTabBarHeight();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetTab, setSheetTab] = useState<'courses' | 'events'>('courses');

  function openSheet(tab: 'courses' | 'events') {
    setSheetTab(tab);
    setSheetVisible(true);
  }

  function handleFilterChange(tab: FilterTab) {
    if (tab === 'my-learning' || tab === 'events') {
      router.navigate('/(app)/learning');
    }
    // 'todo' is already active — do nothing
  }

  return (
    <View style={[styles.root, { backgroundColor: tokens.headerBg }]}>
      {/* Sticky header */}
      <AppHeader />

      {/* Filter tabs — 'todo' always active on Home */}
      <FilterTabBar activeTab="todo" onTabChange={handleFilterChange} />

      {/* Scrollable content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + 8 },
          isDesktop && styles.scrollContentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isDesktop ? (
          // Desktop: 2-column layout
          <View style={styles.desktopGrid}>
            <View style={styles.desktopLeft}>
              <MandatoryTrainingCard
                plan={MOCK_PLAN}
                onCoursesPress={() => openSheet('courses')}
                onEventsPress={() => openSheet('events')}
              />
            </View>
            <View style={styles.desktopRight}>
              <CourseSectionHeader
                title="Mandatory training"
                subtitle={`${MOCK_COURSES.length} Courses`}
                onSeeAll={() => {}}
              />
              <CourseCarousel
                courses={MOCK_COURSES}
                onCoursePress={(c) =>
                  router.push({
                    pathname: '/course-detail',
                    params: { id: c.id, title: c.title, thumbnail: c.thumbnail ?? '' },
                  })
                }
              />
            </View>
          </View>
        ) : (
          // Mobile / tablet: single column
          <>
            <MandatoryTrainingCard
              plan={MOCK_PLAN}
              onCoursesPress={() => openSheet('courses')}
              onEventsPress={() => openSheet('events')}
            />
            <CourseSectionHeader
              title="Mandatory training"
              subtitle={`${MOCK_COURSES.length} Courses`}
              onSeeAll={() => {}}
            />
            <CourseCarousel courses={MOCK_COURSES} />
          </>
        )}
      </ScrollView>

      {/* Mandatory Training bottom sheet */}
      <MandatoryTrainingSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        initialTab={sheetTab}
        plan={MOCK_PLAN}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // Orange shows through the FilterTabBar's rounded top corners
    backgroundColor: colors.brand.primary,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    paddingBottom: 24,
  },
  // Dynamic bottom padding is applied inline via insets
  scrollContentDesktop: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  desktopGrid: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 8,
  },
  desktopLeft: {
    flex: 1,
    maxWidth: 420,
  },
  desktopRight: {
    flex: 1,
  },
});
