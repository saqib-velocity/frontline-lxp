import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/layout/AppHeader';
import { ComplianceCard } from '@/components/my-team/ComplianceCard';
import { AvatarCluster } from '@/components/my-team/AvatarCluster';
import { TeamMemberRow } from '@/components/my-team/TeamMemberRow';
import { UserActionsSheet } from '@/components/my-team/UserActionsSheet';
import { UserRequestSheet, type RequestItem } from '@/components/my-team/UserRequestSheet';
import { Toast } from '@/components/ui/Toast';
import { colors, fontSizes, radii } from '@/constants/tokens';
import { useAppTheme } from '@/context/ThemeContext';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { TeamMember, MyTeamTab, ComplianceTab } from '@/types/team';

// ─── Mock data — Compliance ───────────────────────────────────────────────────

const TEAM_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'User Name', initials: 'GP', avatarColor: '#059669', progress: 82,  dueDate: '01 Jan', status: 'overdue',   avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: 'm2', name: 'User Name', initials: 'AM', avatarColor: '#E11D48', progress: 75,  dueDate: '01 Jan', status: 'overdue',   avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { id: 'm3', name: 'User Name', initials: 'SN', avatarColor: '#16A34A', progress: 57,  dueDate: '01 Jan', status: 'due-soon',  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
  { id: 'm4', name: 'User Name', initials: 'PT', avatarColor: '#6D28D9', progress: 100, dueDate: '00 Mon', status: 'compliant', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { id: 'm5', name: 'User Name', initials: 'JB', avatarColor: '#0284C7', progress: 100, dueDate: '00 Mon', status: 'compliant', avatarUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80' },
  { id: 'm6', name: 'User Name', initials: 'KL', avatarColor: '#D97706', progress: 100, dueDate: '00 Mon', status: 'compliant' },
  { id: 'm7', name: 'User Name', initials: 'RC', avatarColor: '#7C3AED', progress: 100, dueDate: '00 Mon', status: 'compliant' },
  { id: 'm8', name: 'User Name', initials: 'TP', avatarColor: '#0891B2', progress: 100, dueDate: '00 Mon', status: 'compliant' },
  { id: 'm9', name: 'User Name', initials: 'MH', avatarColor: '#BE185D', progress: 100, dueDate: '00 Mon', status: 'compliant' },
  { id: 'm10', name: 'User Name', initials: 'NG', avatarColor: '#65A30D', progress: 100, dueDate: '00 Mon', status: 'compliant' },
];

const NEEDS_ATTENTION = TEAM_MEMBERS.filter((m) => m.status === 'overdue' || m.status === 'due-soon');
const COMPLIANT       = TEAM_MEMBERS.filter((m) => m.status === 'compliant');
const OVERDUE_COUNT   = TEAM_MEMBERS.filter((m) => m.status === 'overdue').length;
const DUE_SOON_COUNT  = TEAM_MEMBERS.filter((m) => m.status === 'due-soon').length;

// ─── Mock data — Requests ─────────────────────────────────────────────────────

const BASE_REQUESTS: RequestItem[] = [
  { id: 'r1', userName: 'User Name', userInitials: 'GP', userAvatarColor: '#059669', userAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', eventTitle: 'Culture at King Wing',      eventTime: '18:00', eventLocation: 'The O2, London',     eventDateDay: '18', eventDateMonth: 'Feb' },
  { id: 'r2', userName: 'User Name', userInitials: 'AM', userAvatarColor: '#E11D48', userAvatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', eventTitle: 'Sales enablement training', eventTime: '10:00', eventLocation: 'Manchester, UK',      eventDateDay: '31', eventDateMonth: 'Aug' },
  { id: 'r3', userName: 'User Name', userInitials: 'SN', userAvatarColor: '#16A34A', userAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', eventTitle: 'Q1 Goals Intro',           eventTime: '09:00', eventLocation: 'Webinar',             eventDateDay: '22', eventDateMonth: 'Oct' },
  { id: 'r4', userName: 'User Name', userInitials: 'PT', userAvatarColor: '#6D28D9', userAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', eventTitle: 'Creative Summit',          eventTime: '14:00', eventLocation: 'Birmingham, UK',      eventDateDay: '8',  eventDateMonth: 'Dec' },
];

// ─── Sub-tabs ─────────────────────────────────────────────────────────────────

const MY_TEAM_TABS: { id: MyTeamTab; label: string }[] = [
  { id: 'compliance', label: 'Compliance' },
  { id: 'requests',   label: 'Requests'   },
  { id: 'report',     label: 'Report'     },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MyTeamScreen() {
  const { tokens } = useAppTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const params = useLocalSearchParams<{
    toast?: string;
    toastName?: string;
    approvedId?: string;
  }>();

  // ── Top-level tabs
  const [myTeamTab,     setMyTeamTab]     = useState<MyTeamTab>('compliance');
  const [complianceTab, setComplianceTab] = useState<ComplianceTab>('needs-attention');

  // ── Requests state
  const [openRequests,    setOpenRequests]    = useState<RequestItem[]>(BASE_REQUESTS);
  const [closedRequests,  setClosedRequests]  = useState<RequestItem[]>([]);
  const [requestsTab,     setRequestsTab]     = useState<'open' | 'closed'>('open');
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [requestSheetVisible, setRequestSheetVisible] = useState(false);

  // ── Compliance sheet
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [actionsSheetVisible, setActionsSheetVisible] = useState(false);

  // ── Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTitle,   setToastTitle]   = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Handle return from request-event-detail with approval result
  useEffect(() => {
    if (params.toast === 'approved' && params.approvedId) {
      setMyTeamTab('requests');
      const approved = openRequests.find((r) => r.id === params.approvedId);
      if (approved) {
        setOpenRequests((prev) => prev.filter((r) => r.id !== params.approvedId));
        setClosedRequests((prev) => [approved, ...prev]);
      }
      setToastTitle('Event Request Approved');
      setToastMessage(`${params.toastName ?? 'User Name'}'s reques has been approved.`);
      setTimeout(() => setToastVisible(true), 150);
    }
  }, [params.toast, params.approvedId]);

  // ── Compliance sheet handlers
  function openActionsSheet(member: TeamMember) {
    setSelectedMember(member);
    setActionsSheetVisible(true);
  }

  function handleNudge(member: TeamMember) {
    setActionsSheetVisible(false);
    setToastTitle('Nudge Sent');
    setToastMessage(`${member.name} has been nudged successfully.`);
    setTimeout(() => setToastVisible(true), 300);
  }

  function handleComplianceAction(actionId: string, member: TeamMember) {
    setActionsSheetVisible(false);
    if (actionId === 'nudge') handleNudge(member);
  }

  // ── Request sheet handlers
  function handleApproveRequest(request: RequestItem) {
    setRequestSheetVisible(false);
    setOpenRequests((prev) => prev.filter((r) => r.id !== request.id));
    setClosedRequests((prev) => [request, ...prev]);
    setToastTitle('Event Request Approved');
    setToastMessage(`${request.userName}'s reques has been approved.`);
    setTimeout(() => setToastVisible(true), 300);
  }

  function handleRejectRequest(request: RequestItem) {
    setRequestSheetVisible(false);
    setOpenRequests((prev) => prev.filter((r) => r.id !== request.id));
    setClosedRequests((prev) => [request, ...prev]);
  }

  const isAttention = complianceTab === 'needs-attention';
  const listMembers = isAttention ? NEEDS_ATTENTION : COMPLIANT;
  const shownRequests = requestsTab === 'open' ? openRequests : closedRequests;

  return (
    <View style={[styles.root, { backgroundColor: tokens.headerBg }]}>
      <AppHeader />

      {/* Compliance / Requests / Report pill tabs */}
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── COMPLIANCE TAB ───────────────────────────────────────────── */}
        {myTeamTab === 'compliance' && (
          <>
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

            <ComplianceCard
              percentage={84}
              overdueCount={OVERDUE_COUNT}
              dueSoonCount={DUE_SOON_COUNT}
            />

            {/* Segmented toggle */}
            <View style={styles.segmentWrap}>
              <View style={styles.segment}>
                {(['needs-attention', 'compliant'] as ComplianceTab[]).map((tab) => {
                  const active = complianceTab === tab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                      onPress={() => setComplianceTab(tab)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
                        {tab === 'needs-attention' ? 'Needs attention' : 'Compliant'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* List header */}
            <View style={styles.listHeader}>
              <View style={styles.listTitleRow}>
                <Text style={styles.listTitle}>
                  {isAttention ? 'Needs attention' : 'Compliant'}
                </Text>
                <View style={[styles.countBadge, { backgroundColor: isAttention ? colors.brand.primary : colors.gray[900] }]}>
                  <Text style={styles.countText}>{listMembers.length}</Text>
                </View>
              </View>
              <Text style={styles.listSubtitle}>
                {isAttention
                  ? `${OVERDUE_COUNT} Overdue · ${DUE_SOON_COUNT} due soon`
                  : 'Training complete and On-track'}
              </Text>
            </View>

            <View style={styles.memberCard}>
              {listMembers.map((m, i) => (
                <TeamMemberRow
                  key={m.id}
                  member={m}
                  variant={isAttention ? 'needs-attention' : 'compliant'}
                  onMenuPress={openActionsSheet}
                  showDivider={i < listMembers.length - 1}
                />
              ))}
            </View>
          </>
        )}

        {/* ── REQUESTS TAB ─────────────────────────────────────────────── */}
        {myTeamTab === 'requests' && (
          <>
            <View style={styles.teamHeader}>
              <View>
                <View style={styles.teamTitleRow}>
                  <Ionicons name="newspaper-outline" size={18} color={colors.gray[500]} />
                  <Text style={styles.teamTitle}>Requests</Text>
                </View>
                <Text style={styles.teamSubtitle}>Waterloo Store #241</Text>
              </View>
            </View>

            {/* Open / Closed toggle */}
            <View style={styles.openClosedRow}>
              {(['open', 'closed'] as const).map((tab) => {
                const active = requestsTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.openClosedBtn, active && styles.openClosedBtnActive]}
                    onPress={() => setRequestsTab(tab)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.openClosedLabel, active && styles.openClosedLabelActive]}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Request list */}
            <View style={styles.requestCard}>
              {shownRequests.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No {requestsTab} requests</Text>
                </View>
              ) : (
                shownRequests.map((req, i) => (
                  <React.Fragment key={req.id}>
                    <TouchableOpacity
                      style={styles.requestRow}
                      activeOpacity={0.75}
                      onPress={() => {
                        setSelectedRequest(req);
                        setRequestSheetVisible(true);
                      }}
                    >
                      {/* Icon square */}
                      <View style={styles.reqIconBox}>
                        <Ionicons name="clipboard-outline" size={20} color={colors.gray[500]} />
                      </View>

                      {/* Info */}
                      <View style={styles.reqInfo}>
                        <Text style={styles.reqTitle} numberOfLines={1}>{req.eventTitle}</Text>
                        <View style={styles.reqMeta}>
                          <Ionicons name="person-circle-outline" size={13} color={colors.gray[400]} />
                          <Text style={styles.reqMetaText}>{req.userName}</Text>
                          <Text style={styles.reqDot}>·</Text>
                          <Ionicons name="calendar-outline" size={13} color={colors.gray[400]} />
                          <Text style={styles.reqMetaText}>
                            {req.eventDateDay} {req.eventDateMonth}
                          </Text>
                        </View>
                      </View>

                      <Ionicons name="chevron-forward" size={18} color={colors.gray[300]} />
                    </TouchableOpacity>
                    {i < shownRequests.length - 1 && <View style={styles.reqDivider} />}
                  </React.Fragment>
                ))
              )}
            </View>
          </>
        )}

        {/* ── REPORT TAB ───────────────────────────────────────────────── */}
        {myTeamTab === 'report' && (
          <View style={styles.comingSoon}>
            <Ionicons name="bar-chart-outline" size={40} color={colors.gray[300]} />
            <Text style={styles.comingSoonText}>Reports coming soon</Text>
          </View>
        )}
      </ScrollView>

      {/* Toast */}
      <Toast
        visible={toastVisible}
        title={toastTitle}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
      />

      {/* Compliance: user actions sheet */}
      <UserActionsSheet
        visible={actionsSheetVisible}
        member={selectedMember}
        onClose={() => setActionsSheetVisible(false)}
        onAction={handleComplianceAction}
      />

      {/* Requests: user request sheet */}
      <UserRequestSheet
        visible={requestSheetVisible}
        request={selectedRequest}
        onClose={() => setRequestSheetVisible(false)}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: colors.brand.primary },
  scroll: { flex: 1, backgroundColor: colors.gray[50] },

  // Top tabs (Compliance / Requests / Report)
  tabBarWrap: {
    backgroundColor: colors.gray[50],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  tabBar: { flexDirection: 'row', gap: 8 },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    backgroundColor: 'transparent',
  },
  tabBtnActive: { backgroundColor: colors.gray[900], borderColor: colors.gray[900] },
  tabLabel:  { fontSize: fontSizes.sm, fontWeight: '500', color: colors.gray[600] },
  tabLabelActive: { color: colors.white, fontWeight: '700' },

  // Section headers
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  teamTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  teamTitle:    { fontSize: fontSizes.xl, fontWeight: '800', color: colors.gray[900] },
  teamSubtitle: { fontSize: fontSizes.sm, color: colors.gray[500], marginTop: 2, marginLeft: 24 },

  // Segmented control (Needs attention / Compliant)
  segmentWrap: { paddingHorizontal: 16, paddingVertical: 14 },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: radii.lg,
    padding: 4,
  },
  segmentBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  segmentBtnActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentLabel:       { fontSize: fontSizes.sm, fontWeight: '500', color: colors.gray[500] },
  segmentLabelActive: { fontWeight: '700', color: colors.gray[900] },

  // List header
  listHeader:   { paddingHorizontal: 16, paddingBottom: 10, gap: 2 },
  listTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  listTitle:    { fontSize: fontSizes.base, fontWeight: '700', color: colors.gray[900] },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText:    { fontSize: fontSizes.xs, fontWeight: '700', color: colors.white },
  listSubtitle: { fontSize: fontSizes.xs, color: colors.gray[500] },

  // Member list card
  memberCard: {
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    overflow: 'hidden',
  },

  // Open / Closed toggle (pill outlines)
  openClosedRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  openClosedBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    backgroundColor: 'transparent',
  },
  openClosedBtnActive: {
    borderColor: colors.gray[900],
    backgroundColor: 'transparent',
  },
  openClosedLabel: { fontSize: fontSizes.sm, fontWeight: '500', color: colors.gray[500] },
  openClosedLabelActive: { fontWeight: '700', color: colors.gray[900] },

  // Request list card
  requestCard: {
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    overflow: 'hidden',
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  reqIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  reqInfo:     { flex: 1, gap: 4 },
  reqTitle:    { fontSize: fontSizes.base, fontWeight: '600', color: colors.gray[900] },
  reqMeta:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reqMetaText: { fontSize: fontSizes.xs, color: colors.gray[500] },
  reqDot:      { fontSize: fontSizes.xs, color: colors.gray[300] },
  reqDivider:  { height: 1, backgroundColor: colors.gray[100], marginHorizontal: 16 },

  emptyState: { padding: 32, alignItems: 'center' },
  emptyText:  { fontSize: fontSizes.sm, color: colors.gray[400], fontWeight: '500' },

  // Report placeholder
  comingSoon: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  comingSoonText: { fontSize: fontSizes.base, color: colors.gray[400], fontWeight: '500' },
});
