import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { GlassTabBar } from '@/components/layout/GlassTabBar';

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AppLayout() {
  const breakpoint = useBreakpoint();
  const isDesktop = Platform.OS === 'web' && breakpoint === 'desktop';

  if (isDesktop) {
    // Desktop web: left-rail sidebar (unchanged)
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

  // Mobile / tablet: floating glass pill tab bar
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Home' }} />
      <Tabs.Screen name="learning" options={{ title: 'Learning' }} />
      <Tabs.Screen name="my-team"  options={{ title: 'My team' }} />
      <Tabs.Screen name="ask"      options={{ title: 'Ask' }} />
    </Tabs>
  );
}
