/**
 * Survey Splash Screen
 *
 * Shown when the user taps the survey push notification.
 * Full-screen orange brand background, large heading, a white survey card,
 * and a "Continue to dashboard" CTA.
 *
 * Figma: node 6383-89698
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, fontSizes, radii } from '@/constants/tokens';
import { KingWingLogo } from '@/components/KingWingLogo';
import { COMPANY_ONBOARDING_SURVEY } from '@/constants/survey';

export default function SurveySplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const survey = COMPANY_ONBOARDING_SURVEY;

  function goToDashboard() {
    router.replace('/(app)/' as any);
  }

  function goToSurvey() {
    router.push('/survey' as any);
  }

  return (
    // Orange base
    <View style={[s.root, { paddingTop: insets.top }]}>
      {/* Dark-to-transparent gradient overlay on top (Figma: rgba(0,0,0,0.3) → rgba(0,0,0,0) at 61%) */}
      <LinearGradient
        colors={['rgba(0,0,0,0.30)', 'rgba(0,0,0,0)']}
        locations={[0, 0.617]}
        style={s.topGradient}
        pointerEvents="none"
      />

      {/* ── Logo bar ─────────────────────────────────────────────────────────── */}
      <View style={s.logoBar}>
        <KingWingLogo width={92} height={32} />
      </View>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <View style={s.content}>
        <Text style={s.heading}>We want to{'\n'}hear from you!</Text>
        <Text style={s.subheading}>
          In less than 1 minute you let us know how we can improve your experience.
        </Text>

        {/* ── Survey card ──────────────────────────────────────────────────── */}
        <TouchableOpacity style={s.card} onPress={goToSurvey} activeOpacity={0.85}>
          <View style={s.cardRow}>
            {/* Clipboard icon box */}
            <View style={s.iconBox}>
              <Ionicons name="clipboard-outline" size={20} color={colors.gray[500]} />
            </View>

            {/* Text + meta */}
            <View style={s.cardTextBlock}>
              <View style={s.cardTitleRow}>
                <Text style={s.cardTitle} numberOfLines={1}>{survey.title}</Text>
                <TouchableOpacity style={s.cardArrow} activeOpacity={0.7} onPress={goToSurvey}>
                  <Ionicons name="chevron-forward" size={14} color={colors.gray[600]} />
                </TouchableOpacity>
              </View>
              <View style={s.cardMeta}>
                <Text style={s.metaText}>{survey.dueDate}</Text>
                <Text style={s.metaDot}> · </Text>
                <Ionicons name="timer-outline" size={12} color={colors.gray[500]} />
                <Text style={s.metaText}> {survey.estimatedMinutes} min</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Bottom CTA ───────────────────────────────────────────────────────── */}
      <View style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
        <TouchableOpacity style={s.ctaBtn} onPress={goToDashboard} activeOpacity={0.85}>
          <Text style={s.ctaText}>Continue to dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.brand.primary, // #C24806 orange
  },

  // Gradient overlay sits on top of everything, pointer-events none
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '62%',
  },

  // Logo
  logoBar: {
    height: 60,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  // Main content — vertically centred in the remaining space
  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    gap: 16,
  },
  heading: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 56,
  },
  subheading: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.white,
    lineHeight: 24,
    opacity: 0.92,
  },

  // Survey card
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: 'rgba(36,12,64,0.16)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTextBlock: {
    flex: 1,
    gap: 4,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardTitle: {
    flex: 1,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.gray[900],
  },
  cardArrow: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardMeta: {
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

  // Bottom CTA
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  ctaBtn: {
    height: 48,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // Ghost style — white text, no background fill (matches Figma)
  },
  ctaText: {
    fontSize: fontSizes.base,
    fontWeight: '800',
    color: colors.white,
  },
});
