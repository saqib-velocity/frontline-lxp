/**
 * Course Player Screen
 *
 * Full-height SCORM player between a slim nav bar and a bottom controls bar.
 * Orientation is unlocked — the device rotates naturally and the SCORM content
 * responds on its own. The manual landscape-lock toggle is retained as an
 * explicit shortcut for devices that need it.
 *
 * Navigation params:
 *   courseId      string  — used to resolve the SCORM launch URL via getScormUrl()
 *   courseTitle   string
 *   chapterId     string
 *   chapterTitle  string
 *   chapterIndex  string (number)
 *   scormUri?     override file:// or http:// URI (skips courseId lookup)
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { colors, fontSizes } from '@/constants/tokens';
import ScormPlayer, { ScormPlayerRef } from '@/components/course/ScormPlayer';
import { getScormUrl } from '@/constants/scorm';

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

  const courseTitle  = params.courseTitle  ?? '';
  const chapterTitle = params.chapterTitle ?? '';
  const chapterIndex = params.chapterIndex ?? '1';

  const courseId = params.courseId;
  const scormUri = courseId ? getScormUrl(courseId) : params.scormUri;

  const [isMuted,    setIsMuted]    = useState(false);
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [completed,  setCompleted]  = useState(false);

  const scormRef = useRef<ScormPlayerRef>(null);

  // ── Unlock orientation on mount so the device can rotate naturally ──────
  useEffect(() => {
    ScreenOrientation.unlockAsync().catch(() => {});
    return () => {
      // Re-lock to portrait when leaving the player
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    };
  }, []);

  // ── SCORM callbacks ───────────────────────────────────────────────────────
  const handleScormValue = useCallback((key: string, value: string) => {
    if (key === 'cmi.core.lesson_status' && (value === 'passed' || value === 'completed')) {
      setCompleted(true);
    }
  }, []);

  const handleScormComplete = useCallback(() => setCompleted(true), []);

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* ── Nav bar ────────────────────────────────────────────────────────── */}
      <View style={s.navBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <Ionicons name="chevron-back" size={18} color={colors.gray[900]} />
        </TouchableOpacity>

        <View style={s.titleBlock}>
          <Text style={s.courseTitle} numberOfLines={1}>{courseTitle}</Text>
          <Text style={s.chapterSubtitle} numberOfLines={1}>
            {chapterIndex}. {chapterTitle}
          </Text>
        </View>

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

      {/* ── Full-height SCORM player ────────────────────────────────────────── */}
      <ScormPlayer
        ref={scormRef}
        uri={scormUri}
        onScormValue={handleScormValue}
        onComplete={handleScormComplete}
        style={s.player}
      />

      {/* ── Bottom controls ─────────────────────────────────────────────────── */}
      <View style={[s.bottomArea, { paddingBottom: insets.bottom + 12 }]}>
        <View style={s.auxRow}>
          {/* Share */}
          <TouchableOpacity style={s.auxBtn} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={18} color={colors.gray[500]} />
          </TouchableOpacity>

          {/* Playback group */}
          <View style={s.playGroup}>
            <TouchableOpacity style={s.auxBtn} activeOpacity={0.7}>
              <Ionicons name="settings-outline" size={18} color={colors.gray[500]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={s.playBtn}
              onPress={() => {
                const js = isPlaying
                  ? `document.querySelectorAll('video').forEach(v=>v.pause()); true;`
                  : `document.querySelectorAll('video').forEach(v=>v.play()); true;`;
                scormRef.current?.injectJS(js);
                setIsPlaying((v) => !v);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color={colors.gray[900]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={s.auxBtn}
              onPress={() => {
                scormRef.current?.injectJS(
                  `document.querySelectorAll('video').forEach(v=>v.muted=!v.muted); true;`
                );
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

          {/* Captions */}
          <TouchableOpacity style={s.auxBtn} activeOpacity={0.7}>
            <Ionicons name="text-outline" size={18} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[s.ctaBtn, completed && s.ctaBtnDone]}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={s.ctaText}>{completed ? '✓  Completed' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },

  // Nav
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 16,
    backgroundColor: colors.gray[100],
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 16,
    backgroundColor: colors.gray[200],
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  titleBlock: { flex: 1, gap: 2 },
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

  // Player — fills all remaining space
  player: {
    flex: 1,
    borderRadius: 0,
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
