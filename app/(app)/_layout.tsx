import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors } from '@/constants/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// ─── Blurred tab bar background (iOS glass) ───────────────────────────────────

function TabBarBackground() {
  return (
    <BlurView
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

// ─── Icon helper ──────────────────────────────────────────────────────────────

function icon(focused: boolean, active: IoniconName, inactive: IoniconName, color: string) {
  return <Ionicons name={focused ? active : inactive} size={24} color={color} />;
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AppLayout() {
  const breakpoint = useBreakpoint();
  const isDesktop = Platform.OS === 'web' && breakpoint === 'desktop';

  if (isDesktop) {
    // Desktop web: left-rail sidebar (no blur needed)
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.brand.primary,
          tabBarInactiveTintColor: colors.gray[400],
          tabBarPosition: 'left',
          tabBarStyle: {
            backgroundColor: colors.white,
            borderRightColor: colors.gray[200],
            borderRightWidth: 1,
            width: 240,
            paddingTop: 32,
            paddingHorizontal: 12,
          },
          tabBarLabelStyle: { fontSize: 13, fontWeight: '500' },
        }}
      >
        {screens()}
      </Tabs>
    );
  }

  // Mobile / tablet: standard iOS-style tab bar with glass background
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Make tab bar float over content so the blur shows the screen behind it
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: 'rgba(0,0,0,0.15)',
          elevation: 0,        // Android: remove shadow behind the blur
          shadowOpacity: 0,    // iOS: remove default shadow (blur provides depth)
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarActiveTintColor: colors.gray[900],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginBottom: 2,
        },
      }}
    >
      {screens()}
    </Tabs>
  );
}

function screens() {
  return (
    <>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) =>
            icon(focused, 'home', 'home-outline', color),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Learning',
          tabBarIcon: ({ color, focused }) =>
            icon(focused, 'school', 'school-outline', color),
        }}
      />
      <Tabs.Screen
        name="my-team"
        options={{
          title: 'My team',
          tabBarIcon: ({ color, focused }) =>
            icon(focused, 'people', 'people-outline', color),
        }}
      />
      <Tabs.Screen
        name="ask"
        options={{
          title: 'Ask',
          // Always brand-orange — AI assistant is always highlighted
          tabBarIcon: ({ focused }) =>
            icon(focused, 'sparkles', 'sparkles', colors.brand.primary),
          tabBarActiveTintColor: colors.brand.primary,
          tabBarInactiveTintColor: colors.brand.primary,
        }}
      />
    </>
  );
}
