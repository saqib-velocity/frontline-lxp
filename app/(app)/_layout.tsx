import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { GlassTabBar } from '@/components/layout/GlassTabBar';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabBarIcon({
  name,
  color,
  size,
}: {
  name: IoniconName;
  color: string;
  size: number;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function AppLayout() {
  const breakpoint = useBreakpoint();
  const isDesktop = breakpoint === 'desktop';

  // Desktop web uses the built-in left rail — no custom glass bar needed
  if (Platform.OS === 'web' && isDesktop) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.brand.primary,
          tabBarInactiveTintColor: colors.gray[500],
          tabBarPosition: 'left',
          tabBarStyle: {
            backgroundColor: colors.white,
            borderRightColor: colors.gray[200],
            borderRightWidth: 1,
            width: 240,
            paddingTop: 32,
            paddingHorizontal: 12,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="learning"
          options={{
            title: 'Learning',
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon name={focused ? 'school' : 'school-outline'} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="my-team"
          options={{
            title: 'My team',
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="ask"
          options={{
            title: 'Ask',
            tabBarIcon: ({ size }) => (
              <TabBarIcon name="sparkles" color={colors.brand.primary} size={size} />
            ),
          }}
        />
      </Tabs>
    );
  }

  // Mobile / tablet / web-mobile: floating glass tab bar
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Hide the default tab bar chrome completely — our custom component handles everything
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="learning" options={{ title: 'Learning' }} />
      <Tabs.Screen name="my-team" options={{ title: 'My team' }} />
      <Tabs.Screen name="ask" options={{ title: 'Ask' }} />
    </Tabs>
  );
}
