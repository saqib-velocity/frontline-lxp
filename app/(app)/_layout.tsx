import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors } from '@/constants/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// ─── Glass background (iOS frosted bar) ───────────────────────────────────────

function TabBarGlass() {
  return (
    <BlurView
      tint="light"
      intensity={90}
      style={StyleSheet.absoluteFill}
    />
  );
}

// ─── Shared screen options ────────────────────────────────────────────────────

const MOBILE_BAR_STYLE = {
  position: 'absolute' as const,
  backgroundColor: 'transparent',
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: 'rgba(0,0,0,0.12)',
  elevation: 0,
  shadowOpacity: 0,
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AppLayout() {
  const breakpoint = useBreakpoint();
  const isDesktop = Platform.OS === 'web' && breakpoint === 'desktop';

  if (isDesktop) {
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
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="learning"
          options={{
            title: 'Learning',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'school' : 'school-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="my-team"
          options={{
            title: 'My team',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ask"
          options={{
            title: 'Ask',
            tabBarIcon: ({ focused }) => (
              <Ionicons name="sparkles" size={24} color={colors.brand.primary} />
            ),
          }}
        />
      </Tabs>
    );
  }

  // Mobile / tablet — frosted glass tab bar
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: MOBILE_BAR_STYLE,
        tabBarBackground: () => <TabBarGlass />,
        tabBarActiveTintColor: colors.gray[900],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Learning',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'school' : 'school-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-team"
        options={{
          title: 'My team',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ask"
        options={{
          title: 'Ask',
          tabBarActiveTintColor: colors.brand.primary,
          tabBarInactiveTintColor: colors.brand.primary,
          tabBarIcon: () => (
            <Ionicons name="sparkles" size={24} color={colors.brand.primary} />
          ),
        }}
      />
    </Tabs>
  );
}
