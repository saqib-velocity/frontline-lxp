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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSizes, radii } from '@/constants/tokens';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H = SCREEN_H * 0.46;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RequestItem {
  id: string;
  userName: string;
  userInitials: string;
  userAvatarColor: string;
  userAvatarUrl?: string;
  eventTitle: string;
  eventTime: string;
  eventLocation: string;
  eventDateDay: string;
  eventDateMonth: string;
}

interface Props {
  visible: boolean;
  request: RequestItem | null;
  onClose: () => void;
  onApprove: (request: RequestItem) => void;
  onReject:  (request: RequestItem) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UserRequestSheet({ visible, request, onClose, onApprove, onReject }: Props) {
  const insets  = useSafeAreaInsets();
  const router  = useRouter();
  const slideY   = useRef(new Animated.Value(SHEET_H)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY,    { toValue: 0,       tension: 80, friction: 14, useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 1,       duration: 240, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY,    { toValue: SHEET_H, duration: 200, useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 0,       duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!request) return null;

  function handleEventPress() {
    onClose();
    // Navigate to manager event detail screen
    setTimeout(() => {
      router.push({
        pathname: '/request-event-detail',
        params: {
          requestId:      request!.id,
          userName:       request!.userName,
          eventTitle:     request!.eventTitle,
          eventTime:      request!.eventTime,
          eventLocation:  request!.eventLocation,
          eventDateDay:   request!.eventDateDay,
          eventDateMonth: request!.eventDateMonth,
        },
      } as never);
    }, 220);
  }

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
          <Text style={styles.headerTitle}>User request</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={16} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>

        {/* User card */}
        <View style={styles.userCard}>
          <View style={[styles.avatar, { backgroundColor: request.userAvatarColor }]}>
            <Text style={styles.avatarInitials}>{request.userInitials}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{request.userName}</Text>
            <TouchableOpacity style={styles.profileLink}>
              <Text style={styles.profileText}>Go to profile</Text>
              <Ionicons name="open-outline" size={13} color="#16A34A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Event row */}
        <TouchableOpacity style={styles.eventRow} activeOpacity={0.75} onPress={handleEventPress}>
          {/* Date block */}
          <View style={styles.dateBlock}>
            <Text style={styles.dateDay}>{request.eventDateDay}</Text>
            <Text style={styles.dateMonth}>{request.eventDateMonth}</Text>
          </View>

          {/* Event info */}
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle} numberOfLines={1}>{request.eventTitle}</Text>
            <View style={styles.eventMeta}>
              <Text style={styles.metaText}>{request.eventTime}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Ionicons name="location-outline" size={12} color={colors.gray[400]} />
              <Text style={styles.metaText}>{request.eventLocation}</Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={18} color={colors.gray[300]} />
        </TouchableOpacity>

        {/* Action buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.rejectBtn}
            activeOpacity={0.8}
            onPress={() => onReject(request)}
          >
            <Text style={styles.rejectLabel}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.approveBtn}
            activeOpacity={0.8}
            onPress={() => onApprove(request)}
          >
            <Text style={styles.approveLabel}>Approve</Text>
          </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
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

  // User
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { fontSize: fontSizes.base, fontWeight: '700', color: colors.white },
  userName: { fontSize: fontSizes.base, fontWeight: '700', color: colors.gray[900] },
  profileLink: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  profileText: { fontSize: fontSizes.sm, fontWeight: '500', color: '#16A34A' },

  // Event row
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.gray[50],
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    gap: 12,
  },
  dateBlock: { alignItems: 'center', width: 36, flexShrink: 0 },
  dateDay:   { fontSize: fontSizes.lg, fontWeight: '700', color: colors.gray[900] },
  dateMonth: { fontSize: fontSizes.xs, color: colors.gray[500], textTransform: 'uppercase', fontWeight: '600' },
  eventInfo: { flex: 1, gap: 3 },
  eventTitle: { fontSize: fontSizes.base, fontWeight: '600', color: colors.gray[900] },
  eventMeta:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText:   { fontSize: fontSizes.xs, color: colors.gray[500] },
  metaDot:    { fontSize: fontSizes.xs, color: colors.gray[300] },

  // Buttons
  btnRow: {
    flexDirection: 'column',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  rejectBtn: {
    height: 50,
    borderRadius: radii.full,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectLabel: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: '#DC2626',
  },
  approveBtn: {
    height: 50,
    borderRadius: radii.full,
    backgroundColor: colors.gray[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveLabel: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.white,
  },
});
