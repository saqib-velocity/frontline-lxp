/**
 * Course Detail Screen
 *
 * Shows two tabs — Chapters (default) and Overview.
 * Matches Figma nodes 6202:73506 (Chapters) + 6202:73509 (Overview).
 *
 * Navigation params:
 *   id          course id
 *   title       course title
 *   thumbnail   cover image URL
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { colors, fontSizes, radii } from '@/constants/tokens';
import type { CourseChapter, ContentPreference } from '@/types/course';

// ─── Per-course data ──────────────────────────────────────────────────────────

interface CourseData {
  description: string;
  skills: string[];
  chapters: CourseChapter[];
  totalDuration: string;
}

const COURSE_DATA: Record<string, CourseData> = {
  c1: {
    totalDuration: '20 min',
    description:
      'A podcast-style learning journey for frontline leaders. Explore the mindset shift from team member to manager — covering delegation, building trust, motivating your team, and turning big-picture goals into results on the shop floor.',
    skills: ['Frontline Leadership', 'Team Motivation', 'Delegation', 'Building Trust'],
    chapters: [
      { id: 'ch1', index: 1, title: 'The Frontline Manager Role',       duration: '4 min', status: 'current' },
      { id: 'ch2', index: 2, title: 'From Doing to Enabling',           duration: '4 min', status: 'locked'  },
      { id: 'ch3', index: 3, title: 'Building Trust Every Shift',       duration: '4 min', status: 'locked'  },
      { id: 'ch4', index: 4, title: 'Motivating Your Team',             duration: '4 min', status: 'locked'  },
      { id: 'ch5', index: 5, title: 'Delegating with Confidence',       duration: '4 min', status: 'quiz'    },
    ],
  },
  c2: {
    totalDuration: '15 min',
    description:
      'Set inside Bon Vivant luxury hotel, this scenario-based course challenges you to identify the 14 recognised food allergens, understand your legal obligations, and keep every customer safe — from storage to service.',
    skills: ['Food Allergen Awareness', 'Allergen Law', 'Customer Safety', 'Safe Food Handling'],
    chapters: [
      { id: 'ch1', index: 1, title: 'The 14 Recognised Allergens',      duration: '3 min', status: 'current' },
      { id: 'ch2', index: 2, title: 'What Does the Law Say?',           duration: '3 min', status: 'locked'  },
      { id: 'ch3', index: 3, title: 'Spotting an Allergic Reaction',    duration: '3 min', status: 'locked'  },
      { id: 'ch4', index: 4, title: 'Safe Storage & Preparation',       duration: '3 min', status: 'locked'  },
      { id: 'ch5', index: 5, title: 'Serving Customers Safely',         duration: '3 min', status: 'quiz'    },
    ],
  },
  c3: {
    totalDuration: '15 min',
    description:
      'Discover what it takes to be the manager your team deserves. Explore how to set clear expectations, uphold team standards, and lead with confidence — so every shift runs at its best.',
    skills: ['Setting Expectations', 'Manager Accountability', 'Team Standards', 'Confident Leadership'],
    chapters: [
      { id: 'ch1', index: 1, title: 'What It Means to Set the Tone',    duration: '3 min', status: 'current' },
      { id: 'ch2', index: 2, title: 'Upholding Standards Daily',        duration: '3 min', status: 'locked'  },
      { id: 'ch3', index: 3, title: 'Communicating Expectations',       duration: '3 min', status: 'locked'  },
      { id: 'ch4', index: 4, title: 'Accountability in Action',         duration: '3 min', status: 'locked'  },
      { id: 'ch5', index: 5, title: 'Your Leadership Responsibilities', duration: '3 min', status: 'quiz'    },
    ],
  },
  c4: {
    totalDuration: '3 hr',
    description:
      'A comprehensive training for young people on how to engage safely and responsibly within UN processes. Covers personal safety, digital security, respectful participation, and navigating international forums with confidence.',
    skills: ['Personal Safety', 'Digital Security', 'UN Processes', 'International Engagement'],
    chapters: [
      { id: 'ch1', index: 1, title: 'Welcome & Course Overview',        duration: '10 min', status: 'current' },
      { id: 'ch2', index: 2, title: 'Understanding the UN System',      duration: '35 min', status: 'locked'  },
      { id: 'ch3', index: 3, title: 'Personal Safety at Events',        duration: '35 min', status: 'locked'  },
      { id: 'ch4', index: 4, title: 'Digital Security Essentials',      duration: '35 min', status: 'locked'  },
      { id: 'ch5', index: 5, title: 'Responsible Participation',        duration: '45 min', status: 'quiz'    },
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Icon for each chapter status — matches Figma (location pin, question mark, cup) */
function ChapterIcon({ status }: { status: CourseChapter['status'] }) {
  if (status === 'complete') {
    return <Ionicons name="trophy-outline" size={18} color={colors.gray[400]} />;
  }
  if (status === 'quiz') {
    return <Ionicons name="help-circle-outline" size={18} color={colors.gray[400]} />;
  }
  if (status === 'current') {
    return <Ionicons name="location" size={18} color={colors.brand.primary} />;
  }
  // locked
  return <Ionicons name="location-outline" size={18} color={colors.gray[300]} />;
}

// ─── Chapter list item ────────────────────────────────────────────────────────

function ChapterRow({
  chapter,
  isLast,
  onPress,
}: {
  chapter: CourseChapter;
  isLast: boolean;
  onPress: () => void;
}) {
  const isCurrent = chapter.status === 'current';
  return (
    <TouchableOpacity
      style={[chS.row, !isLast && chS.rowBorder]}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={chapter.status === 'locked'}
    >
      <View style={chS.info}>
        <Text
          style={[chS.title, chapter.status === 'locked' && chS.titleLocked]}
          numberOfLines={1}
        >
          {chapter.index}.{'  '}{chapter.title}
        </Text>
      </View>
      <ChapterIcon status={chapter.status} />
    </TouchableOpacity>
  );
}

const chS = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 13,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[200],
  },
  info:        { flex: 1, marginRight: 12 },
  title:       { fontSize: fontSizes.sm, fontWeight: '800', color: colors.gray[900] },
  titleLocked: { fontWeight: '700', color: colors.gray[400] },
});

// ─── Content preference chips ─────────────────────────────────────────────────

const PREFS: { key: ContentPreference; label: string; icon: string }[] = [
  { key: 'read',   label: 'Read',   icon: 'book-outline'      },
  { key: 'watch',  label: 'Watch',  icon: 'videocam'          },
  { key: 'listen', label: 'Listen', icon: 'headset-outline'   },
];

function ContentPreferencePicker({
  value,
  onChange,
}: {
  value: ContentPreference;
  onChange: (v: ContentPreference) => void;
}) {
  return (
    <View style={cpS.wrapper}>
      <Text style={cpS.label}>Content preference</Text>
      <View style={cpS.row}>
        {PREFS.map((p) => {
          const active = value === p.key;
          return (
            <TouchableOpacity
              key={p.key}
              style={[cpS.chip, active && cpS.chipActive]}
              onPress={() => onChange(p.key)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={p.icon as any}
                size={12}
                color={active ? '#112327' : colors.gray[500]}
              />
              <Text style={[cpS.chipText, active && cpS.chipTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const cpS = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: 8 },
  label:   { fontSize: fontSizes.xs, color: colors.gray[500], fontWeight: '500' },
  row:     { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#91d281',
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: '#e2f8be',
    borderColor: '#40db0c',
  },
  chipText:       { fontSize: fontSizes.xs, fontWeight: '600', color: '#112327' },
  chipTextActive: { color: '#112327' },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CourseDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tokens } = useAppTheme();

  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    thumbnail?: string;
  }>();

  const courseTitle = params.title ?? 'ShiftUp: Step Into Leadership';
  const thumbnail   = params.thumbnail ?? 'https://shiftup-scorm.vercel.app/story_content/thumbnail.jpg';

  // Look up course-specific content, falling back to c1
  const courseData  = COURSE_DATA[params.id ?? 'c1'] ?? COURSE_DATA['c1'];

  const [activeTab,  setActiveTab]  = useState<'chapters' | 'overview'>('chapters');
  const [pref,       setPref]       = useState<ContentPreference>('watch');
  const [bookmarked, setBookmarked] = useState(false);

  // First chapter that's 'current' or first chapter
  const startChapter = courseData.chapters.find((c) => c.status === 'current') ?? courseData.chapters[0];
  const hasCurrent   = courseData.chapters.some((c) => c.status === 'current');

  function handleStart() {
    router.push({
      pathname: '/course-player',
      params: {
        courseId:     params.id ?? 'c1',
        courseTitle,
        chapterId:    startChapter.id,
        chapterTitle: startChapter.title,
        chapterIndex: String(startChapter.index),
      },
    });
  }

  function handleChapterPress(chapter: CourseChapter) {
    if (chapter.status === 'locked') return;
    router.push({
      pathname: '/course-player',
      params: {
        courseId:     params.id ?? 'c1',
        courseTitle,
        chapterId:    chapter.id,
        chapterTitle: chapter.title,
        chapterIndex: String(chapter.index),
      },
    });
  }

  return (
    <View style={[s.root, { backgroundColor: tokens.headerBg }]}>

      {/* ── Orange status-bar spacer ─────────────────────────────────────── */}
      <View style={{ height: insets.top }} />

      {/* ── Gray body card ────────────────────────────────────────────────── */}
      <View style={s.body}>

        {/* ── Scrollable content ──────────────────────────────────────────── */}
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top nav row */}
          <View style={s.navRow}>
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
              <Ionicons name="chevron-back" size={18} color={colors.gray[900]} />
            </TouchableOpacity>

            {/* Spacer — title intentionally empty (per Figma) */}
            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={s.iconBtn}
              onPress={() => setBookmarked((b) => !b)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={bookmarked ? 'star' : 'star-outline'}
                size={16}
                color={bookmarked ? '#F59E0B' : colors.gray[400]}
              />
            </TouchableOpacity>
          </View>

          {/* Course title + thumbnail */}
          <View style={s.heroSection}>
            <Text style={s.courseTitle} numberOfLines={2}>{courseTitle}</Text>
            <View style={s.thumbnailWrap}>
              <Image source={{ uri: thumbnail }} style={s.thumbnail} resizeMode="cover" />
            </View>
          </View>

          {/* Tabs: Chapters | Overview */}
          <View style={s.tabRow}>
            {(['chapters', 'overview'] as const).map((tab) => {
              const active = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[s.tab, active && s.tabActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.tabText, active && s.tabTextActive]}>
                    {tab === 'chapters' ? 'Chapters' : 'Overview'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Chapters tab ─────────────────────────────────────────────── */}
          {activeTab === 'chapters' && (
            <View style={s.section}>
              {/* Header row */}
              <View style={s.chapterHeaderRow}>
                <Text style={s.chapterHeaderTitle}>Course chapters</Text>
                <View style={s.badge}>
                  <Text style={s.badgeText}>{courseData.chapters.length}</Text>
                </View>
                <Text style={s.chapterDuration}>{courseData.totalDuration}</Text>
              </View>

              {/* Chapter list card */}
              <View style={s.listCard}>
                {courseData.chapters.map((ch, i) => (
                  <ChapterRow
                    key={ch.id}
                    chapter={ch}
                    isLast={i === courseData.chapters.length - 1}
                    onPress={() => handleChapterPress(ch)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* ── Overview tab ─────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <View style={s.section}>
              <Text style={s.description}>{courseData.description}</Text>
              <View style={s.skillsRow}>
                {courseData.skills.map((skill) => (
                  <View key={skill} style={s.skillChip}>
                    <Text style={s.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Spacer so content doesn't get swallowed by bottom panel */}
          <View style={{ height: 160 }} />
        </ScrollView>

        {/* ── Fixed bottom panel ───────────────────────────────────────────── */}
        <View style={[s.bottomPanel, { paddingBottom: insets.bottom + 12 }]}>
          <ContentPreferencePicker value={pref} onChange={setPref} />

          <TouchableOpacity style={s.ctaBtn} onPress={handleStart} activeOpacity={0.85}>
            <Text style={s.ctaText}>{hasCurrent ? 'Continue' : 'Start'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: 8 },

  // Nav row
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 16,
    backgroundColor: colors.gray[200],
    alignItems: 'center', justifyContent: 'center',
  },
  iconBtn: {
    width: 32, height: 32, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },

  // Hero
  heroSection: { paddingHorizontal: 16, gap: 8 },
  courseTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.gray[900],
    lineHeight: 28,
  },
  thumbnailWrap: {
    height: 192,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray[200],
  },
  thumbnail: { width: '100%', height: '100%' },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 16,
    marginTop: 16,
    height: 40,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    paddingHorizontal: 12,
  },
  tabActive: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    shadowColor: '#241040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  tabText:       { fontSize: fontSizes.base, fontWeight: '600', color: colors.gray[500] },
  tabTextActive: { fontWeight: '800', color: '#09341c' },

  // Section
  section: { paddingHorizontal: 16, marginTop: 16, gap: 12 },

  // Chapter header
  chapterHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chapterHeaderTitle: { fontSize: fontSizes.base, fontWeight: '800', color: colors.gray[900] },
  badge: {
    backgroundColor: '#e2f8be',
    borderWidth: 1,
    borderColor: '#93fd44',
    borderRadius: 8,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 13, fontWeight: '700', color: '#09341c' },
  chapterDuration: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.gray[500] },

  // Chapter list
  listCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 0,
    overflow: 'hidden',
    paddingVertical: 4,
  },

  // Overview
  description: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.gray[500],
    lineHeight: 22,
  },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: {
    borderWidth: 1,
    borderColor: '#76b1fe',
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: colors.white,
  },
  skillText: { fontSize: fontSizes.xs, fontWeight: '600', color: '#0d4dcd' },

  // Bottom panel
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.gray[100],
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray[200],
  },
  ctaBtn: {
    height: 48,
    backgroundColor: '#292929',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { fontSize: fontSizes.base, fontWeight: '800', color: colors.white },
});
