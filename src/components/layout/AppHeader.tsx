import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KingWingLogo } from '@/components/KingWingLogo';
import { colors } from '@/constants/tokens';
import { useAppTheme } from '@/context/ThemeContext';

interface AppHeaderProps {
  onNotificationPress?: () => void;
}

export function AppHeader({ onNotificationPress }: AppHeaderProps) {
  const router = useRouter();
  const { tokens } = useAppTheme();

  function handleNotification() {
    if (onNotificationPress) onNotificationPress();
    else router.push('/notifications' as never);
  }

  return (
    <View style={[styles.container, { backgroundColor: tokens.headerBg }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.row}>
          {/* King Wing Logo */}
          <KingWingLogo width={84} height={36} />

          {/* Right actions: bell + profile avatar */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleNotification}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.iconButton}
            >
              <Ionicons name="notifications-outline" size={22} color={tokens.headerTint} />
            </TouchableOpacity>

            {/* Profile circle — navigates to profile/settings */}
            <TouchableOpacity
              onPress={() => router.push('/profile' as never)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.avatarBtn}
            >
              <Text style={styles.avatarText}>JD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.3,
  },
});
