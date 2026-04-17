import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Approximate height of the glass tab bar (icon + label + padding). Add safe-area bottom yourself. */
export const GLASS_TAB_BAR_HEIGHT = 72;
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/tokens';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  routeName: string;
  label: string;
  icon: IoniconName;
  iconOutline: IoniconName;
  /** Tab icon is always brand-orange regardless of focus state */
  alwaysBrand?: boolean;
}

const TABS: TabConfig[] = [
  {
    routeName: 'index',
    label: 'Home',
    icon: 'home',
    iconOutline: 'home-outline',
  },
  {
    routeName: 'learning',
    label: 'Learning',
    icon: 'school',
    iconOutline: 'school-outline',
  },
  {
    routeName: 'my-team',
    label: 'My team',
    icon: 'people',
    iconOutline: 'people-outline',
  },
  {
    routeName: 'ask',
    label: 'Ask',
    icon: 'sparkles',
    iconOutline: 'sparkles',
    alwaysBrand: true,
  },
];

// ─── Tab item ─────────────────────────────────────────────────────────────────

interface TabItemProps {
  config: TabConfig;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({ config, focused, onPress, onLongPress }: TabItemProps) {
  const iconColor = config.alwaysBrand
    ? colors.brand.primary
    : focused
    ? colors.gray[900]
    : colors.gray[400];

  const labelColor = config.alwaysBrand
    ? colors.brand.primary
    : focused
    ? colors.gray[900]
    : colors.gray[400];

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={config.label}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      activeOpacity={0.7}
    >
      {/* Active pill indicator */}
      {focused && !config.alwaysBrand && (
        <View style={styles.activePill} />
      )}

      <View style={styles.tabInner}>
        <Ionicons
          name={focused ? config.icon : config.iconOutline}
          size={22}
          color={iconColor}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: labelColor },
            focused && !config.alwaysBrand && styles.tabLabelActive,
          ]}
          numberOfLines={1}
        >
          {config.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Glass Tab Bar ─────────────────────────────────────────────────────────────

export function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}
      pointerEvents="box-none"
    >
      {/* Glass pill container */}
      <View style={styles.pill}>
        {Platform.OS === 'web' ? (
          /* Web: CSS backdrop-filter via inline style */
          <View style={[styles.pillInner, styles.pillWeb]}>
            {renderTabs(state, navigation)}
          </View>
        ) : (
          /* Native: expo-blur BlurView */
          <BlurView
            intensity={72}
            tint="systemUltraThinMaterialLight"
            style={styles.pillInner}
          >
            {/* Frosted white overlay to lighten the blur */}
            <View style={styles.pillOverlay} />
            {renderTabs(state, navigation)}
          </BlurView>
        )}
      </View>
    </View>
  );

  function renderTabs(
    navState: typeof state,
    nav: typeof navigation,
  ) {
    return (
      <View style={styles.tabsRow}>
        {navState.routes.map((route, index) => {
          const config = TABS.find((t) => t.routeName === route.name);
          if (!config) return null;

          const focused = navState.index === index;

          const onPress = () => {
            const event = nav.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              nav.navigate(route.name);
            }
          };

          const onLongPress = () => {
            nav.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <TabItem
              key={route.key}
              config={config}
              focused={focused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    );
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const PILL_RADIUS = 28;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    // Allow touches to pass through transparent areas
    backgroundColor: 'transparent',
  },

  pill: {
    width: '100%',
    borderRadius: PILL_RADIUS,
    overflow: 'hidden',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    // Shadow (Android)
    elevation: 16,
    backgroundColor: 'transparent',
  },

  pillInner: {
    borderRadius: PILL_RADIUS,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },

  pillWeb: {
    // Web fallback — semi-transparent white + backdrop-filter via web style
    backgroundColor: 'rgba(255,255,255,0.80)',
    // @ts-ignore web-only style
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  },

  /** Semi-transparent white layer on top of BlurView to lighten frosted effect */
  pillOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: PILL_RADIUS,
  },

  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  /** Subtle horizontal bar under active tab icon */
  activePill: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.gray[900],
  },

  tabInner: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.1,
  },

  tabLabelActive: {
    fontWeight: '700',
  },
});
