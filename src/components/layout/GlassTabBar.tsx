import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSizes } from '@/constants/tokens';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// ─── Exported height — screens use this for scroll padding ───────────────────
export const GLASS_TAB_BAR_HEIGHT = 76;

// ─── Tab config ───────────────────────────────────────────────────────────────
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabCfg {
  routeName: string;
  label: string;
  icon: IoniconName;
  iconOutline: IoniconName;
  gradient?: boolean; // renders gradient SVG instead of Ionicon
}

const TABS: TabCfg[] = [
  { routeName: 'index',    label: 'Home',     icon: 'home',      iconOutline: 'home-outline' },
  { routeName: 'learning', label: 'Learning', icon: 'school',    iconOutline: 'school-outline' },
  { routeName: 'my-team',  label: 'My team',  icon: 'people',    iconOutline: 'people-outline' },
  { routeName: 'ask',      label: 'Ask',      icon: 'sparkles',  iconOutline: 'sparkles', gradient: true },
];

// ─── Gradient sparkles SVG for Ask tab ───────────────────────────────────────

const SPARKLES_SVG = (size: number) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="1" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="#C026D3"/>
      <stop offset="48%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#FBBF24"/>
    </linearGradient>
  </defs>
  <path d="M12 2 L13.6 7.6 L19.5 9 L13.6 10.4 L12 16 L10.4 10.4 L4.5 9 L10.4 7.6 Z"
        fill="url(#g)"/>
  <path d="M19.5 2 L20.5 5 L23.5 6 L20.5 7 L19.5 10 L18.5 7 L15.5 6 L18.5 5 Z"
        fill="url(#g)"/>
  <path d="M5.5 14 L6.3 16.7 L9 17.5 L6.3 18.3 L5.5 21 L4.7 18.3 L2 17.5 L4.7 16.7 Z"
        fill="url(#g)"/>
</svg>`;

function GradientSparkles({ size = 24 }: { size?: number }) {
  return <SvgXml xml={SPARKLES_SVG(size)} width={size} height={size} />;
}

// ─── GlassTabBar ─────────────────────────────────────────────────────────────

export function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const screenW = Dimensions.get('window').width;

  // Pill width (measured via onLayout, estimated initially)
  const [pillW, setPillW] = useState(screenW - 32);
  const tabW = pillW / TABS.length;

  // Animated X position of the white active bubble
  const bubbleX = useRef(new Animated.Value(state.index * tabW)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // Snap immediately on mount — no animation
      bubbleX.setValue(state.index * tabW);
      isFirstRender.current = false;
      return;
    }
    // Spring-animate bubble to new tab
    Animated.spring(bubbleX, {
      toValue: state.index * tabW,
      tension: 130,
      friction: 16,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabW]);

  // Re-snap when pill width is measured
  useEffect(() => {
    bubbleX.setValue(state.index * (pillW / TABS.length));
  }, [pillW]);

  function handlePress(route: typeof state.routes[0], index: number) {
    const focused = state.index === index;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
  }

  const bottomPad = Math.max(insets.bottom, 8);

  return (
    /**
     * Outer wrapper — sits in normal layout flow so React Navigation can
     * measure its height for useBottomTabBarHeight(). The visual pill
     * is inset/floated inside via padding.
     */
    <View style={[styles.wrapper, { paddingBottom: bottomPad }]}>

      {/* Shadow host — BlurView can't cast shadows on iOS, so we wrap it */}
      <View
        style={styles.shadowHost}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && Math.abs(w - pillW) > 1) setPillW(w);
        }}
      >
        {Platform.OS === 'web' ? (
          /* Web: CSS backdrop-filter */
          <View style={[styles.pill, styles.pillWeb]}>
            {renderPillContent()}
          </View>
        ) : (
          /* Native: expo-blur */
          <BlurView intensity={78} tint="light" style={styles.pill}>
            {/* Subtle white tint — just enough to brighten the blur */}
            <View style={styles.tint} />
            {renderPillContent()}
          </BlurView>
        )}
      </View>
    </View>
  );

  function renderPillContent() {
    return (
      <View style={styles.pillContent}>

        {/* ── Animated white active bubble ───────────────────────────── */}
        <Animated.View
          style={[
            styles.bubble,
            {
              width: tabW - 8,  // 4px margin each side
              transform: [{ translateX: bubbleX }],
            },
          ]}
        />

        {/* ── Tab items (rendered above bubble via zIndex) ────────────── */}
        {state.routes.map((route, index) => {
          const cfg = TABS.find((t) => t.routeName === route.name);
          if (!cfg) return null;
          const focused = state.index === index;
          const iconColor = cfg.gradient
            ? undefined  // gradient handles color
            : focused ? colors.gray[900] : colors.gray[500];

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={() => handlePress(route, index)}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              activeOpacity={1}
              accessibilityRole="button"
              accessibilityLabel={cfg.label}
            >
              {cfg.gradient ? (
                <GradientSparkles size={23} />
              ) : (
                <Ionicons
                  name={focused ? cfg.icon : cfg.iconOutline}
                  size={23}
                  color={iconColor}
                />
              )}
              <Text
                style={[
                  styles.label,
                  { color: cfg.gradient ? '#F97316' : iconColor },
                  focused && styles.labelActive,
                ]}
              >
                {cfg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const PILL_R = 26;
const BUBBLE_R = 20;

const styles = StyleSheet.create({
  /** Non-absolute wrapper — fills layout flow so navigation measures height */
  wrapper: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  /** Separate shadow host — BlurView clips shadows on iOS */
  shadowHost: {
    borderRadius: PILL_R,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 16,
    // tiny background so iOS shadow renders
    backgroundColor: 'rgba(255,255,255,0.01)',
  },

  /** The frosted glass pill */
  pill: {
    borderRadius: PILL_R,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.6)',
  },

  pillWeb: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    // @ts-ignore — web-only CSS properties not in RN types
    backdropFilter: 'blur(18px) saturate(180%)',
    // @ts-ignore
    WebkitBackdropFilter: 'blur(18px) saturate(180%)',
  },

  /** Light white tint over blur so icons stay readable */
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.32)',
    borderRadius: PILL_R,
  },

  /** Inner row that contains bubble + tabs */
  pillContent: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 5,
    position: 'relative',
    alignItems: 'center',
  },

  /** White active bubble — slides behind the active tab item */
  bubble: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    left: 4,          // initial left offset, translateX moves it
    borderRadius: BUBBLE_R,
    backgroundColor: colors.white,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 9,
    zIndex: 1,           // sit above the bubble
  },

  label: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  labelActive: {
    fontWeight: '700',
  },
});
