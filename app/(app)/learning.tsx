import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/layout/AppHeader';
import { FilterTabBar } from '@/components/layout/FilterTabBar';
import { SubFilterBar } from '@/components/ui/SubFilterBar';
import { SearchBar } from '@/components/ui/SearchBar';
import { Toast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { CourseListItem } from '@/components/learning/CourseListItem';
import { EventListItem } from '@/components/learning/EventListItem';
import { colors, fontSizes } from '@/constants/tokens';
import { useAppTheme } from '@/context/ThemeContext';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type {
  FilterTab,
  LearningSubFilter,
  EventSubFilter,
  LearningCourse,
  CalendarEvent,
} from '@/types/course';

// ─── Mock data — Learning ──────────────────────────────────────────────────────

const LEARNING_COURSES: LearningCourse[] = [
  {
    id: 'c1',
    title: 'ShiftUp: Step Into Leadership',
    thumbnail: 'https://shiftup-scorm.vercel.app/story_content/thumbnail.jpg',
    duration: '20 min',
    rating: 4.5,
    progress: '00/00',
    dueDate: '01 Jan',
    dueDateStatus: 'overdue',
  },
  {
    id: 'c2',
    title: 'Check the Label: Allergen Awareness',
    thumbnail: 'https://check-the-label-scorm.vercel.app/course-config/assets/images/02-allergens/2-1_IM_BG_Desktop.png',
    duration: '15 min',
    rating: 4.8,
    progress: '00/00',
    dueDate: '01 Jan',
    dueDateStatus: 'warning',
  },
  {
    id: 'c3',
    title: 'Setting the Tone: Manager Responsibilities',
    thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&q=80',
    duration: '15 min',
    rating: 4.3,
    progress: '00/00',
    dueDate: '01 Jan',
    dueDateStatus: 'due',
  },
  {
    id: 'c4',
    title: 'Engaging Safely at the UN',
    thumbnail: 'https://engaging-safely-scorm.vercel.app/story_content/thumbnail.jpg',
    duration: '3 hr',
    rating: 4.6,
    progress: '00/00',
  },
  {
    id: 'c5',
    title: 'Retail Resilience: Stress Toolkit',
    thumbnail: 'https://retail-stress-toolkit-scorm.vercel.app/story_content/thumbnail.jpg',
    duration: '5 min',
    rating: 4.7,
    progress: '00/00',
    dueDate: '01 Jan',
    dueDateStatus: 'due',
  },
];

// ─── Mock data — Events ────────────────────────────────────────────────────────

const BASE_EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Culture at King Wing',
    date: { day: '18', month: 'Feb' },
    time: '12:00',
    locationType: 'webinar',
    locationValue: 'Webinar',
    status: 'attending',          // already signed up per Figma
    description: 'Event description goes here.',
    meetingLink: 'event-meeting.link/',
    locationLabel: 'Google Meet',
    isMandatory: true,
  },
  {
    id: 'e2',
    title: 'Sales enablement training',
    date: { day: '31', month: 'Aug' },
    time: '00:00',
    locationType: 'location',
    locationValue: 'London, UK',
    status: 'requested',
    meetingLink: 'event-meeting.link/',
    locationLabel: 'Meeting Room 1',
    isMandatory: false,
  },
  {
    id: 'e3',
    title: 'Q1 Goals Intro',
    date: { day: '22', month: 'Oct' },
    time: '00:00',
    locationType: 'link',
    locationValue: 'Link',
    status: 'invited',
    meetingLink: 'event-meeting.link/',
    locationLabel: 'Google Meet',
    isMandatory: false,
  },
  {
    id: 'e4',
    title: 'Creative Summit',
    date: { day: '8', month: 'Dec' },
    time: '00:00',
    locationType: 'location',
    locationValue: 'Lisbon, PT',
    status: 'invited',
    meetingLink: 'event-meeting.link/',
    locationLabel: 'Venue TBC',
    isMandatory: true,
  },
];

const LEARNING_SUB_FILTERS: { key: LearningSubFilter; label: string }[] = [
  { key: 'assigned',    label: 'Assigned' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'saved',       label: 'Saved' },
  { key: 'complete',    label: 'Complete' },
];

const EVENT_SUB_FILTERS: { key: EventSubFilter; label: string }[] = [
  { key: 'assigned',  label: 'Assigned' },
  { key: 'available', label: 'Available' },
  { key: 'attended',  label: 'Attended' },
];

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function LearningScreen() {
  const router = useRouter();
  const { tokens } = useAppTheme();
  const params = useLocalSearchParams<{
    toast?: string;
    toastTitle?: string;
    signedUpId?: string;
  }>();

  const tabBarHeight = useBottomTabBarHeight();
  const [globalFilter, setGlobalFilter] = useState<FilterTab>('my-learning');
  const [learningFilter, setLearningFilter] = useState<LearningSubFilter>('assigned');
  const [eventFilter, setEventFilter] = useState<EventSubFilter>('assigned');
  const [search, setSearch] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTitle, setToastTitle] = useState('');

  // Events state — allows updating status after sign-up
  const [events, setEvents] = useState<CalendarEvent[]>(BASE_EVENTS);

  // Show toast and flip event status when returning from event detail
  useEffect(() => {
    if (params.toast === 'signed_up') {
      setGlobalFilter('events');
      setToastVisible(true);
      setToastTitle(params.toastTitle ?? 'event');

      // Flip event status to 'attending'
      if (params.signedUpId) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === params.signedUpId ? { ...e, status: 'attending' } : e
          )
        );
      }

      // Auto-dismiss after 4s
      const t = setTimeout(() => setToastVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [params.toast, params.toastTitle, params.signedUpId]);

  function handleGlobalFilter(tab: FilterTab) {
    if (tab === 'todo') {
      router.navigate('/(app)/' as any);
    } else {
      setGlobalFilter(tab);
    }
  }

  function handleEventPress(event: CalendarEvent) {
    router.push({
      pathname: '/event-detail' as never,
      params: {
        id: event.id,
        title: event.title,
        time: event.time,
        locationType: event.locationType,
        locationValue: event.locationValue,
        day: event.date.day,
        month: event.date.month,
        meetingLink: event.meetingLink ?? '',
        locationLabel: event.locationLabel ?? '',
        isMandatory: event.isMandatory ? 'true' : 'false',
      },
    });
  }

  const isLearning = globalFilter === 'my-learning';

  return (
    <View style={[styles.root, { backgroundColor: tokens.headerBg }]}>
      {/* Sticky header */}
      <AppHeader />

      {/* Global filter: To-Do / My learning / Events */}
      <FilterTabBar activeTab={globalFilter} onTabChange={handleGlobalFilter} />

      {/* Content area — toast is positioned absolute within this, so top:8 lands
          just below the FilterTabBar rather than behind the AppHeader */}
      <View style={styles.contentArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 8 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section heading */}
          <View style={styles.sectionHeadRow}>
            <Ionicons
              name={isLearning ? 'school-outline' : 'calendar-outline'}
              size={20}
              color={colors.gray[900]}
            />
            <Text style={styles.sectionTitle}>
              {isLearning ? 'Learning' : 'Events'}
            </Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            {isLearning
              ? 'Browse courses you interacted with'
              : 'Browse, discover and sign up for Events'}
          </Text>

          {/* Sub-filter pills */}
          {isLearning ? (
            <SubFilterBar
              tabs={LEARNING_SUB_FILTERS}
              activeTab={learningFilter}
              onTabChange={(t) => setLearningFilter(t as LearningSubFilter)}
            />
          ) : (
            <SubFilterBar
              tabs={EVENT_SUB_FILTERS}
              activeTab={eventFilter}
              onTabChange={(t) => setEventFilter(t as EventSubFilter)}
            />
          )}

          {/* Search bar inline — above the list */}
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search" />

          {/* List card */}
          <Card noPadding style={styles.card}>
            {isLearning
              ? LEARNING_COURSES.map((course, i) => (
                  <CourseListItem
                    key={course.id}
                    course={course}
                    showDivider={i < LEARNING_COURSES.length - 1}
                    onPress={() =>
                      router.push({
                        pathname: '/course-detail',
                        params: {
                          id: course.id,
                          title: course.title,
                          thumbnail: course.thumbnail ?? '',
                        },
                      })
                    }
                  />
                ))
              : events.map((event, i) => (
                  <EventListItem
                    key={event.id}
                    event={event}
                    onPress={() => handleEventPress(event)}
                    showDivider={i < events.length - 1}
                  />
                ))}
          </Card>

          <View style={styles.bottomPad} />
        </ScrollView>

        {/* Toast — absolute within contentArea, appears just below FilterTabBar */}
        <Toast
          visible={toastVisible}
          title="Signed up to event"
          message={`You have successfully signed up to: ${toastTitle} event.`}
          onClose={() => setToastVisible(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // Orange shows through the FilterTabBar's rounded top corners
    backgroundColor: colors.brand.primary,
  },
  contentArea: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scroll: { flex: 1, backgroundColor: colors.gray[50] },
  scrollContent: { paddingBottom: 8 },
  sectionHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
  },
  sectionSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
    paddingHorizontal: 16,
    marginTop: 2,
  },
  card: {
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  bottomPad: { height: 16 },
});
