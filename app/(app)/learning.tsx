import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/layout/AppHeader';
import { FilterTabBar } from '@/components/layout/FilterTabBar';
import { SubFilterBar } from '@/components/ui/SubFilterBar';
import { SearchBar } from '@/components/ui/SearchBar';
import { Card } from '@/components/ui/Card';
import { CourseListItem } from '@/components/learning/CourseListItem';
import { EventListItem } from '@/components/learning/EventListItem';
import { colors, fontSizes } from '@/constants/tokens';
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
    title: 'Food Safety: Hot Holding & Temps',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80',
    duration: '15 min',
    rating: 4,
    progress: '00/00',
    dueDate: '01 Jan',
    dueDateStatus: 'overdue',
  },
  {
    id: 'c2',
    title: 'Allergen Awareness (Chicken + coatings)',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80',
    duration: '15 min',
    rating: 4,
    progress: '00/00',
    dueDate: '01 Jan',
    dueDateStatus: 'warning',
  },
  {
    id: 'c3',
    title: 'Oil & Fryer Safety',
    thumbnail: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&q=80',
    duration: '15 min',
    rating: 4,
    progress: '00/00',
    dueDate: '01 Jan',
    dueDateStatus: 'due',
  },
  {
    id: 'c4',
    title: 'Speed of Service (Drive-Thru basics)',
    thumbnail: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&q=80',
    duration: '15 min',
    rating: 4,
    progress: '00/00',
  },
];

// ─── Mock data — Events ────────────────────────────────────────────────────────

const EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Culture at King Wing',
    date: { day: '18', month: 'Feb' },
    time: '12:00',
    locationType: 'webinar',
    locationValue: 'Webinar',
    status: 'invited',
  },
  {
    id: 'e2',
    title: 'Sales enablement training',
    date: { day: '31', month: 'Aug' },
    time: '00:00',
    locationType: 'location',
    locationValue: 'London, UK',
    status: 'requested',
  },
  {
    id: 'e3',
    title: 'Q1 Goals Intro',
    date: { day: '22', month: 'Oct' },
    time: '00:00',
    locationType: 'link',
    locationValue: 'Link',
    status: 'invited',
  },
  {
    id: 'e4',
    title: 'Creative Summit',
    date: { day: '8', month: 'Dec' },
    time: '00:00',
    locationType: 'location',
    locationValue: 'Lisbon, PT',
    status: 'invited',
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
  const [globalFilter, setGlobalFilter] = useState<FilterTab>('my-learning');
  const [learningFilter, setLearningFilter] = useState<LearningSubFilter>('assigned');
  const [eventFilter, setEventFilter] = useState<EventSubFilter>('assigned');
  const [search, setSearch] = useState('');

  function handleGlobalFilter(tab: FilterTab) {
    if (tab === 'todo') {
      // Navigate back to the Home tab
      router.navigate('/(app)/');
    } else {
      setGlobalFilter(tab);
    }
  }

  const isLearning = globalFilter === 'my-learning';

  return (
    <View style={styles.root}>
      {/* Sticky orange header */}
      <AppHeader />

      {/* Global filter: To-Do / My learning / Events */}
      <FilterTabBar activeTab={globalFilter} onTabChange={handleGlobalFilter} />

      {/* Scrollable body */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
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

        {/* List card */}
        <Card noPadding style={styles.card}>
          {isLearning
            ? LEARNING_COURSES.map((course, i) => (
                <CourseListItem
                  key={course.id}
                  course={course}
                  showDivider={i < LEARNING_COURSES.length - 1}
                />
              ))
            : EVENTS.map((event, i) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  showDivider={i < EVENTS.length - 1}
                />
              ))}
        </Card>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Pinned search bar above tab bar */}
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
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
  bottomPad: {
    height: 16,
  },
});
