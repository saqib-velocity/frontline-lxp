import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { KingWingLogo } from '@/components/KingWingLogo';
import { colors, fontSizes, radii } from '@/constants/tokens';

const BRAND = '#C24806';

// ─── App tiles ────────────────────────────────────────────────────────────────

type AppTileData = {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  badge?: number;
  comingSoon?: boolean;
};

const TILES: AppTileData[] = [
  {
    id: 'engage',
    label: 'Engage',
    icon: 'people-outline',
    iconColor: '#DC2626',
  },
  {
    id: 'my-team',
    label: 'My Team',
    icon: 'grid-outline',
    iconColor: '#7C3AED',
    badge: 3,
  },
  {
    id: 'shift',
    label: 'Shift Management',
    icon: 'calendar-outline',
    iconColor: BRAND,
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: 'bar-chart-outline',
    iconColor: BRAND,
  },
  {
    id: 'coming-soon',
    label: 'Coming soon',
    icon: 'star-outline',
    iconColor: colors.gray[400],
    comingSoon: true,
  },
];

// ─── Single tile ──────────────────────────────────────────────────────────────

function AppTile({ tile }: { tile: AppTileData }) {
  return (
    <TouchableOpacity
      style={[styles.tile, tile.comingSoon && styles.tileDisabled]}
      activeOpacity={tile.comingSoon ? 1 : 0.8}
      disabled={tile.comingSoon}
    >
      {/* Icon square */}
      <View style={styles.iconWrap}>
        <Ionicons name={tile.icon} size={28} color={tile.iconColor} />

        {/* Badge */}
        {tile.badge != null && (
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>{tile.badge}</Text>
          </View>
        )}
      </View>

      <Text style={[styles.tileLabel, tile.comingSoon && styles.tileLabelDisabled]}>
        {tile.label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function AppGridScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <KingWingLogo width={84} height={36} />
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => router.push('/notifications' as never)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.iconBtn}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.iconBtn}
            >
              <Ionicons name="close" size={22} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Grid */}
      <FlatList
        data={TILES}
        keyExtractor={(t) => t.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <AppTile tile={item} />}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BRAND,
  },
  safeTop: {
    backgroundColor: BRAND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  iconBtn: { padding: 4 },

  grid: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  row: {
    gap: 12,
  },

  tile: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    padding: 16,
    gap: 10,
    minHeight: 120,
  },
  tileDisabled: {
    borderColor: 'rgba(255,255,255,0.12)',
    opacity: 0.6,
  },

  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BRAND,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },

  tileLabel: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.white,
  },
  tileLabelDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
});
