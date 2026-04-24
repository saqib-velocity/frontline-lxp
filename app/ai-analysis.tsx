/**
 * AI Analysis Screen
 *
 * Shown immediately after the user submits the survey.
 * Plays an animated "AI processing" experience while the feedback is
 * notionally being analysed, then enables the Done button.
 *
 * Animation design:
 *  - "Processing" tag badge: border + bg gradient cycle through AI colours
 *  - Feedback text box: border cycles magenta → teal → lime → magenta
 *  - Text box bg: two gradient layers cross-fade (pink-magenta ↔ peach-orange)
 *  - Heading shimmer: text colour pulses through AI gradient hues
 *  - Nav subtitle: "Processing" → "Processing." → ".." → "..."
 *  - After PROCESSING_MS the animation settles and Done activates
 *
 * Figma: node 6383-89731
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, fontSizes } from '@/constants/tokens';
import { analyzeAndRecommend, type CourseRecommendation } from '@/lib/claude';

// ─── Constants ────────────────────────────────────────────────────────────────

/** How long the AI "processing" phase lasts before Done activates */
const PROCESSING_MS = 4000;
/** Full cycle duration for the colour animation */
const CYCLE_MS = 2400;

/** AI colour tokens (from Figma) */
const AI = {
  teal:    '#01E9D5',
  lime:    '#DDFE40',
  magenta: '#AA0ABA',
  purple:  '#7C3AED',
  // Light backgrounds
  magentaBg: 'rgba(252,237,250,1)',  // ai-magenta-050
  orangeBg:  'rgba(253,243,236,1)',  // ai-orange-050
  tealBg:    'rgba(224,253,250,1)',
  limeBg:    'rgba(247,255,212,1)',
} as const;

// ─── Animated gradient border ─────────────────────────────────────────────────
// React Native doesn't support animated LinearGradient natively.
// We achieve the colour-cycling border by overlaying four 1px-border views
// whose borderColor is interpolated, achieving an approximation.
// For the background we cross-fade two LinearGradient layers.

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AiAnalysisScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ text?: string; q1?: string; answers?: string }>();

  // Survey answers passed from survey.tsx
  const feedbackText = params.text ?? params.answers ?? '';
  const q1Answer     = params.q1 ?? '';

  // ── State ──────────────────────────────────────────────────────────────────
  const [done,           setDone]           = useState(false);
  const [dotStep,        setDotStep]        = useState(0); // 0‥3 for "Processing" → "..."
  const [toastVisible,   setToastVisible]   = useState(true);
  const recommendationRef = useRef<CourseRecommendation | null>(null);

  // ── Animation values ───────────────────────────────────────────────────────
  /** 0→1 looping — drives all colour cycling */
  const cycle = useRef(new Animated.Value(0)).current;
  /** 0→1 looping — drives background cross-fade (offset from cycle) */
  const bgFade = useRef(new Animated.Value(0)).current;
  /** 0→1 pulsing — drives text shimmer opacity */
  const pulse  = useRef(new Animated.Value(0.55)).current;
  /** Toast drag position — translateY for swipe-to-dismiss */
  const toastY = useRef(new Animated.Value(0)).current;

  // ── Toast swipe-to-dismiss ─────────────────────────────────────────────────
  function dismissToast() {
    Animated.timing(toastY, {
      toValue: -120,
      duration: 260,
      useNativeDriver: true,
    }).start(() => setToastVisible(false));
  }

  const toastPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderMove: (_, g) => {
        // Only allow upward drag
        if (g.dy < 0) toastY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy < -40 || g.vy < -0.5) {
          dismissToast();
        } else {
          // Snap back
          Animated.spring(toastY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 120,
            friction: 10,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    // ── Colour cycle loop ──────────────────────────────────────────────────
    Animated.loop(
      Animated.timing(cycle, {
        toValue: 1,
        duration: CYCLE_MS,
        useNativeDriver: false,
      }),
    ).start();

    // ── Background cross-fade loop (slightly slower, offset feel) ──────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgFade, { toValue: 1, duration: CYCLE_MS * 1.2, useNativeDriver: false }),
        Animated.timing(bgFade, { toValue: 0, duration: CYCLE_MS * 1.2, useNativeDriver: false }),
      ]),
    ).start();

    // ── Text shimmer pulse ─────────────────────────────────────────────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1,    duration: 900, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0.45, duration: 900, useNativeDriver: false }),
      ]),
    ).start();

    // ── Dot counter ────────────────────────────────────────────────────────
    const dotTimer = setInterval(() => {
      setDotStep((s) => (s + 1) % 4);
    }, 500);

    // ── Fire Claude API + minimum animation timer in parallel ──────────────
    let cancelled = false;

    const minDelay  = new Promise<void>((res) => setTimeout(res, PROCESSING_MS));
    const apiCall   = analyzeAndRecommend(q1Answer, feedbackText);

    Promise.all([minDelay, apiCall]).then(([, recommendation]) => {
      if (cancelled) return;
      recommendationRef.current = recommendation;
      setDone(true);
      clearInterval(dotTimer);
      // Brief pause so user sees "Analysis complete!" before navigating
      setTimeout(() => {
        if (cancelled) return;
        router.replace({
          pathname: '/ai-recommendation' as any,
          params: {
            courseId:        recommendation.courseId,
            courseTitle:     recommendation.courseTitle,
            courseThumbnail: recommendation.courseThumbnail,
            courseDuration:  recommendation.courseDuration,
            totalModules:    String(recommendation.totalModules),
            reason:          recommendation.reason,
          },
        });
      }, 700);
    });

    return () => {
      cancelled = true;
      clearInterval(dotTimer);
    };
  }, []);

  // ── Interpolated colours ───────────────────────────────────────────────────

  // Tag badge border: teal → lime → magenta → teal
  const tagBorderColor = cycle.interpolate({
    inputRange:  [0, 0.33, 0.67, 1],
    outputRange: [AI.teal, AI.lime, AI.magenta, AI.teal],
  });

  // Text box border: magenta → teal → lime → magenta (offset)
  const boxBorderColor = cycle.interpolate({
    inputRange:  [0, 0.33, 0.67, 1],
    outputRange: [AI.magenta, AI.teal, AI.lime, AI.magenta],
  });

  // Heading text colour shimmer
  const headingColor = cycle.interpolate({
    inputRange:  [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['#121212', AI.teal, AI.purple, AI.magenta, '#121212'],
  });

  // Tag text colour
  const tagTextColor = cycle.interpolate({
    inputRange:  [0, 0.33, 0.67, 1],
    outputRange: [AI.magenta, AI.purple, '#004040', AI.magenta],
  });

  // Processing dots text
  const dots = ['', '.', '..', '...'][dotStep];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* ── Success toast — swipe up or tap × to dismiss ──────────────────── */}
      {toastVisible && (
        <Animated.View
          style={[s.toast, { transform: [{ translateY: toastY }] }]}
          {...toastPan.panHandlers}
        >
          <Ionicons name="checkmark-circle" size={16} color="#078810" />
          <View style={s.toastBody}>
            <Text style={s.toastTitle}>Survey submitted</Text>
            <Text style={s.toastSub}>Thanks for sharing your feedback!</Text>
          </View>
          <TouchableOpacity
            onPress={dismissToast}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={16} color={colors.gray[900]} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* ── Nav bar ───────────────────────────────────────────────────────── */}
      <View style={s.navBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <Ionicons name="chevron-back" size={18} color={colors.gray[900]} />
        </TouchableOpacity>
        <View style={s.navTitles}>
          <Text style={s.navTitle} numberOfLines={1}>Company Onboarding Survey</Text>
          <Text style={s.navSub}>
            {done ? 'Complete ✓' : `Processing${dots}`}
          </Text>
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

            {/* AI "Processing" tag badge */}
            <Animated.View style={s.tagOuter}>
              {/* Gradient background layers — cross-fade between two palettes */}
              <LinearGradient
                colors={[`${AI.teal}1A`, `${AI.lime}1A`]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  { opacity: bgFade, borderRadius: 12 },
                ]}
              >
                <LinearGradient
                  colors={[`${AI.magenta}18`, `${AI.purple}18`]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>

              {/* Sparkle icon */}
              <Ionicons name="sparkles" size={12} color={AI.teal} />

              {/* "Processing" label */}
              <Animated.Text style={[s.tagLabel, { color: tagTextColor }]}>
                {done ? 'Complete' : 'Processing'}
              </Animated.Text>
            </Animated.View>

            {/* Heading — shimmer colour */}
            <Animated.Text style={[s.heading, { color: done ? '#121212' : headingColor }]}>
              {done
                ? 'Analysis complete!'
                : `Analyzing your feedback${dots}`}
            </Animated.Text>

            <Text style={s.subText}>
              Your feedback helps us improve the onboarding process for future employees.
            </Text>
          </View>

          {/* ── Feedback text box ─────────────────────────────────────────── */}
          <View style={s.boxWrap}>
            {/* Animated border via Animated.View wrapper */}
            <Animated.View style={[s.boxBorder, { borderColor: boxBorderColor }]}>
              {/* Background: two gradient layers cross-fading */}
              <LinearGradient
                colors={[AI.magentaBg, AI.orangeBg]}
                start={{ x: 0.3, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 11 }]}
              />
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  { opacity: bgFade, borderRadius: 11 },
                ]}
              >
                <LinearGradient
                  colors={[AI.tealBg, AI.limeBg]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: 11 }]}
                />
              </Animated.View>

              {/* Pulsing feedback text */}
              <Animated.Text style={[s.feedbackText, { opacity: done ? 1 : pulse }]}>
                {feedbackText || 'I finished onboarding but still don\'t know what the safety procedures are or where to find them. This needs to be much clearer before someone starts in their role.'}
              </Animated.Text>
            </Animated.View>
          </View>
        </ScrollView>
      </View>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <View style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <TouchableOpacity
          style={[s.ctaBtn, !done && s.ctaBtnDisabled]}
          onPress={() => {
            if (!done) return;
            const rec = recommendationRef.current;
            if (rec) {
              router.replace({
                pathname: '/ai-recommendation' as any,
                params: {
                  courseId:        rec.courseId,
                  courseTitle:     rec.courseTitle,
                  courseThumbnail: rec.courseThumbnail,
                  courseDuration:  rec.courseDuration,
                  totalModules:    String(rec.totalModules),
                  reason:          rec.reason,
                },
              });
            } else {
              router.replace('/(app)/' as any);
            }
          }}
          activeOpacity={done ? 0.85 : 1}
        >
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

  // Toast
  toast: {
    position: 'absolute',
    top: 50,
    left: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    shadowColor: 'rgba(36,12,64,0.16)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  toastBody: { flex: 1, gap: 2 },
  toastTitle: { fontSize: fontSizes.base, fontWeight: '700', color: colors.gray[900] },
  toastSub: { fontSize: fontSizes.sm, fontWeight: '600', color: '#686868' },

  // Nav
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56, // clear the absolute toast
    paddingBottom: 12,
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
  navSub: { fontSize: fontSizes.sm, fontWeight: '600', color: '#686868' },

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

  // Question header
  qHeader: { gap: 8 },

  // AI tag badge — no border outline
  tagOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
    overflow: 'hidden',
  },
  tagLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },

  heading: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    lineHeight: 28,
  },
  subText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: '#686868',
    lineHeight: 22,
  },

  // Feedback text box
  boxWrap: { flex: 1 },
  boxBorder: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 214,
    overflow: 'hidden',
    padding: 12,
  },
  feedbackText: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: '#121212',
    lineHeight: 24,
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
  ctaBtnDisabled: { backgroundColor: '#B6B6B6' },
  ctaText: { fontSize: fontSizes.base, fontWeight: '800', color: '#fff' },
});
