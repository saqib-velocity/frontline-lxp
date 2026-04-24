import '../global.css';
import React, { useEffect, useRef } from 'react';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Platform } from 'react-native';
import {
  useFonts,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as Notifications from 'expo-notifications';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';

// ─── Notification handler (fires while app is foregrounded) ──────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Inner layout (uses ThemeContext for loading bg) ─────────────────────────

function InnerLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_800ExtraBold,
  });

  const { tokens } = useAppTheme();
  const router = useRouter();
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // Listen for taps on notifications and route to the correct screen
  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data?.screen as string | undefined;
        if (screen === 'survey-splash') {
          router.push('/survey-splash' as any);
        }
      },
    );

    return () => {
      responseListener.current?.remove();
    };
  }, [router]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.loadingBg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// ─── Root layout wraps everything in ThemeProvider ────────────────────────────

export default function RootLayout() {
  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}
