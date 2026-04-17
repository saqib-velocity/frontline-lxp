import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSizes, radii } from '@/constants/tokens';
import type { TeamMember } from '@/types/team';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H = SCREEN_H * 0.52;

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { bg: string; text: string; icon: React.ComponentProps<typeof Ionicons>['name']; label: string }> = {
  overdue:    { bg: '#FEE2E2', text: '#DC2626', icon: 'alert-circle',  label: 'Overdue'  },
  'due-soon': { bg: '#FFF7ED', text: '#EA580C', icon: 'warning',       label: 'Due soon' },
  compliant:  { bg: '#DCFCE7', text: '#16A34A', icon: 'checkmark-circle', label: 'Compliant' },
};

// ─── Actions list ─────────────────────────────────────────────────────────────

const ACTIONS: {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  subtitle?: string;
}[] = [
  { id: 'extend',  icon: 'calendar-outline',     label: 'Extend training due date' },
  { id: 'nudge',   icon: 'notifications-outline', label: 'Nudge', subtitle: 'Notify user to complete training' },
  { id: 'message', icon: 'chatbubble-outline',    label: 'Message' },
  { id: 'oneone',  icon: 'list-outline',          label: 'Add as 1:1 item' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  member: TeamMember | null;
  onClose: () => void;
  onAction: (actionId: string, member: TeamMember) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UserActionsSheet({ visible, member, onClose, onAction }: Props) {
  const insets = useSafeAreaInsets();
  const slideY = useRef(new Animated.Value(SHEET_H)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, tension: 80, friction: 14, useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, { toValue: SHEET_H, duration: 200, useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!member) return null;

  const badge = STATUS_BADGE[member.status] ?? STATUS_BADGE['due-soon'];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Dim overlay */}
      <Animated.View style={[styles.overlay, { opacity: bgOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideY }], paddingBottom: insets.bottom + 16 },
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>User actions</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={16} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>

        {/* User card */}
        <View style={styles.userCard}>
          <View style={[styles.avatar, { backgroundColor: member.avatarColor }]}>
            <Text style={styles.avatarInitials}>{member.initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{member.name}</Text>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Ionicons name={badge.icon} size={11} color={badge.text} />
                <Text style={[styles.badgeLabel, { color: badge.text }]}>{badge.label}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.profileLink}>
              <Text style={styles.profileText}>Go to profile</Text>
              <Ionicons name="open-outline" size={13} color="#16A34A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.sectionDivider} />

        {/* Actions */}
        <View style={styles.actionList}>
          {ACTIONS.map((action, i) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionRow}
              activeOpacity={0.7}
              onPress={() => onAction(action.id, member)}
            >
              <Ionicons name={action.icon} size={20} color={colors.gray[700]} />
              <View style={styles.actionText}>
                <Text style={styles.actionLabel}>{action.label}</Text>
                {action.subtitle && (
                  <Text style={styles.actionSub}>{action.subtitle}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_H,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[300],
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.gray[900],
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // User card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarInitials: { fontSize: fontSizes.base, fontWeight: '700', color: colors.white },
  userInfo: { flex: 1, gap: 4 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  userName: { fontSize: fontSizes.base, fontWeight: '700', color: colors.gray[900] },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  badgeLabel: { fontSize: fontSizes.xs, fontWeight: '600' },
  profileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileText: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: '#16A34A',
  },

  sectionDivider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginHorizontal: 0,
  },

  // Actions
  actionList: {
    paddingTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  actionText: { flex: 1, gap: 2 },
  actionLabel: {
    fontSize: fontSizes.base,
    fontWeight: '500',
    color: colors.gray[900],
  },
  actionSub: {
    fontSize: fontSizes.xs,
    color: colors.gray[500],
  },
});
