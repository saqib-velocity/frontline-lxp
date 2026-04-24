/**
 * AI Recommendation Screen
 *
 * Shown after the AI analysis completes. Displays the Claude-selected
 * course recommendation with a personalised reason, course card, and
 * an Enroll CTA that leads to the full course-detail screen.
 *
 * Figma: node 6383-89745
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, fontSizes } from '@/constants/tokens';

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AiRecommendationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{
    courseId?: string;
    courseTitle?: string;
    courseThumbnail?: string;
    courseDuration?: string;
    totalModules?: string;
    reason?: string;
  }>();

  const courseId        = params.courseId        ?? 'c-safety';
  const courseTitle     = params.courseTitle     ?? 'Workplace Safety Essentials';
  const courseThumbnail = params.courseThumbnail ?? 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80';
  const courseDuration  = params.courseDuration  ?? '15 min';
  const totalModules    = Number(params.totalModules ?? '5');
  const reason          = params.reason          ?? "Based on your feedback, we've matched you with the course most relevant to your onboarding experience.";

  function goToCourse() {
    router.push({
      pathname: '/course-detail',
      params: {
        id:        courseId,
        title:     courseTitle,
        thumbnail: courseThumbnail,
      },
    });
  }

  function goHome() {
    router.replace('/(app)/' as any);
  }

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* ── Nav bar ───────────────────────────────────────────────────────── */}
      <View style={s.navBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <Ionicons name="chevron-back" size={18} color={colors.gray[900]} />
        </TouchableOpacity>
        <View style={s.navTitles}>
          <Text style={s.navTitle} numberOfLines={1}>Company Onboarding Survey</Text>
          <Text style={s.navSub}>Recommendation</Text>
        </View>
      </View>

      {/* ── Main card ─────────────────────────────────────────────────────── */}
      <View style={s.cardWrap}>
        <ScrollView
          style={s.card}
          contentContainerStyle={s.cardInner}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header block ────────────────────────────────────────────── */}
          <View style={s.qHeader}>

            {/* "Recommendation" AI tag badge */}
            <View style={s.tagOuter}>
              <LinearGradient
                colors={['rgba(1,233,213,0.10)', 'rgba(221,254,64,0.10)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name="sparkles" size={12} color="#01E9D5" />
              <Text style={s.tagLabel}>Recommendation</Text>
            </View>

            {/* Heading */}
            <Text style={s.heading}>Thanks for your feedback!</Text>

            {/* AI-generated reason */}
            <Text style={s.reasonText}>{reason}</Text>
          </View>

          {/* ── Course card ───────────────────────────────────────────────── */}
          <TouchableOpacity style={s.courseCard} onPress={goToCourse} activeOpacity={0.88}>
            {/* Hero image */}
            <View style={s.imageWrap}>
              <Image
                source={{ uri: courseThumbnail }}
                style={s.image}
                resizeMode="cover"
              />
            </View>

            {/* Course info */}
            <View style={s.courseInfo}>
              <Text style={s.courseTitle} numberOfLines={2}>{courseTitle}</Text>
              <View style={s.metaRow}>
                <Text style={s.metaText}>1/{totalModules}</Text>
                <Text style={s.metaDot}> · </Text>
                <Ionicons name="timer-outline" size={12} color={colors.gray[500]} />
                <Text style={s.metaText}> {courseDuration}</Text>
              </View>
            </View>

            {/* Enroll button — outlined ghost style */}
            <TouchableOpacity style={s.enrollBtn} onPress={goToCourse} activeOpacity={0.8}>
              <Text style={s.enrollText}>Enroll</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <View style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <TouchableOpacity style={s.ctaBtn} onPress={goHome} activeOpacity={0.85}>
          <Text style={s.ctaText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  // Nav
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
    backgroundColor: '#F2F2F2',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 16,
    backgroundColor: '#E3E3E3',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  navTitles: { flex: 1, gap: 2 },
  navTitle: { fontSize: fontSizes.base, fontWeight: '800', color: colors.gray[900] },
  navSub:   { fontSize: fontSizes.sm,   fontWeight: '600', color: '#686868' },

  // Card
  cardWrap: { flex: 1, paddingHorizontal: 12, paddingBottom: 4 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: 'rgba(36,12,64,0.16)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  cardInner: { padding: 16, gap: 20, flexGrow: 1 },

  // Header
  qHeader: { gap: 8 },

  // AI tag badge
  tagOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#01E9D5',
    gap: 4,
    overflow: 'hidden',
  },
  tagLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.87)',
  },

  heading: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: '#121212',
    lineHeight: 28,
  },
  reasonText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: '#686868',
    lineHeight: 22,
  },

  // Course card
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: 'rgba(36,12,64,0.16)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
    padding: 10,
    gap: 12,
  },
  imageWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    backgroundColor: colors.gray[200],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  courseInfo: { gap: 4 },
  courseTitle: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: '#121212',
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.gray[500],
  },
  metaDot: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
  },

  // Enroll button — outlined ghost (matches Figma)
  enrollBtn: {
    height: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#9F9F9F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enrollText: {
    fontSize: fontSizes.base,
    fontWeight: '800',
    color: '#121212',
  },

  // Bottom CTA
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#F2F2F2',
  },
  ctaBtn: {
    height: 48,
    borderRadius: 20,
    backgroundColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { fontSize: fontSizes.base, fontWeight: '800', color: '#fff' },
});
