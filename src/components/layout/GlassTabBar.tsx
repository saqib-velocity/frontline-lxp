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
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/tokens';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

/** Approximate pill height — screens use this for scroll padding */
export const GLASS_TAB_BAR_HEIGHT = 68;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  routeName: string;
  label: string;
  icon: IoniconName;
  iconOutline: IoniconName;
  alwaysBrand?: boolean;
}

const TABS: TabConfig[] = [
  { routeName: 'index',    label: 'Home',     icon: 'home',      iconOutline: 'home-outline' },
  { routeName: 'learning', label: 'Learning', icon: 'school',    iconOutline: 'school-outline' },
  { routeName: 'my-team',  label: 'My team',  icon: 'people',    iconOutline: 'people-outline' },
  { routeName: 'ask',      label: 'Ask',      icon: 'sparkles',  iconOutline: 'sparkles', alwaysBrand: true },
];

// ─── Single tab item ──────────────────────────────────────────────────────────

interface TabItemProps {
  config: TabConfig;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({ config, focused, onPress, onLongPress }: TabItemProps) {
  const iconColor = config.alwaysBrand
    ? colors.brand.primary
    : focused ? colors.gray[900] : colors.gray[400];
  const labelColor = iconColor;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={config.label}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      activeOpacity={0.65}
    >
      {/* Active dot above icon */}
      {focused && !config.alwaysBrand && (
        <View style={styles.activeDot} />
      )}

      <Ionicons
        name={focused ? config.icon : config.iconOutline}
        size={23}
        color={iconColor}
      />
      <Text style={[styles.label, { color: labelColor }, focused && styles.labelActive]}>
        {config.label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Glass pill container ─────────────────────────────────────────────────────

export function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

  const tabs = state.routes.map((route, index) => {
    const config = TABS.find((t) => t.routeName === route.name);
    if (!config) return null;
    const focused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
    };
    const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

    return (
      <TabItem
        key={route.key}
        config={config}
        focused={focused}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    );
  });

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPad }]} pointerEvents="box-none">
      <View style={styles.shadow}>
        {Platform.OS === 'web' ? (
          <View style={[styles.pill, styles.pillWeb]}>
            <View style={styles.row}>{tabs}</View>
          </View>
        ) : (
          <BlurView intensity={85} tint="light" style={styles.pill}>
            {/* Very light tint so blur texture shows through */}
            <View style={styles.tintLayer} />
            <View style={styles.row}>{tabs}</View>
          </BlurView>
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const R = 26; // pill border radius

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },

  /** Separate shadow wrapper — BlurView can't have shadow on iOS */
  shadow: {
    borderRadius: R,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 18,
    backgroundColor: 'rgba(255,255,255,0.01)', // needed for iOS shadow
  },

  pill: {
    borderRadius: R,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.55)',
  },

  /** Web frosted glass via CSS */
  pillWeb: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    // @ts-ignore — web-only
    backdropFilter: 'blur(18px) saturate(180%)',
    WebkitBackdropFilter: 'blur(18px) saturate(180%)',
  },

  /**
   * Very light white overlay — just enough to brighten the blur so icons pop,
   * but translucent enough to let the frosted texture show through.
   */
  tintLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.38)',
  },

  row: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 10,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  activeDot: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.gray[900],
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
