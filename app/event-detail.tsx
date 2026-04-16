import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes, radii } from '@/constants/tokens';
import type { LocationType } from '@/types/course';

const BRAND = '#C24806';

// Map placeholder — replace with a real map tile when Google Maps key is available
const MAP_IMAGE =
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80';

const LOCATION_ICON: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  webinar:  'globe-outline',
  location: 'location-outline',
  link:     'link-outline',
};

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    time: string;
    locationType: string;
    locationValue: string;
    day: string;
    month: string;
    meetingLink: string;
    locationLabel: string;
    isMandatory: string;
  }>();

  const [activeTab, setActiveTab] = useState<'overview' | 'attendees'>('overview');

  const locIcon =
    LOCATION_ICON[params.locationType ?? 'webinar'] ?? 'globe-outline';

  function handleSignUp() {
    // Navigate back to Learning/Events tab and trigger success toast
    router.navigate({
      pathname: '/(app)/learning' as never,
      params: {
        toast: 'signed_up',
        toastTitle: params.title ?? 'event',
        signedUpId: params.id ?? '',
      },
    });
  }

  return (
    <View style={styles.root}>
      {/* Top safe area — no orange bar */}
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.gray[700]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <Ionicons name="bookmark-outline" size={22} color={colors.gray[700]} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: title + meta + date badge */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{params.title ?? 'Event'}</Text>
            <View style={styles.metaLine}>
              <Ionicons name="time-outline" size={14} color={colors.gray[500]} />
              <Text style={styles.metaText}>{params.time ?? '00:00'}</Text>
            </View>
            <View style={styles.metaLine}>
              <Ionicons name={locIcon} size={14} color={colors.gray[500]} />
              <Text style={styles.metaText}>{params.locationValue ?? 'Online'}</Text>
            </View>
          </View>

          {/* Date badge — top right */}
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeDay}>{params.day ?? '01'}</Text>
            <Text style={styles.dateBadgeMonth}>{params.month ?? 'Jan'}</Text>
          </View>
        </View>

        {/* Map image */}
        <Image source={{ uri: MAP_IMAGE }} style={styles.mapImage} resizeMode="cover" />

        {/* Overview / Attendees tab switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'overview' && styles.tabPillActive]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabPillLabel, activeTab === 'overview' && styles.tabPillLabelActive]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'attendees' && styles.tabPillActive]}
            onPress={() => setActiveTab('attendees')}
          >
            <Text style={[styles.tabPillLabel, activeTab === 'attendees' && styles.tabPillLabelActive]}>
              Attendees
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'overview' ? (
          <View style={styles.overviewBody}>
            {/* Tags */}
            <View style={styles.tagsRow}>
              {params.isMandatory === 'true' && (
                <View style={styles.tagMandatory}>
                  <Text style={styles.tagMandatoryLabel}>Mandatory</Text>
                </View>
              )}
              <TouchableOpacity style={styles.tagSignUp} onPress={handleSignUp}>
                <Ionicons name="calendar-outline" size={13} color={colors.white} />
                <Text style={styles.tagSignUpLabel}>Sign up</Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <Text style={styles.description}>
              Event description goes here. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Sed do eiusmod tempor. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Sed do eiusmod tempor.
            </Text>

            {/* Link */}
            {params.meetingLink ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Link:</Text>
                <Text style={[styles.detailVal, { color: BRAND }]}>{params.meetingLink}</Text>
              </View>
            ) : null}

            {/* Location */}
            {params.locationLabel ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Location:</Text>
                <Text style={[styles.detailVal, { color: BRAND }]}>{params.locationLabel}</Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.attendeesBody}>
            <Text style={styles.emptyText}>No attendees yet.</Text>
          </View>
        )}

        {/* Spacer so content clears the sticky button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky bottom Sign Up button */}
      <SafeAreaView edges={['bottom']} style={styles.safeBottom}>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp} activeOpacity={0.85}>
            <Ionicons name="calendar-outline" size={18} color={colors.white} />
            <Text style={styles.signUpBtnLabel}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  safeTop: {
    backgroundColor: colors.white,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  navBtn: {
    padding: 8,
  },

  /* ── Scroll ── */
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  /* ── Header info ── */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.white,
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    lineHeight: fontSizes['2xl'] * 1.2,
  },
  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: fontSizes.base,
    color: colors.gray[500],
  },
  dateBadge: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
    minWidth: 52,
    flexShrink: 0,
  },
  dateBadgeDay: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.gray[900],
    lineHeight: fontSizes.xl,
  },
  dateBadgeMonth: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
    fontWeight: '500',
    textTransform: 'uppercase',
  },

  /* ── Map ── */
  mapImage: {
    width: '100%',
    height: 200,
  },

  /* ── Overview / Attendees tabs ── */
  tabRow: {
    flexDirection: 'row',
    gap: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: radii.full,
  },
  tabPillActive: {
    backgroundColor: colors.black,
  },
  tabPillLabel: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.gray[500],
  },
  tabPillLabelActive: {
    color: colors.white,
  },

  /* ── Overview body ── */
  overviewBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tagMandatory: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.gray[900],
  },
  tagMandatoryLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.gray[900],
  },
  tagSignUp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.full,
    backgroundColor: BRAND,
  },
  tagSignUpLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.white,
  },
  description: {
    fontSize: fontSizes.base,
    color: colors.gray[600] ?? colors.gray[500],
    lineHeight: fontSizes.base * 1.6,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
  },
  detailKey: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.gray[900],
  },
  detailVal: {
    fontSize: fontSizes.base,
    flex: 1,
  },

  /* ── Attendees body ── */
  attendeesBody: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSizes.base,
    color: colors.gray[500],
    marginTop: 24,
  },

  /* ── Sticky bottom ── */
  safeBottom: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  signUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gray[900],
    borderRadius: radii.full,
    paddingVertical: 15,
  },
  signUpBtnLabel: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.white,
  },
});
