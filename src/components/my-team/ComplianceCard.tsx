import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes, radii } from '@/constants/tokens';

interface Props {
  percentage: number;       // 0-100
  overdueCount: number;
  dueSoonCount: number;
}

export function ComplianceCard({ percentage, overdueCount, dueSoonCount }: Props) {
  const needsAction = overdueCount + dueSoonCount;

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.gray[500]} />
          <Text style={styles.title}>Compliance</Text>
        </View>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.trackOuter}>
        <View style={[styles.trackFill, { width: `${percentage}%` as any }]} />
      </View>

      {/* Warning box */}
      {needsAction > 0 && (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>{needsAction} Members need action</Text>
          <Text style={styles.warningMeta}>
            {overdueCount} Overdue · {dueSoonCount} due soon
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    padding: 16,
    marginHorizontal: 16,
    gap: 12,
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.gray[900],
  },
  percentage: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: '#16A34A',
  },
  trackOuter: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[200],
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  warningBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 2,
  },
  warningTitle: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.gray[900],
  },
  warningMeta: {
    fontSize: fontSizes.xs,
    color: colors.gray[500],
  },
});
