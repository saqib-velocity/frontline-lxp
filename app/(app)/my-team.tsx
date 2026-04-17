import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { ComplianceCard } from '@/components/my-team/ComplianceCard';
import { AvatarCluster } from '@/components/my-team/AvatarCluster';
import { TeamMemberRow } from '@/components/my-team/TeamMemberRow';
import { UserActionsSheet } from '@/components/my-team/UserActionsSheet';
import { Toast } from '@/components/ui/Toast';
import { colors, fontSizes, radii } from '@/constants/tokens';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { TeamMember, MyTeamTab, ComplianceTab } from '@/types/team';
import { Ionicons } from '@expo/vector-icons';

// ─── Mock data ────────────────────────────────────────────────────────────────

const TEAM_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'User Name', initials: 'GP', avatarColor: '#059669', progress: 82, dueDate: '01 Jan', status: 'overdue',    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: 'm2', name: 'User Name', initials: 'AM', avatarColor: '#E11D48', progress: 75, dueDate: '01 Jan', status: 'overdue',    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { id: 'm3', name: 'User Name', initials: 'SN', avatarColor: '#16A34A', progress: 57, dueDate: '01 Jan', status: 'due-soon',   avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
  { id: 'm4', name: 'User Name', initials: 'PT', avatarColor: '#6D28D9', progress: 100, dueDate: '00 Mon', status: 'compliant', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { id: 'm5', name: 'User Name', initials: 'JB', avatarColor: '#0284C7', progress: 100, dueDate: '00 Mon', status: 'compliant', avatarUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80' },
  { id: 'm6', name: 'User Name', initials: 'KL', avatarColor: '#D97706', progress: 100, dueDate: '00 Mon', status: 'compliant' },
  // extras for +6 overflow
  { id: 'm7',  name: 'User Name', initials: 'RC', avatarColor: '#7C3AED', progress: 100, dueDate: '00 Mon', status: 'compliant' },
  { id: 'm8',  name: 'User Name', initials: 'TP', avatarColor: '#0891B2', progress: 100, dueDate: '00 Mon', status: 'compliant' },
  { id: 'm9',  name: 'User Name', initials: 'MH', avatarColor: '#BE185D', progress: 100, dueDate: '00 Mon', status: 'compliant' },
  { id: 'm10', name: 'User Name', initials: 'NG', avatarColor: '#65A30D', progress: 100, dueDate: '00 Mon', status: 'compliant' },
];

const NEEDS_ATTENTION = TEAM_MEMBERS.filter(
  (m) => m.status === 'overdue' || m.status === 'due-soon',
);
const COMPLIANT = TEAM_MEMBERS.filter((m) => m.status === 'compliant');

const OVERDUE_COUNT  = TEAM_MEMBERS.filter((m) => m.status === 'overdue').length;
const DUE_SOON_COUNT = TEAM_MEMBERS.filter((m) => m.status === 'due-soon').length;

// ─── Sub-filter tabs (Compliance / Requests / Report) ─────────────────────────

const MY_TEAM_TABS: { id: MyTeamTab; label: string }[] = [
  { id: 'compliance', label: 'Compliance' },
  { id: 'requests',   label: 'Requests'   },
  { id: 'report',     label: 'Report'     },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MyTeamScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const [myTeamTab,     setMyTeamTab]     = useState<MyTeamTab>('compliance');
  const [complianceTab, setComplianceTab] = useState<ComplianceTab>('needs-attention');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [sheetVisible,   setSheetVisible]   = useState(false);
  const [toastVisible,   setToastVisible]   = useState(false);
  const [toastName,      setToastName]      = useState('');

  function openSheet(member: TeamMember) {
    setSelectedMember(member);
    setSheetVisible(true);
  }

  function handleAction(actionId: string, member: TeamMember) {
    setSheetVisible(false);
    if (actionId === 'nudge') {
      setToastName(member.name);
      setTimeout(() => setToastVisible(true), 300); // slight delay for sheet to close
    }
  }

  const isAttention = complianceTab === 'needs-attention';
  const listMembers = isAttention ? NEEDS_ATTENTION : COMPLIANT;

  return (
    <View style={styles.root}>
      {/* Orange header */}
      <AppHeader />

      {/* My Team sub-tabs: Compliance / Requests / Report */}
      <View style={styles.tabBarWrap}>
        <View style={styles.tabBar}>
          {MY_TEAM_TABS.map((t) => {
            const active = myTeamTab === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.tabBtn, active && styles.tabBtnActive]}
                onPress={() => setMyTeamTab(t.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Team name + avatar cluster */}
        <View style={styles.teamHeader}>
          <View>
            <View style={styles.teamTitleRow}>
              <Ionicons name="people-outline" size={18} color={colors.gray[500]} />
              <Text style={styles.teamTitle}>My Team</Text>
            </View>
            <Text style={styles.teamSubtitle}>Waterloo Store #241</Text>
          </View>
          <AvatarCluster members={TEAM_MEMBERS} maxVisible={4} />
        </View>

        {/* Compliance card */}
        <ComplianceCard
          percentage={84}
          overdueCount={OVERDUE_COUNT}
          dueSoonCount={DUE_SOON_COUNT}
        />

        {/* Needs attention / Compliant segmented toggle */}
        <View style={styles.segmentWrap}>
          <View style={styles.segment}>
            <TouchableOpacity
              style={[styles.segmentBtn, isAttention && styles.segmentBtnActive]}
              onPress={() => setComplianceTab('needs-attention')}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentLabel, isAttention && styles.segmentLabelActive]}>
                Needs attention
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, !isAttention && styles.segmentBtnActive]}
              onPress={() => setComplianceTab('compliant')}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentLabel, !isAttention && styles.segmentLabelActive]}>
                Compliant
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* List header */}
        <View style={styles.listHeader}>
          <View style={styles.listTitleRow}>
            <Text style={styles.listTitle}>
              {isAttention ? 'Needs attention' : 'Compliant'}
            </Text>
            <View style={[
              styles.countBadge,
              { backgroundColor: isAttention ? colors.brand.primary : colors.gray[900] },
            ]}>
              <Text style={styles.countText}>{listMembers.length}</Text>
            </View>
          </View>
          <Text style={styles.listSubtitle}>
            {isAttention
              ? `${OVERDUE_COUNT} Overdue · ${DUE_SOON_COUNT} due soon`
              : 'Training complete and On-track'}
          </Text>
        </View>

        {/* Member rows */}
        <View style={styles.memberCard}>
          {listMembers.map((m, i) => (
            <TeamMemberRow
              key={m.id}
              member={m}
              variant={isAttention ? 'needs-attention' : 'compliant'}
              onMenuPress={openSheet}
              showDivider={i < listMembers.length - 1}
            />
          ))}
        </View>
      </ScrollView>

      {/* Toast */}
      <Toast
        visible={toastVisible}
        title="Nudge Sent"
        message={`${toastName} has been nudged successfully.`}
        onClose={() => setToastVisible(false)}
      />

      {/* User Actions sheet */}
      <UserActionsSheet
        visible={sheetVisible}
        member={selectedMember}
        onClose={() => setSheetVisible(false)}
        onAction={handleAction}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.brand.primary,
  },

  // Sub-tab bar (Compliance / Requests / Report)
  tabBarWrap: {
    backgroundColor: colors.gray[50],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    backgroundColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: colors.gray[900],
    borderColor: colors.gray[900],
  },
  tabLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.gray[600],
  },
  tabLabelActive: {
    color: colors.white,
    fontWeight: '700',
  },

  scroll: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },

  // Team header
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  teamTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teamTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.gray[900],
  },
  teamSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
    marginTop: 2,
    marginLeft: 24,
  },

  // Segment control (Needs attention / Compliant)
  segmentWrap: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: radii.lg,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.gray[500],
  },
  segmentLabelActive: {
    fontWeight: '700',
    color: colors.gray[900],
  },

  // List header
  listHeader: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 2,
  },
  listTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listTitle: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.gray[900],
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.white,
  },
  listSubtitle: {
    fontSize: fontSizes.xs,
    color: colors.gray[500],
  },

  // Member list card
  memberCard: {
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    overflow: 'hidden',
  },
});
