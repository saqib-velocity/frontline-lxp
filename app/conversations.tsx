import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, fontSizes, radii } from '@/constants/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConversationItem {
  id: string;
  title: string;
  interactions: number;
  preview: string;
  isActive?: boolean;   // blue dot — the currently open conversation
}

interface ConversationGroup {
  date: string;
  items: ConversationItem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PREVIEW_TEXT =
  'To send an invoice, first create it using invoicing softw...';

const CONVERSATIONS: ConversationGroup[] = [
  {
    date: 'Today',
    items: [
      { id: '1', title: 'Sending invoices', interactions: 1, preview: PREVIEW_TEXT, isActive: true },
      { id: '2', title: 'Leadership',       interactions: 3, preview: PREVIEW_TEXT },
    ],
  },
  {
    date: 'Yesterday',
    items: [
      { id: '3', title: 'Sending invoices', interactions: 1, preview: PREVIEW_TEXT },
    ],
  },
  {
    date: 'Thursday, 19 March',
    items: [
      { id: '4', title: 'Leadership',       interactions: 3, preview: PREVIEW_TEXT },
      { id: '5', title: 'Sending invoices', interactions: 1, preview: PREVIEW_TEXT },
    ],
  },
];

// ─── Conversation card ────────────────────────────────────────────────────────

function ConversationCard({ item }: { item: ConversationItem }) {
  return (
    <TouchableOpacity style={cardS.card} activeOpacity={0.75}>
      {/* Top row: title + count + indicator */}
      <View style={cardS.topRow}>
        <Text style={cardS.title}>{item.title}</Text>

        <Text style={cardS.count}>
          {item.interactions} interaction{item.interactions !== 1 ? 's' : ''}
        </Text>

        <View style={cardS.indicator}>
          {item.isActive ? (
            <View style={cardS.activeDot} />
          ) : (
            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.6}>
              <Ionicons name="ellipsis-horizontal" size={16} color={colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Preview text */}
      <Text style={cardS.preview} numberOfLines={1}>
        {item.preview}
      </Text>
    </TouchableOpacity>
  );
}

const cardS = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.gray[900],
  },
  count: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: '#16A34A',
  },
  indicator: {
    marginLeft: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  preview: {
    fontSize: fontSizes.xs,
    color: colors.gray[500],
    lineHeight: fontSizes.xs * 1.5,
  },
});

// ─── Date section label ───────────────────────────────────────────────────────

function DateLabel({ label }: { label: string }) {
  return (
    <View style={dlS.pill}>
      <Text style={dlS.text}>{label}</Text>
    </View>
  );
}

const dlS = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.gray[200],
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 16,
    marginBottom: 10,
  },
  text: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.gray[700],
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ConversationsScreen() {
  const router = useRouter();

  return (
    <View style={s.root}>
      <StatusBar style="dark" />

      <SafeAreaView edges={['top']} style={s.safeTop}>
        {/* Header */}
        <View style={s.header}>
          {/* Left: doc (filled to indicate current view) + compose */}
          <View style={s.headerSide}>
            <View style={[s.iconBtn, s.iconBtnActive]}>
              <Ionicons name="document-text" size={19} color={colors.gray[900]} />
            </View>
            <TouchableOpacity style={s.iconBtn} activeOpacity={0.7}>
              <Ionicons name="create-outline" size={19} color={colors.gray[700]} />
            </TouchableOpacity>
          </View>

          {/* Center title */}
          <Text style={s.headerTitle}>Conversations</Text>

          {/* Right: close */}
          <View style={[s.headerSide, { alignItems: 'flex-end' }]}>
            <TouchableOpacity
              style={s.closeBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={16} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Content */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {CONVERSATIONS.map((group) => (
          <View key={group.date}>
            <DateLabel label={group.date} />
            <View style={s.groupCards}>
              {group.items.map((item) => (
                <ConversationCard key={item.id} item={item} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.gray[50] },
  safeTop: { backgroundColor: colors.gray[50] },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerSide: {
    flexDirection: 'row',
    gap: 4,
    width: 76,
  },
  headerTitle: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.gray[900],
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: colors.gray[200],
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll:        { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  groupCards: {
    gap: 8,
  },
});
