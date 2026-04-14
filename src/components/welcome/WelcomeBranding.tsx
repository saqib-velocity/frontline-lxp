import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes } from '@/constants/tokens';

export function WelcomeBranding() {
  return (
    <View style={styles.container}>
      {/* King Wing Logo placeholder — replace with <Image> when asset is available */}
      <View style={styles.logoRow}>
        <Ionicons name="fast-food-outline" size={36} color={colors.white} />
        <View style={styles.logoTextBlock}>
          <Text style={styles.logoTextKing}>KING</Text>
          <Text style={styles.logoTextWing}>WING</Text>
        </View>
      </View>

      <Text style={styles.heading}>Welcome{'\n'}aboard!</Text>
      <Text style={styles.subtitle}>
        Let's start your journey at King Wing.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 48,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
  },
  logoTextBlock: {
    flexDirection: 'column',
  },
  logoTextKing: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 2,
    lineHeight: 22,
  },
  logoTextWing: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 2,
    lineHeight: 22,
  },
  heading: {
    fontSize: fontSizes['3xl'],
    fontWeight: '900',
    color: colors.white,
    lineHeight: fontSizes['3xl'] * 1.1,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.white,
    opacity: 0.9,
    lineHeight: fontSizes.base * 1.5,
  },
});
