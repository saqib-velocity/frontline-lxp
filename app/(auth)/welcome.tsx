import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// King Wing logo — white SVG from Figma (replace with local asset: require('../../assets/images/king-wing-logo.png'))
const KING_WING_LOGO = 'https://www.figma.com/api/mcp/asset/9b9bcc27-86a6-40ee-bc77-93fbc783e907';

// Brand color exactly from Figma: rgb(194, 72, 6)
const BRAND = '#C24806';

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTabletOrDesktop = width >= 768;

  function handleGetStarted() {
    router.replace('/(app)/');
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Solid brand background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: BRAND }]} />

      {/* Dark gradient overlay at top — matches Figma: rgba(0,0,0,0.3)→transparent, stops at 61.7% */}
      <LinearGradient
        colors={['rgba(0,0,0,0.30)', 'rgba(0,0,0,0.00)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.617 }}
        pointerEvents="none"
      />

      {/* Centering wrapper for tablet/desktop */}
      <View style={[styles.centeredWrapper, isTabletOrDesktop && styles.centeredWrapperDesktop]}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

          {/* Content: two equal flex sections (exactly matches Figma flex layout) */}
          <View style={styles.content}>

            {/* Section 1 (flex:1): empty space with logo pinned to bottom-left */}
            <View style={styles.logoSection}>
              <Image
                source={{ uri: KING_WING_LOGO }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Section 2 (flex:1): heading then subtitle, aligned to top */}
            <View style={styles.textSection}>
              <Text style={styles.heading}>Welcome aboard!</Text>
              <Text style={styles.subtitle}>
                Let's start your journey at King Wing.
              </Text>
            </View>

          </View>

          {/* Bottom nav area — matches Figma nav-bottom: p:16 */}
          <View style={styles.navBottom}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleGetStarted}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Let's go!</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centeredWrapper: {
    flex: 1,
  },
  // On tablet/desktop: show as a centered card
  centeredWrapperDesktop: {
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  safeArea: {
    flex: 1,
  },
  // Main content: two flex-1 children + 16px gap, 16px horizontal padding, 12px vertical
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },
  // Section 1 — fills upper half, logo sits at very bottom-left
  logoSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  // King Wing logo: exactly 167×72 from Figma
  logo: {
    width: 167,
    height: 72,
  },
  // Section 2 — fills lower half, text starts at the top
  textSection: {
    flex: 1,
    gap: 16,
    justifyContent: 'flex-start',
  },
  // "Welcome aboard!" — Plus Jakarta Sans ExtraBold 48/60
  heading: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 48,
    lineHeight: 60,
    color: '#FFFFFF',
  },
  // Subtitle — Plus Jakarta Sans SemiBold 16/24
  subtitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  // Bottom area: p:16 all sides
  navBottom: {
    padding: 16,
  },
  // Button — h:48, radius:20, bg:#E1E1E1 (matches Figma --fill/neutral/neutral-full)
  button: {
    backgroundColor: '#E1E1E1',
    height: 48,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  // Button label — Plus Jakarta Sans ExtraBold 16/20, dark text
  buttonText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 16,
    lineHeight: 20,
    color: '#121212',
  },
});
