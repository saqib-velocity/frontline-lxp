import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KingWingLogo } from '@/components/KingWingLogo';
import { colors } from '@/constants/tokens';

interface AppHeaderProps {
  onNotificationPress?: () => void;
  onGridPress?: () => void;
}

export function AppHeader({ onNotificationPress, onGridPress }: AppHeaderProps) {
  const router = useRouter();

  function handleNotification() {
    if (onNotificationPress) onNotificationPress();
    else router.push('/notifications' as never);
  }

  function handleGrid() {
    if (onGridPress) onGridPress();
    else router.push('/app-grid' as never);
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.row}>
          {/* King Wing Logo */}
          <KingWingLogo width={84} height={36} />

          {/* Action icons */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleNotification}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.iconButton}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGrid}
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
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
});
