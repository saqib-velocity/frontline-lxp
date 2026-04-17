import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes, radii } from '@/constants/tokens';
import type { TeamMember, MemberStatus } from '@/types/team';

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  MemberStatus,
  { bg: string; text: string; icon: React.ComponentProps<typeof Ionicons>['name']; label: string }
> = {
  overdue:    { bg: '#FEE2E2', text: '#DC2626', icon: 'alert-circle',  label: 'Overdue'  },
  'due-soon': { bg: '#FFF7ED', text: '#EA580C', icon: 'warning',       label: 'Due Soon' },
  compliant:  { bg: '#DCFCE7', text: '#16A34A', icon: 'checkmark-circle', label: 'Compliant' },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  member: TeamMember;
  variant: 'needs-attention' | 'compliant';
  onMenuPress: (member: TeamMember) => void;
  showDivider?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TeamMemberRow({ member, variant, onMenuPress, showDivider }: Props) {
  const cfg = STATUS_CONFIG[member.status];

  return (
    <>
      <View style={styles.row}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: member.avatarColor }]}>
          {member.avatarUrl ? (
            <Image source={{ uri: member.avatarUrl }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.initials}>{member.initials}</Text>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{member.name}</Text>
          <View style={styles.meta}>
            {variant === 'compliant' ? (
              <>
                <Text style={styles.progressGreen}>{member.progress}%</Text>
                <Text style={styles.dot}>·</Text>
                <Ionicons name="calendar-outline" size={12} color={colors.gray[400]} />
                <Text style={styles.metaText}>{member.dueDate}</Text>
              </>
            ) : (
              <>
                <Text style={styles.metaText}>{member.progress}%</Text>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.metaText}>{member.dueDate}</Text>
                <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                  <Ionicons name={cfg.icon} size={11} color={cfg.text} />
                  <Text style={[styles.badgeLabel, { color: cfg.text }]}>{cfg.label}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Menu button */}
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => onMenuPress(member)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="ellipsis-vertical" size={16} color={colors.gray[500]} />
        </TouchableOpacity>
      </View>

      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImg: { width: '100%', height: '100%' },
  initials: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.white },
  info: { flex: 1, gap: 4 },
  name: { fontSize: fontSizes.base, fontWeight: '600', color: colors.gray[900] },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  metaText: { fontSize: fontSizes.xs, color: colors.gray[500] },
  progressGreen: { fontSize: fontSizes.xs, fontWeight: '700', color: '#16A34A' },
  dot: { fontSize: fontSizes.xs, color: colors.gray[300] },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  badgeLabel: { fontSize: fontSizes.xs, fontWeight: '600' },
  menuBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  divider: { height: 1, backgroundColor: colors.gray[100], marginHorizontal: 16 },
});
