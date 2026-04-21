/**
 * Course Player Screen
 *
 * Plays SCORM content in a WebView inside a white card.
 * Supports portrait (video + transcript) and landscape (full-screen WebView).
 *
 * Matches Figma node 6202:73491.
 *
 * Navigation params:
 *   courseId      string
 *   courseTitle   string
 *   chapterId     string
 *   chapterTitle  string
 *   chapterIndex  string (number)
 *   scormUri?     file:// URI for real SCORM content
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { colors, fontSizes, radii } from '@/constants/tokens';
import ScormPlayer, { ScormPlayerRef } from '@/components/course/ScormPlayer';

// ─── Mock transcript (replace with real SCORM content data) ──────────────────

const TRANSCRIPT = `CC – Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.`;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CoursePlayerScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const params  = useLocalSearchParams<{
    courseId?: string;
    courseTitle?: string;
    chapterId?: string;
    chapterTitle?: string;
    chapterIndex?: string;
    scormUri?: string;
  }>();

  const courseTitle   = params.courseTitle  ?? 'Food Safety: Hot Holding & Temps';
  const chapterTitle  = params.chapterTitle ?? 'Expert Food Safety Insights';
  const chapterIndex  = params.chapterIndex ?? '1';
  const scormUri      = params.scormUri;   // undefined → shows placeholder

  const [isLandscape,  setIsLandscape]  = useState(false);
  const [isMuted,      setIsMuted]      = useState(false);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [bookmarked,   setBookmarked]   = useState(false);
  const [completed,    setCompleted]    = useState(false);

  const scormRef = useRef<ScormPlayerRef>(null);

  // ── Lock to portrait on mount, restore on unmount ────────────────────────

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    };
  }, []);

  // ── Fullscreen / landscape toggle ─────────────────────────────────────────

  async function toggleLandscape() {
    if (isLandscape) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      setIsLandscape(false);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
      setIsLandscape(true);
    }
  }

  // ── SCORM callbacks ───────────────────────────────────────────────────────

  const handleScormValue = useCallback((key: string, value: string) => {
    console.log('[SCORM]', key, '=', value);
    if (key === 'cmi.core.lesson_status' && (value === 'passed' || value === 'completed')) {
      setCompleted(true);
    }
  }, []);

  const handleScormComplete = useCallback(() => {
    setCompleted(true);
  }, []);

  function handleContinue() {
    // Navigate back to course detail (or next chapter logic goes here)
    router.back();
  }

  // ── Landscape fullscreen mode ─────────────────────────────────────────────

  if (isLandscape) {
    return (
      <View style={ls.root}>
        <StatusBar hidden />
        {/* SCORM takes the full screen */}
        <ScormPlayer
          ref={scormRef}
          uri={scormUri}
          onScormValue={handleScormValue}
          onComplete={handleScormComplete}
          style={ls.player}
        />

        {/* Minimal overlay controls */}
        <View style={[ls.overlay, { top: 12 }]}>
          <TouchableOpacity style={ls.overlayBtn} onPress={toggleLandscape} activeOpacity={0.8}>
            <Ionicons name="contract" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Portrait mode ─────────────────────────────────────────────────────────

  return (
    <View style={[p.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* ── Top nav bar ─────────────────────────────────────────────────── */}
      <View style={p.navBar}>
        {/* Back */}
        <TouchableOpacity style={p.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <Ionicons name="chevron-back" size={18} color={colors.gray[900]} />
        </TouchableOpacity>

        {/* Title */}
        <View style={p.titleBlock}>
          <Text style={p.courseTitle} numberOfLines={1}>{courseTitle}</Text>
          <Text style={p.chapterSubtitle} numberOfLines={1}>
            {chapterIndex}. {chapterTitle}
          </Text>
        </View>

        {/* Bookmark */}
        <TouchableOpacity
          style={p.iconBtn}
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

      {/* ── White card body ───────────────────────────────────────────────── */}
      <View style={p.cardWrap}>
        <View style={p.card}>
          <ScrollView
            style={p.cardScroll}
            contentContainerStyle={p.cardScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Lesson heading */}
            <Text style={p.lessonTitle}>Using a fire extinguisher</Text>
            <Text style={p.lessonMeta}>11 min watch</Text>

            {/* SCORM / video content area (16:9) */}
            <View style={p.playerWrap}>
              <ScormPlayer
                ref={scormRef}
                uri={scormUri}
                onScormValue={handleScormValue}
                onComplete={handleScormComplete}
                style={p.player}
              />
            </View>

            {/* Transcript */}
            <Text style={p.transcript}>{TRANSCRIPT}</Text>

            <View style={{ height: 16 }} />
          </ScrollView>
        </View>
      </View>

      {/* ── Bottom controls bar ───────────────────────────────────────────── */}
      <View style={[p.bottomArea, { paddingBottom: insets.bottom + 12 }]}>
        {/* Auxiliary controls row */}
        <View style={p.auxRow}>
          {/* Share */}
          <TouchableOpacity style={p.auxBtn} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={18} color={colors.gray[500]} />
          </TouchableOpacity>

          {/* Playback group */}
          <View style={p.playGroup}>
            {/* Settings */}
            <TouchableOpacity style={p.auxBtn} activeOpacity={0.7}>
              <Ionicons name="settings-outline" size={18} color={colors.gray[500]} />
            </TouchableOpacity>

            {/* Play / Pause */}
            <TouchableOpacity
              style={p.playBtn}
              onPress={() => {
                const js = isPlaying
                  ? `document.querySelectorAll('video').forEach(v=>v.pause()); true;`
                  : `document.querySelectorAll('video').forEach(v=>v.play()); true;`;
                scormRef.current?.injectJS(js);
                setIsPlaying((v) => !v);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={18}
                color={colors.gray[900]}
              />
            </TouchableOpacity>

            {/* Mute */}
            <TouchableOpacity
              style={p.auxBtn}
              onPress={() => {
                const js = `document.querySelectorAll('video').forEach(v=>v.muted=!v.muted); true;`;
                scormRef.current?.injectJS(js);
                setIsMuted((v) => !v);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isMuted ? 'volume-mute-outline' : 'volume-medium-outline'}
                size={18}
                color={colors.gray[500]}
              />
            </TouchableOpacity>
          </View>

          {/* Right group */}
          <View style={p.rightGroup}>
            {/* Fullscreen */}
            <TouchableOpacity style={p.auxBtn} onPress={toggleLandscape} activeOpacity={0.7}>
              <Ionicons name="expand-outline" size={18} color={colors.gray[500]} />
            </TouchableOpacity>

            {/* Captions/text */}
            <TouchableOpacity style={p.auxBtn} activeOpacity={0.7}>
              <Ionicons name="text-outline" size={18} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={[p.ctaBtn, completed && p.ctaBtnDone]}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={p.ctaText}>{completed ? '✓  Completed' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Portrait styles ──────────────────────────────────────────────────────────

const p = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },

  // Nav
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 16,
    backgroundColor: colors.gray[200],
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  courseTitle: {
    fontSize: fontSizes.base,
    fontWeight: '800',
    color: colors.gray[900],
  },
  chapterSubtitle: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.gray[500],
  },
  iconBtn: {
    width: 32, height: 32, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  // White card
  cardWrap: {
    flex: 1,
    paddingHorizontal: 8,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#241040',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  cardScroll: { flex: 1 },
  cardScrollContent: { padding: 16, gap: 8 },

  // Lesson heading
  lessonTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.gray[900],
    lineHeight: 28,
  },
  lessonMeta: {
    fontSize: fontSizes.xs,
    fontWeight: '500',
    color: colors.gray[500],
    marginBottom: 4,
  },

  // SCORM player — 16:9 aspect inside card
  playerWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  player: {
    flex: 1,
    borderRadius: 0,
  },

  // Transcript
  transcript: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.gray[500],
    lineHeight: 22,
    marginTop: 8,
  },

  // Bottom controls
  bottomArea: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  auxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  auxBtn: {
    width: 40, height: 40, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  playGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playBtn: {
    width: 40, height: 40, borderRadius: 16,
    backgroundColor: colors.gray[200],
    alignItems: 'center', justifyContent: 'center',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },

  // CTA
  ctaBtn: {
    height: 48,
    backgroundColor: '#292929',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnDone: { backgroundColor: '#16A34A' },
  ctaText: { fontSize: fontSizes.base, fontWeight: '800', color: colors.white },
});

// ─── Landscape styles ─────────────────────────────────────────────────────────

const ls = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  player: {
    flex: 1,
    borderRadius: 0,
  },
  overlay: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  overlayBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center',
  },
});
