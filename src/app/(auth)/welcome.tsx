import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { WelcomeBranding } from '@/components/welcome/WelcomeBranding';
import { WelcomeCTA } from '@/components/welcome/WelcomeCTA';
import { colors } from '@/constants/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function WelcomeScreen() {
  const router = useRouter();
  const breakpoint = useBreakpoint();
  const isDesktop = breakpoint === 'desktop';

  function handleGetStarted() {
    router.replace('/(app)/');
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView
        style={[styles.safeArea, isDesktop && styles.safeAreaDesktop]}
        edges={['top', 'left', 'right']}
      >
        <View style={[styles.inner, isDesktop && styles.innerDesktop]}>
          <WelcomeBranding />
          <WelcomeCTA onPress={handleGetStarted} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.brand.primary,
  },
  safeArea: {
    flex: 1,
  },
  // On desktop web, center the card
  safeAreaDesktop: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
  },
  innerDesktop: {
    flex: Platform.OS === 'web' ? undefined : 1,
    width: 420,
    minHeight: 680,
    paddingHorizontal: 40,
    backgroundColor: colors.brand.primary,
    borderRadius: 24,
    overflow: 'hidden',
  },
});
