import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSizes, radii } from '@/constants/tokens';
import type { TrainingPlan, LearningCourse, CalendarEvent, DueDateStatus } from '@/types/course';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H = SCREEN_H * 0.72;

// ─── Shared mock data (same as home/learning screens) ─────────────────────────

const COURSES: LearningCourse[] = [
  {
    id: 'c1',
    title: 'Food Safety: Hot Holding & Temps',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80',
    duration: '15 min',
    rating: 4,
    progress: '00/00',
    dueDate: '01 Jan',
    dueDateStatus: 'due',
  },
  {
    id: 'c2',
    title: 'Allergen Awareness (Chicken + coatings)',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80',
    duration: '15 min',
    rating: 4,
    progress: '00/00',
    dueDate: '01 Jan',
    dueDateStatus: 'warning',
  },
  {
    id: 'c3',
    title: 'Oil & Fryer Safety',
    thumbnail: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=200&q=80',
    duration: '15 min',
    rating: 4,
    progress: '00/00',
  },
  {
    id: 'c4',
    title: 'Speed of Service (Drive-Thru basics)',
    thumbnail: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=200&q=80',
    duration: '15 min',
    rating: 4,
    progress: '00/00',
  },
];

const EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Culture at King Wing',
    date: { day: '18', month: 'Feb' },
    time: '00:00',
    locationType: 'webinar',
    locationValue: 'Webinar',
    status: 'attending',
  },
  {
    id: 'e2',
    title: 'Sales enablement training',
    date: { day: '31', month: 'Aug' },
    time: '00:00',
    locationType: 'location',
    locationValue: 'London, UK',
    status: 'attending',
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
];

// ─── Badge helpers ─────────────────────────────────────────────────────────────

const DUE_BADGE: Record<
  Exclude<DueDateStatus, 'none'>,
  { bg: string; text: string; icon: React.ComponentProps<typeof Ionicons>['name'] }
> = {
  overdue: { bg: '#FEE2E2', text: '#DC2626', icon: 'alert-circle' },
  warning: { bg: '#FFF7ED', text: '#EA580C', icon: 'warning' },
  due:     { bg: '#F3F4F6', text: '#374151', icon: 'calendar-outline' },
};

const STATUS_STYLE: Record<string, { bg?: string; border: string; text: string; filled: boolean }> = {
  attending: { bg: '#2563EB', border: '#2563EB', text: '#FFFFFF', filled: true },
  invited:   { border: '#C24806', text: '#C24806', filled: false },
  requested: { border: '#2563EB', text: '#2563EB', filled: false },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
  initialTab?: 'courses' | 'events';
  plan: TrainingPlan;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MandatoryTrainingSheet({ visible, onClose, initialTab = 'courses', plan }: Props) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'courses' | 'events'>(initialTab);
  const slideY = useRef(new Animated.Value(SHEET_H)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, tension: 80, friction: 14, useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, { toValue: SHEET_H, duration: 220, useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Dim overlay */}
      <Animated.View style={[styles.overlay, { opacity: bgOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideY }], paddingBottom: insets.bottom + 16 },
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mandatory training</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={18} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'courses' && styles.tabBtnActive]}
            onPress={() => setTab('courses')}
          >
            <Text style={[styles.tabBtnLabel, tab === 'courses' && styles.tabBtnLabelActive]}>
              Courses  {plan.courses.total}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'events' && styles.tabBtnActive]}
            onPress={() => setTab('events')}
          >
            <Text style={[styles.tabBtnLabel, tab === 'events' && styles.tabBtnLabelActive]}>
              Events  {plan.events}
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
          {tab === 'courses'
            ? COURSES.map((course, i) => {
                const badge =
                  course.dueDateStatus && course.dueDateStatus !== 'none'
                    ? DUE_BADGE[course.dueDateStatus]
                    : null;
                return (
                  <View key={course.id}>
                    <TouchableOpacity style={styles.row} activeOpacity={0.75}>
                      <View style={styles.thumb}>
                        {course.thumbnail ? (
                          <Image source={{ uri: course.thumbnail }} style={styles.thumbImg} />
                        ) : (
                          <View style={styles.thumbPlaceholder} />
                        )}
                      </View>
                      <View style={styles.rowContent}>
                        <Text style={styles.rowTitle} numberOfLines={2}>{course.title}</Text>
                        <View style={styles.rowMeta}>
                          <Text style={styles.metaText}>{course.progress ?? '00/00'}</Text>
                          <Text style={styles.metaDot}>·</Text>
                          <Ionicons name="time-outline" size={12} color={colors.gray[400]} />
                          <Text style={styles.metaText}>{course.duration}</Text>
                          {badge && course.dueDate && (
                            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                              <Ionicons name={badge.icon} size={11} color={badge.text} />
                              <Text style={[styles.badgeLabel, { color: badge.text }]}>{course.dueDate}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={colors.gray[300]} />
                    </TouchableOpacity>
                    {i < COURSES.length - 1 && <View style={styles.divider} />}
                  </View>
                );
              })
            : EVENTS.map((event, i) => {
                const cfg = STATUS_STYLE[event.status] ?? STATUS_STYLE.invited;
                return (
                  <View key={event.id}>
                    <TouchableOpacity style={styles.row} activeOpacity={0.75}>
                      <View style={styles.dateBlock}>
                        <Text style={styles.dateDay}>{event.date.day}</Text>
                        <Text style={styles.dateMonth}>{event.date.month}</Text>
                      </View>
                      <View style={styles.rowContent}>
                        <Text style={styles.rowTitle} numberOfLines={2}>{event.title}</Text>
                        <View style={styles.rowMeta}>
                          <Text style={styles.metaText}>{event.time}</Text>
                          <Text style={styles.metaDot}>·</Text>
                          <Ionicons name="globe-outline" size={12} color={colors.gray[400]} />
                          <Text style={styles.metaText}>{event.locationValue}</Text>
                        </View>
                      </View>
                      <View style={[
                        styles.statusPill,
                        { borderColor: cfg.border, backgroundColor: cfg.filled ? cfg.bg : 'transparent' },
                      ]}>
                        <Ionicons name="calendar-outline" size={11} color={cfg.text} />
                        <Text style={[styles.statusLabel, { color: cfg.text }]}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={colors.gray[300]} />
                    </TouchableOpacity>
                    {i < EVENTS.length - 1 && <View style={styles.divider} />}
                  </View>
                );
              })}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_H,
    backgroundColor: colors.gray[50],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[300],
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.gray[900],
    flex: 1,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabBtnActive: {
    borderColor: colors.gray[900],
  },
  tabBtnLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.gray[500],
  },
  tabBtnLabelActive: {
    fontWeight: '700',
    color: colors.gray[900],
  },
  list: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: colors.white,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    flexShrink: 0,
  },
  thumbImg: { width: '100%', height: '100%' },
  thumbPlaceholder: { flex: 1, backgroundColor: colors.gray[200] },
  rowContent: { flex: 1, gap: 3 },
  rowTitle: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: fontSizes.base * 1.35,
  },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  metaText: { fontSize: fontSizes.xs, color: colors.gray[500] },
  metaDot: { fontSize: fontSizes.xs, color: colors.gray[300] },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  badgeLabel: { fontSize: fontSizes.xs, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.gray[200], marginHorizontal: 16 },
  dateBlock: { width: 36, alignItems: 'center', flexShrink: 0 },
  dateDay: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.gray[900] },
  dateMonth: { fontSize: fontSizes.xs, color: colors.gray[500], textTransform: 'uppercase', fontWeight: '500' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1.5,
    flexShrink: 0,
  },
  statusLabel: { fontSize: fontSizes.xs, fontWeight: '600' },
});
