import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes, radii } from '@/constants/tokens';

type OverviewTab = 'overview' | 'attendees';

// ─── Tag pill config ──────────────────────────────────────────────────────────

interface TagConfig {
  id: string;
  label: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  bg?: string;
  border: string;
  textColor: string;
  iconColor?: string;
}

const TAGS: TagConfig[] = [
  {
    id: 'mandatory',
    label: 'Mandatory',
    border: colors.gray[900],
    textColor: colors.gray[900],
  },
  {
    id: 'signup',
    label: 'Sign up',
    icon: 'clipboard-outline',
    bg: '#FFF7ED',
    border: colors.brand.primary,
    textColor: colors.brand.primary,
    iconColor: colors.brand.primary,
  },
  {
    id: 'signedup',
    label: 'Signed up',
    icon: 'checkmark-circle-outline',
    bg: '#F0FDF4',
    border: '#16A34A',
    textColor: '#16A34A',
    iconColor: '#16A34A',
  },
  {
    id: 'request',
    label: 'Request',
    icon: 'calendar-outline',
    bg: '#EFF6FF',
    border: '#3B82F6',
    textColor: '#3B82F6',
    iconColor: '#3B82F6',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RequestEventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    requestId:      string;
    userName:       string;
    eventTitle:     string;
    eventTime:      string;
    eventLocation:  string;
    eventDateDay:   string;
    eventDateMonth: string;
  }>();

  const [activeTab, setActiveTab] = useState<OverviewTab>('overview');
  const [bookmarked, setBookmarked] = useState(false);

  const eventTitle    = params.eventTitle    ?? 'Event name goes here';
  const eventTime     = params.eventTime     ?? '00:00';
  const eventLocation = params.eventLocation ?? 'O2 Arena, London';
  const dateDay       = params.eventDateDay    ?? '01';
  const dateMonth     = params.eventDateMonth  ?? 'Jan';

  function handleApprove() {
    router.navigate({
      pathname: '/(app)/my-team',
      params: {
        toast:      'approved',
        toastName:  params.userName ?? 'User Name',
        approvedId: params.requestId ?? '',
      },
    } as never);
  }

  function handleReject() {
    router.back();
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <SafeAreaView edges={['top']} style={styles.safeTop}>
        {/* Nav bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.gray[700]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setBookmarked((b) => !b)}
            style={styles.navBtn}
          >
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={bookmarked ? colors.brand.primary : colors.gray[700]}
            />
          </TouchableOpacity>
        </View>

        {/* Event title block */}
        <View style={styles.titleBlock}>
          <View style={styles.titleLeft}>
            <Text style={styles.eventTitle}>{eventTitle}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={14} color={colors.gray[500]} />
              <Text style={styles.metaText}>{eventTime}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color={colors.gray[500]} />
              <Text style={styles.metaText}>{eventLocation}</Text>
            </View>
          </View>

          {/* Date card */}
          <View style={styles.dateCard}>
            <Text style={styles.dateDay}>{dateDay}</Text>
            <Text style={styles.dateMonth}>{dateMonth}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Map image */}
        <Image
          source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=O2+Arena,London&zoom=13&size=600x300&maptype=roadmap&key=AIzaSyD-placeholder' }}
          style={styles.map}
          // fallback to a placeholder map image
          defaultSource={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&q=80' }}
        />

        {/* Overview / Attendees tabs */}
        <View style={styles.tabRow}>
          {(['overview', 'attendees'] as OverviewTab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabLabel, activeTab === t && styles.tabLabelActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'overview' ? (
          <View style={styles.body}>
            {/* Tag pills */}
            <View style={styles.tagsRow}>
              {TAGS.map((tag) => (
                <View
                  key={tag.id}
                  style={[
                    styles.tag,
                    { borderColor: tag.border, backgroundColor: tag.bg ?? 'transparent' },
                  ]}
                >
                  {tag.icon && (
                    <Ionicons name={tag.icon} size={12} color={tag.iconColor ?? tag.textColor} />
                  )}
                  <Text style={[styles.tagLabel, { color: tag.textColor }]}>{tag.label}</Text>
                </View>
              ))}
            </View>

            {/* Part of */}
            <View style={styles.partOfRow}>
              <Text style={styles.bodyText}>This event is part of: </Text>
              <Text style={styles.greenLink}>Course/LxP Name</Text>
            </View>

            {/* Description */}
            <Text style={styles.bodyText}>
              Event description goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor.
            </Text>

            {/* Link */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Link: </Text>
              <Text style={styles.greenLink}>event-meeting.link/</Text>
            </View>

            {/* Location */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location: </Text>
              <Text style={styles.greenLink}>See map</Text>
            </View>
          </View>
        ) : (
          <View style={styles.body}>
            <Text style={styles.bodyText}>Attendee list coming soon.</Text>
          </View>
        )}

        {/* Extra scroll space for sticky footer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Reject / Approve buttons */}
      <SafeAreaView edges={['bottom']} style={styles.stickyFooter}>
        <View style={styles.btnCol}>
          <TouchableOpacity style={styles.rejectBtn} onPress={handleReject} activeOpacity={0.8}>
            <Text style={styles.rejectLabel}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approveBtn} onPress={handleApprove} activeOpacity={0.8}>
            <Text style={styles.approveLabel}>Approve</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.white },
  safeTop: { backgroundColor: colors.white },

  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  titleLeft:  { flex: 1, gap: 4 },
  eventTitle: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.gray[900], lineHeight: fontSizes.xl * 1.2 },
  metaRow:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText:   { fontSize: fontSizes.sm, color: colors.gray[500] },
  dateCard: {
    width: 56,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    alignItems: 'center',
    paddingVertical: 8,
    flexShrink: 0,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  dateDay:   { fontSize: fontSizes.xl, fontWeight: '800', color: colors.gray[900] },
  dateMonth: { fontSize: fontSizes.xs, color: colors.gray[500], textTransform: 'uppercase', fontWeight: '600' },

  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  map: {
    width: '100%',
    height: 200,
    backgroundColor: colors.gray[200],
  },

  // Overview / Attendees tabs
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.gray[100],
    borderRadius: radii.lg,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.gray[500],
  },
  tabLabelActive: {
    fontWeight: '700',
    color: colors.gray[900],
  },

  body: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1.5,
  },
  tagLabel: { fontSize: fontSizes.xs, fontWeight: '600' },

  partOfRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  bodyText:  { fontSize: fontSizes.sm, color: colors.gray[700], lineHeight: fontSizes.sm * 1.6 },
  infoRow:   { flexDirection: 'row', alignItems: 'center' },
  infoLabel: { fontSize: fontSizes.sm, color: colors.gray[700] },
  greenLink: { fontSize: fontSizes.sm, color: '#16A34A', fontWeight: '600' },

  // Sticky footer
  stickyFooter: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  btnCol: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  rejectBtn: {
    height: 50,
    borderRadius: radii.full,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectLabel: { fontSize: fontSizes.base, fontWeight: '700', color: '#DC2626' },
  approveBtn: {
    height: 50,
    borderRadius: radii.full,
    backgroundColor: colors.gray[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveLabel: { fontSize: fontSizes.base, fontWeight: '700', color: colors.white },
});
