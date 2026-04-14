import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes } from '@/constants/tokens';

interface AppHeaderProps {
  onNotificationPress?: () => void;
  onGridPress?: () => void;
}

export function AppHeader({ onNotificationPress, onGridPress }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.row}>
          {/* King Wing Logo */}
          <View style={styles.logoRow}>
            <Ionicons name="fast-food-outline" size={26} color={colors.white} />
            <View style={styles.logoTextBlock}>
              <Text style={styles.logoTextKing}>KING</Text>
              <Text style={styles.logoTextWing}>WING</Text>
            </View>
          </View>

          {/* Action icons */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onNotificationPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.iconButton}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onGridPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.iconButton}
            >
              <Ionicons name="grid-outline" size={22} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand.primary,
    paddingBottom: 12,
  },
  safeArea: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoTextBlock: {
    flexDirection: 'column',
  },
  logoTextKing: {
    fontSize: fontSizes.sm,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 1.5,
    lineHeight: 16,
  },
  logoTextWing: {
    fontSize: fontSizes.sm,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 1.5,
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
});
