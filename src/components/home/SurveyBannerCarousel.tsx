/**
 * SurveyBannerCarousel
 *
 * Two horizontally-swipeable survey prompt cards with dot-style page indicators.
 * Placed above the Mandatory Training card on the Home screen.
 *
 * Figma: node 6383-89652 (Dynamic Widget / carousel)
 *
 * Card design:
 *   - Background: dark orange-to-deep-red gradient + rgba(0,0,0,0.2) overlay
 *   - White title + light-grey subtitle + arrow icon
 *   - Border radius 20, shadow
 *
 * Dots:
 *   - Active: wide pill 24×8, #121212
 *   - Inactive: circle 8×8, #9f9f9f
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes } from '@/constants/tokens';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    title:    'We want to hear from you!',
    subtitle: 'In less than 1 minute you let us know how we can improve your experience.',
  },
  {
    title:    'Share your feedback!',
    subtitle: 'How likely are you to recommend us as a place to work?',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  /** Called when the user taps a card (e.g. to open survey) */
  onPress?: () => void;
}

export function SurveyBannerCarousel({ onPress }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  // Card fills edge-to-edge within the 16px horizontal padding of the parent
  const cardWidth = screenWidth - 32;

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const x   = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / cardWidth);
    setActiveIndex(Math.max(0, Math.min(idx, SLIDES.length - 1)));
  }

  return (
    <View style={s.container}>
      {/* ── Horizontally scrollable cards ──────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={cardWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{ gap: 8 }}
        style={s.scroll}
      >
        {SLIDES.map((slide, i) => (
          <TouchableOpacity
            key={i}
            style={{ width: cardWidth }}
            onPress={onPress}
            activeOpacity={0.88}
          >
            {/* Orange → deep-red gradient base */}
            <LinearGradient
              colors={['#D56700', '#8B0000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.card}
            >
              {/* Dark overlay (Figma: rgba(0,0,0,0.2)) */}
              <View style={s.overlay} />

              {/* Content row */}
              <View style={s.cardContent}>
                {/* Text block */}
                <View style={s.textBlock}>
                  <Text style={s.cardTitle}>{slide.title}</Text>
                  <Text style={s.cardSubtitle}>{slide.subtitle}</Text>
                </View>

                {/* Arrow icon */}
                <View style={s.arrowWrap}>
                  <Ionicons name="chevron-forward" size={16} color={colors.white} />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Dot indicators ─────────────────────────────────────────────────── */}
      <View style={s.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[s.dot, i === activeIndex ? s.dotActive : s.dotInactive]}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    gap: 16,
    // No horizontal padding — parent (home screen) already has paddingHorizontal: 16
  },

  scroll: {
    overflow: 'visible',
  },

  card: {
    height: 108,
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    // Elevation shadow
    shadowColor: 'rgba(36,12,64,0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },

  // rgba(0,0,0,0.2) overlay on top of gradient
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderRadius: 20,
  },

  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    // Sits on top of the overlay
    zIndex: 1,
  },

  textBlock: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 28,
  },
  cardSubtitle: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: '#E3E3E3',
    lineHeight: 22,
  },

  arrowWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // ── Dots ──
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    height: 8,
    borderRadius: 8,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#121212',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#9f9f9f',
  },
});
