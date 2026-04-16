import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes, radii } from '@/constants/tokens';
import type { CalendarEvent, LocationType, EventStatus } from '@/types/course';

interface EventListItemProps {
  event: CalendarEvent;
  onPress?: () => void;
  showDivider?: boolean;
}

const LOCATION_ICON: Record<LocationType, React.ComponentProps<typeof Ionicons>['name']> = {
  webinar:  'globe-outline',
  location: 'location-outline',
  link:     'link-outline',
};

const STATUS_STYLE: Record<EventStatus, { border: string; text: string }> = {
  invited:  { border: '#C24806', text: '#C24806' },
  requested:{ border: '#2563EB', text: '#2563EB' },
  attended: { border: colors.gray[500], text: colors.gray[500] },
};

const STATUS_LABEL: Record<EventStatus, string> = {
  invited:   'Invited',
  requested: 'Requested',
  attended:  'Attended',
};

export function EventListItem({
  event,
  onPress,
  showDivider = true,
}: EventListItemProps) {
  const locIcon = LOCATION_ICON[event.locationType];
  const statusStyle = STATUS_STYLE[event.status];

  return (
    <>
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        activeOpacity={0.75}
      >
        {/* Date block */}
        <View style={styles.dateBlock}>
          <Text style={styles.dateDay}>{event.date.day}</Text>
          <Text style={styles.dateMonth}>{event.date.month}</Text>
        </View>

        {/* Text content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>{event.time}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Ionicons name={locIcon} size={12} color={colors.gray[400]} />
            <Text style={styles.metaText}>{event.locationValue}</Text>
          </View>
        </View>

        {/* Status badge */}
        <View style={[styles.statusPill, { borderColor: statusStyle.border }]}>
          <Ionicons name="calendar-outline" size={11} color={statusStyle.text} />
          <Text style={[styles.statusLabel, { color: statusStyle.text }]}>
            {STATUS_LABEL[event.status]}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color={colors.gray[300]} />
      </TouchableOpacity>

      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: colors.white,
  },
  dateBlock: {
    width: 36,
    alignItems: 'center',
    flexShrink: 0,
  },
  dateDay: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.gray[900],
    lineHeight: fontSizes.xl * 1.05,
  },
  dateMonth: {
    fontSize: fontSizes.xs,
    color: colors.gray[500],
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: fontSizes.base * 1.35,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: fontSizes.xs,
    color: colors.gray[500],
  },
  metaDot: {
    fontSize: fontSizes.xs,
    color: colors.gray[300],
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1.5,
    flexShrink: 0,
  },
  statusLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginHorizontal: 16,
  },
});
