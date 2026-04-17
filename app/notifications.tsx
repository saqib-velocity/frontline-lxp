import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes, radii } from '@/constants/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifIcon = React.ComponentProps<typeof Ionicons>['name'];

interface NotifItem {
  id: string;
  title: string;
  time?: string;
  sender?: string;
  icon: NotifIcon;
  iconBg?: string;
  // for overdue course type
  date?: string;
  duration?: string;
}

interface NotifGroup {
  label: string;
  items: NotifItem[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const GROUPS: NotifGroup[] = [
  {
    label: 'Today',
    items: [
      {
        id: 'n1',
        title: 'New training assigned',
        time: '1m ago',
        sender: 'Garry Baxter',
        icon: 'document-text-outline',
      },
      {
        id: 'n2',
        title: 'Company announcement',
        time: '10m ago',
        sender: 'Patrick Sounders',
        icon: 'megaphone-outline',
      },
      {
        id: 'n3',
        title: "You've been assigned a survey",
        time: '4h ago',
        sender: 'Jennifer Carlson',
        icon: 'clipboard-outline',
      },
    ],
  },
  {
    label: 'Yesterday',
    items: [
      {
        id: 'n4',
        title: 'Company announcement',
        sender: 'Bill Richards',
        icon: 'megaphone-outline',
      },
      {
        id: 'n5',
        title: "You've been tagged on a post",
        sender: 'Josh Bishop',
        icon: 'at-outline',
      },
      {
        id: 'n6',
        title: "Alice has liked your post",
        sender: 'Alice Sharp',
        icon: 'thumbs-up-outline',
      },
      {
        id: 'n7',
        title: 'You have an overdue course',
        date: '00 Mon',
        duration: '15 min',
        icon: 'time-outline',
        iconBg: '#FEE2E2',
      },
    ],
  },
  {
    label: 'Friday, 13 March',
    items: [],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState(GROUPS);

  function handleClearAll() {
    setGroups((prev) => prev.map((g) => ({ ...g, items: [] })));
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={18} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group) => (
          <View key={group.label}>
            {/* Section pill */}
            <View style={[
              styles.sectionPill,
              group.label === 'Today' ? styles.sectionPillFilled : styles.sectionPillOutline,
            ]}>
              <Text style={[
                styles.sectionPillLabel,
                group.label === 'Today' ? styles.sectionPillLabelFilled : styles.sectionPillLabelOutline,
              ]}>
                {group.label}
              </Text>
            </View>

            {/* Notification card */}
            {group.items.length > 0 && (
              <View style={styles.card}>
                {group.items.map((item, i) => (
                  <View key={item.id}>
                    <TouchableOpacity style={styles.row} activeOpacity={0.75}>
                      {/* Icon */}
                      <View style={[
                        styles.iconBox,
                        { backgroundColor: item.iconBg ?? colors.gray[100] },
                      ]}>
                        <Ionicons
                          name={item.icon}
                          size={18}
                          color={item.iconBg ? '#DC2626' : colors.gray[600]}
                        />
                      </View>

                      {/* Text */}
                      <View style={styles.rowContent}>
                        <Text style={styles.rowTitle}>{item.title}</Text>
                        {/* Regular notification meta */}
                        {item.sender && (
                          <View style={styles.rowMeta}>
                            {item.time && (
                              <>
                                <Text style={styles.metaText}>{item.time}</Text>
                                <Text style={styles.metaDot}>·</Text>
                              </>
                            )}
                            <Ionicons name="person-circle-outline" size={12} color={colors.gray[400]} />
                            <Text style={styles.metaText}>{item.sender}</Text>
                          </View>
                        )}
                        {/* Overdue course meta */}
                        {item.date && (
                          <View style={styles.rowMeta}>
                            <Ionicons name="calendar-outline" size={12} color={colors.gray[400]} />
                            <Text style={styles.metaText}>{item.date}</Text>
                            <Text style={styles.metaDot}>·</Text>
                            <Ionicons name="time-outline" size={12} color={colors.gray[400]} />
                            <Text style={styles.metaText}>{item.duration}</Text>
                          </View>
                        )}
                      </View>

                      <Ionicons name="chevron-forward" size={18} color={colors.gray[300]} />
                    </TouchableOpacity>
                    {i < group.items.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Clear all */}
      <SafeAreaView edges={['bottom']} style={styles.safeBottom}>
        <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
          <Ionicons name="trash-outline" size={16} color={colors.gray[600]} />
          <Text style={styles.clearBtnLabel}>Clear all</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.gray[50] },
  safeTop: { backgroundColor: colors.gray[50] },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.gray[50],
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 8 },

  sectionPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
    marginBottom: 10,
  },
  sectionPillFilled: { backgroundColor: colors.gray[900] },
  sectionPillOutline: {
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    backgroundColor: 'transparent',
  },
  sectionPillLabel: { fontSize: fontSizes.sm, fontWeight: '600' },
  sectionPillLabelFilled: { color: colors.white },
  sectionPillLabelOutline: { color: colors.gray[700] },

  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    overflow: 'hidden',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowContent: { flex: 1, gap: 3 },
  rowTitle: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: fontSizes.base * 1.3,
  },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: fontSizes.xs, color: colors.gray[500] },
  metaDot: { fontSize: fontSizes.xs, color: colors.gray[300] },
  divider: { height: 1, backgroundColor: colors.gray[200], marginHorizontal: 16 },

  safeBottom: { backgroundColor: colors.gray[50], borderTopWidth: 1, borderTopColor: colors.gray[200] },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  clearBtnLabel: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.gray[700],
  },
});
