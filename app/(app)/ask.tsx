import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { colors, fontSizes, radii } from '@/constants/tokens';
import { AskLogo } from '@/components/ask/AskLogo';

// ─── Types ────────────────────────────────────────────────────────────────────

type AskTab      = 'chat' | 'search';
type InputMode   = 'text' | 'voice';
type SearchFilter = 'courses' | 'people' | 'skills';

interface CourseItem {
  id: string;
  title: string;
  lessons: string;
  duration: string;
  image: string;
}

interface FeaturedCourse {
  id: string;
  title: string;
  rating: string;
  duration: string;
  image: string;
}

interface UserMsg {
  id: string;
  role: 'user';
  text: string;
}

interface AIThinkingMsg {
  id: string;
  role: 'ai';
  state: 'thinking';
}

interface AIResponseMsg {
  id: string;
  role: 'ai';
  state: 'done';
  text: string;
  courses?: CourseItem[];
  featuredCourse?: FeaturedCourse;
}

type ChatMsg = UserMsg | AIThinkingMsg | AIResponseMsg;

// ─── Static data ──────────────────────────────────────────────────────────────

const RELATED_COURSES: CourseItem[] = [
  {
    id: 'c1',
    title: 'Handle customer invoices',
    lessons: '00/00',
    duration: '15 min',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=120&q=80',
  },
  {
    id: 'c2',
    title: 'Refund customer invoices',
    lessons: '00/00',
    duration: '15 min',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&q=80',
  },
  {
    id: 'c3',
    title: 'Invoice compliance & tax',
    lessons: '00/00',
    duration: '20 min',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=120&q=80',
  },
];

const FEATURED_COURSE: FeaturedCourse = {
  id: 'fc1',
  title: 'Course name goes here and extends further',
  rating: '4/5',
  duration: '15 min',
  image: 'https://images.unsplash.com/photo-1598135753163-6167c1a1ad65?w=600&q=80',
};

const PROMPT_CHIPS = [
  'What courses are due this week?',
  'Summarise my team compliance',
  'Find fire safety training',
  "What's new in my learning plan?",
  'Help me prepare for a 1:1',
];

const SEARCH_COURSES: CourseItem[] = [
  { id: 's1', title: 'Introduction to Leadership',      lessons: '00/00', duration: '15 min', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80' },
  { id: 's2', title: 'Shift Lead training',             lessons: '00/00', duration: '15 min', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&q=80' },
  { id: 's3', title: 'Drive-Through shift planning',    lessons: '00/00', duration: '15 min', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&q=80' },
  { id: 's4', title: 'Closing cleaning shift',          lessons: '00/00', duration: '15 min', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=120&q=80' },
  { id: 's5', title: 'Closing shift packing',           lessons: '00/00', duration: '15 min', image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=120&q=80' },
  { id: 's6', title: 'End of shift fryer maintenance',  lessons: '00/00', duration: '15 min', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&q=80' },
  { id: 's7', title: 'Shift Protection',                lessons: '00/00', duration: '15 min', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=120&q=80' },
];

const RESPONSE_TEXT_1 =
  'To send an invoice, first create it using invoicing software or a template. Include your business details, the client\'s information, a description of the services or products, and the total amount due. Once completed, save the invoice as a PDF and email it to your client, or use an invoicing platform to send it directly.';

const RESPONSE_TEXT_2 =
  "Sure thing, here's what I'd recommend to improve your skills on the topic:";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

function barColor(i: number, total: number): string {
  const t = i / Math.max(total - 1, 1);
  if (t < 0.5) {
    const u = t * 2;
    return `rgb(${lerp(249, 236, u)},${lerp(115, 72, u)},${lerp(22, 153, u)})`;
  }
  const u = (t - 0.5) * 2;
  return `rgb(${lerp(236, 168, u)},${lerp(72, 85, u)},${lerp(153, 247, u)})`;
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

const SPARK_SVG = (sz: number) => `
<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sg" x1="0" y1="1" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#F97316"/>
      <stop offset="50%"  stop-color="#EC4899"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
  </defs>
  <path d="M12 2 L13.6 7.6 L19.5 9 L13.6 10.4 L12 16 L10.4 10.4 L4.5 9 L10.4 7.6 Z" fill="url(#sg)"/>
  <path d="M19.5 2 L20.5 5 L23.5 6 L20.5 7 L19.5 10 L18.5 7 L15.5 6 L18.5 5 Z" fill="url(#sg)"/>
  <path d="M5.5 14 L6.3 16.7 L9 17.5 L6.3 18.3 L5.5 21 L4.7 18.3 L2 17.5 L4.7 16.7 Z" fill="url(#sg)"/>
</svg>`;

function GradientSpark({ size = 20 }: { size?: number }) {
  return <SvgXml xml={SPARK_SVG(size)} width={size} height={size} />;
}

// ─── AskHeader ────────────────────────────────────────────────────────────────

function AskHeader({
  onNewChat,
  onConversations,
}: {
  onNewChat: () => void;
  onConversations: () => void;
}) {
  return (
    <View style={hdrS.row}>
      <View style={hdrS.side}>
        <TouchableOpacity style={hdrS.iconBtn} onPress={onConversations} activeOpacity={0.7}>
          <Ionicons name="document-text-outline" size={19} color={colors.gray[700]} />
        </TouchableOpacity>
        <TouchableOpacity style={hdrS.iconBtn} onPress={onNewChat} activeOpacity={0.7}>
          <Ionicons name="create-outline" size={19} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>

      <View style={hdrS.center}>
        <GradientSpark size={18} />
        <Text style={hdrS.title}>Ask</Text>
      </View>

      <View style={[hdrS.side, { alignItems: 'flex-end' }]}>
        <TouchableOpacity style={hdrS.closeBtn} onPress={onNewChat} activeOpacity={0.7}>
          <Ionicons name="close" size={16} color={colors.gray[500]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const hdrS = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  side:  { flexDirection: 'row', gap: 4, width: 76 },
  center:{ flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: fontSizes.base, fontWeight: '700', color: colors.gray[900] },
  iconBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.gray[100],
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.gray[100],
    alignItems: 'center', justifyContent: 'center',
  },
});

// ─── Segmented tabs ───────────────────────────────────────────────────────────

function AskTabs({ active, onChange }: { active: AskTab; onChange: (t: AskTab) => void }) {
  return (
    <View style={tabS.track}>
      {(['chat', 'search'] as AskTab[]).map((t) => (
        <TouchableOpacity
          key={t}
          style={[tabS.tab, active === t && tabS.tabActive]}
          onPress={() => onChange(t)}
          activeOpacity={0.8}
        >
          <Text style={[tabS.label, active === t && tabS.labelActive]}>
            {t === 'chat' ? 'Chat' : 'Search'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const tabS = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: radii.full,
    padding: 3,
    marginHorizontal: 16,
    marginBottom: 6,
  },
  tab: {
    flex: 1, paddingVertical: 7,
    borderRadius: radii.full, alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  label:       { fontSize: fontSizes.sm, fontWeight: '500', color: colors.gray[500] },
  labelActive: { fontWeight: '700', color: colors.gray[900] },
});

// ─── User bubble ─────────────────────────────────────────────────────────────

function UserBubble({ text }: { text: string }) {
  return (
    <View style={ubS.bubble}>
      <Text style={ubS.text}>{text}</Text>
    </View>
  );
}

const ubS = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gray[100],
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '88%',
  },
  text: {
    fontSize: fontSizes.sm,
    color: colors.gray[900],
    lineHeight: fontSizes.sm * 1.55,
  },
});

// ─── Thinking bubble ──────────────────────────────────────────────────────────

function ThinkingBubble() {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 900, useNativeDriver: true })
    ).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={thS.row}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Ionicons name="sync-outline" size={13} color={colors.gray[400]} />
      </Animated.View>
      <Text style={thS.text}>Thinking...</Text>
    </View>
  );
}

const thS = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
  text: { fontSize: fontSizes.sm, color: colors.gray[500], fontStyle: 'italic' },
});

// ─── AI Response ─────────────────────────────────────────────────────────────

function AIResponse({
  msg,
  expanded,
  onToggleExpand,
}: {
  msg: AIResponseMsg;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const visibleCourses = msg.courses
    ? expanded ? msg.courses : msg.courses.slice(0, 2)
    : [];

  return (
    <View style={arS.wrapper}>
      {/* Response text */}
      <Text style={arS.bodyText}>{msg.text}</Text>

      {/* Courses list */}
      {msg.courses && msg.courses.length > 0 && (
        <View style={arS.section}>
          {/* Section header */}
          <View style={arS.sectionHeader}>
            <Text style={arS.sectionLabel}>Related courses</Text>
            {msg.courses.length > 2 && (
              <TouchableOpacity onPress={onToggleExpand} activeOpacity={0.7}>
                <Text style={arS.showMore}>
                  {expanded ? 'Show less ∧' : 'Show more ∨'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Course rows */}
          {visibleCourses.map((c) => (
            <TouchableOpacity key={c.id} style={arS.courseRow} activeOpacity={0.75}>
              <Image source={{ uri: c.image }} style={arS.thumb} />
              <View style={arS.courseInfo}>
                <Text style={arS.courseTitle} numberOfLines={2}>{c.title}</Text>
                <View style={arS.courseMeta}>
                  <Text style={arS.metaText}>{c.lessons}</Text>
                  <View style={arS.dot} />
                  <Ionicons name="time-outline" size={11} color={colors.gray[400]} />
                  <Text style={arS.metaText}>{c.duration}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={15} color={colors.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Featured course card */}
      {msg.featuredCourse && (
        <TouchableOpacity style={arS.featuredCard} activeOpacity={0.85}>
          <Image source={{ uri: msg.featuredCourse.image }} style={arS.featuredImage} />
          <View style={arS.featuredBody}>
            <Text style={arS.featuredTitle}>{msg.featuredCourse.title}</Text>
            <View style={arS.courseMeta}>
              <Text style={arS.metaText}>{msg.featuredCourse.rating}</Text>
              <View style={arS.dot} />
              <Ionicons name="time-outline" size={11} color={colors.gray[400]} />
              <Text style={arS.metaText}>{msg.featuredCourse.duration}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Feedback row */}
      <View style={arS.feedbackRow}>
        <TouchableOpacity style={arS.fbBtn} activeOpacity={0.7}>
          <Ionicons name="copy-outline" size={16} color={colors.gray[400]} />
        </TouchableOpacity>
        <TouchableOpacity style={arS.fbBtn} activeOpacity={0.7}>
          <Ionicons name="thumbs-up-outline" size={16} color={colors.gray[400]} />
        </TouchableOpacity>
        <TouchableOpacity style={arS.fbBtn} activeOpacity={0.7}>
          <Ionicons name="thumbs-down-outline" size={16} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const arS = StyleSheet.create({
  wrapper:     { gap: 12 },
  bodyText:    { fontSize: fontSizes.sm, color: colors.gray[900], lineHeight: fontSizes.sm * 1.65, fontWeight: '500' },
  section:     { gap: 2 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 6,
  },
  sectionLabel: { fontSize: fontSizes.xs, color: colors.gray[400], fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  showMore:     { fontSize: fontSizes.xs, color: '#16A34A', fontWeight: '600' },
  courseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[100],
  },
  thumb: {
    width: 48, height: 48, borderRadius: radii.sm,
    backgroundColor: colors.gray[200],
  },
  courseInfo: { flex: 1, gap: 3 },
  courseTitle: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.gray[900] },
  courseMeta:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText:    { fontSize: fontSizes.xs, color: colors.gray[400] },
  dot:         { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.gray[300] },

  // Featured course card
  featuredCard: {
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  featuredImage: { width: '100%', height: 180, backgroundColor: colors.gray[200] },
  featuredBody:  { padding: 12, gap: 4 },
  featuredTitle: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.gray[900], lineHeight: fontSizes.sm * 1.4 },

  // Feedback
  feedbackRow: { flexDirection: 'row', gap: 2 },
  fbBtn:       { padding: 5, borderRadius: radii.sm },
});

// ─── Chat input bar (text mode) ───────────────────────────────────────────────

function ChatInputBar({
  value,
  onChangeText,
  onSend,
  onMic,
  inputRef,
}: {
  value: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
  onMic: () => void;
  inputRef: React.RefObject<TextInput | null>;
}) {
  return (
    <View style={ciS.row}>
      {/* + button */}
      <TouchableOpacity style={ciS.plusBtn} activeOpacity={0.7}>
        <Ionicons name="add" size={20} color={colors.gray[500]} />
      </TouchableOpacity>

      {/* Input pill */}
      <View style={ciS.pill}>
        <TextInput
          ref={inputRef}
          style={ciS.input}
          placeholder="Ask anything..."
          placeholderTextColor={colors.gray[400]}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="send"
          onSubmitEditing={onSend}
          multiline={false}
        />
        {value.length === 0 ? (
          <TouchableOpacity onPress={onMic} activeOpacity={0.7} style={ciS.iconBtn}>
            <Ionicons name="mic-outline" size={19} color={colors.gray[500]} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onSend} activeOpacity={0.7}>
            <LinearGradient
              colors={['#F97316', '#A855F7']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={ciS.sendBtn}
            >
              <Ionicons name="arrow-up" size={14} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const ciS = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  plusBtn: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.gray[200],
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.gray[900],
    padding: 0,
  },
  iconBtn: { padding: 2 },
  sendBtn: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ─── Voice capture bar ────────────────────────────────────────────────────────

const BAR_COUNT = 18;

function VoiceCaptureBar({
  barAnims,
  onStop,
}: {
  barAnims: Animated.Value[];
  onStop: () => void;
}) {
  return (
    <View style={vcS.wrapper}>
      {/* Voice capturing label */}
      <View style={vcS.labelRow}>
        <GradientSpark size={14} />
        <LinearGradient
          colors={['#F97316', '#EC4899', '#A855F7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={vcS.labelGrad}
        >
          <Text style={vcS.labelText}>Voice capturing...</Text>
        </LinearGradient>
      </View>

      {/* Waveform card */}
      <View style={vcS.card}>
        {/* + on left */}
        <TouchableOpacity style={vcS.addBtn} activeOpacity={0.7}>
          <Ionicons name="add" size={18} color={colors.gray[400]} />
        </TouchableOpacity>

        {/* Animated bars */}
        <View style={vcS.barsContainer}>
          {barAnims.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                vcS.bar,
                { height: anim, backgroundColor: barColor(i, BAR_COUNT) },
              ]}
            />
          ))}
        </View>

        {/* Stop button */}
        <TouchableOpacity onPress={onStop} activeOpacity={0.85}>
          <LinearGradient
            colors={['#F97316', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={vcS.stopBtn}
          >
            <Ionicons name="stop" size={16} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const vcS = StyleSheet.create({
  wrapper:   { paddingHorizontal: 16, paddingBottom: 8, gap: 6 },
  labelRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  labelGrad: { borderRadius: 4 },
  labelText: {
    fontSize: fontSizes.sm, fontWeight: '600',
    color: 'transparent',
    // @ts-ignore — RN gradient text via mask not possible natively; colour text as pink fallback
    color: '#EC4899',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  addBtn:       { padding: 2 },
  barsContainer:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    minHeight: 4,
  },
  stopBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ─── Search: filter pills ─────────────────────────────────────────────────────

const FILTER_OPTIONS: { key: SearchFilter; label: string }[] = [
  { key: 'courses', label: 'Courses' },
  { key: 'people',  label: 'People'  },
  { key: 'skills',  label: 'Skills'  },
];

function FilterPills({
  active,
  onChange,
}: {
  active: SearchFilter;
  onChange: (f: SearchFilter) => void;
}) {
  return (
    <View style={fpS.row}>
      {FILTER_OPTIONS.map((f) => (
        <TouchableOpacity
          key={f.key}
          style={[fpS.pill, active === f.key && fpS.pillActive]}
          onPress={() => onChange(f.key)}
          activeOpacity={0.75}
        >
          <Text style={[fpS.label, active === f.key && fpS.labelActive]}>
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const fpS = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray[100],
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: colors.gray[900],
    borderColor: colors.gray[900],
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.gray[600],
  },
  labelActive: {
    color: colors.white,
    fontWeight: '600',
  },
});

// ─── Search: course row ───────────────────────────────────────────────────────

function SearchCourseRow({ course }: { course: CourseItem }) {
  return (
    <TouchableOpacity style={scS.row} activeOpacity={0.75}>
      <Image source={{ uri: course.image }} style={scS.thumb} />
      <View style={scS.info}>
        <Text style={scS.title} numberOfLines={1}>{course.title}</Text>
        <View style={scS.meta}>
          <Text style={scS.metaText}>{course.lessons}</Text>
          <View style={scS.dot} />
          <Ionicons name="time-outline" size={11} color={colors.gray[400]} />
          <Text style={scS.metaText}>{course.duration}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={15} color={colors.gray[400]} />
    </TouchableOpacity>
  );
}

const scS = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[100],
    backgroundColor: colors.white,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    backgroundColor: colors.gray[200],
  },
  info:     { flex: 1, gap: 4 },
  title:    { fontSize: fontSizes.sm, fontWeight: '600', color: colors.gray[900] },
  meta:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: fontSizes.xs, color: colors.gray[400] },
  dot:      { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.gray[300] },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function AskScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();

  const [activeTab,     setActiveTab]     = useState<AskTab>('chat');
  const [messages,      setMessages]      = useState<ChatMsg[]>([]);
  const [inputText,     setInputText]     = useState('');
  const [inputMode,     setInputMode]     = useState<InputMode>('text');
  const [expandedIds,   setExpandedIds]   = useState<Set<string>>(new Set());
  const [searchFilter,  setSearchFilter]  = useState<SearchFilter>('courses');

  const scrollRef    = useRef<ScrollView>(null);
  const inputRef     = useRef<TextInput | null>(null);
  const msgCountRef  = useRef(0);     // total user messages sent (for response rotation)

  // ── Waveform animations ───────────────────────────────────────────────────

  const barAnims = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(4))
  ).current;

  useEffect(() => {
    if (inputMode !== 'voice') {
      barAnims.forEach((a) => a.setValue(4));
      return;
    }

    const maxH = barAnims.map(() => 8 + Math.random() * 38);

    const loops = barAnims.map((anim, i) => {
      const dur = 180 + (i % 7) * 55;
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: maxH[i], duration: dur, useNativeDriver: false }),
          Animated.timing(anim, { toValue: 4 + Math.random() * 10, duration: dur, useNativeDriver: false }),
        ])
      );
      loop.start();
      return loop;
    });

    return () => loops.forEach((l) => l.stop());
  }, [inputMode]);

  // ── Auto-scroll to bottom when messages change ────────────────────────────

  useEffect(() => {
    if (messages.length === 0) return;
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
  }, [messages.length]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function buildResponse(idx: number, id: string): AIResponseMsg {
    if (idx === 0) {
      return {
        id, role: 'ai', state: 'done',
        text: RESPONSE_TEXT_1,
        courses: RELATED_COURSES,
      };
    }
    return {
      id, role: 'ai', state: 'done',
      text: RESPONSE_TEXT_2,
      featuredCourse: FEATURED_COURSE,
    };
  }

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const uId  = `u-${Date.now()}`;
    const tId  = `t-${Date.now()}`;
    const rId  = `r-${Date.now()}`;
    const idx  = msgCountRef.current;
    msgCountRef.current += 1;

    setMessages((prev) => [
      ...prev,
      { id: uId, role: 'user', text: text.trim() },
      { id: tId, role: 'ai',   state: 'thinking' },
    ]);
    setInputText('');
    setInputMode('text');
    inputRef.current?.blur();

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === tId ? buildResponse(idx, rId) : m))
      );
    }, 2400);
  }

  function handleMicPress() {
    setInputMode('voice');
    inputRef.current?.blur();
  }

  function handleVoiceStop() {
    // Demo: send a pre-defined voice query
    const voiceText = 'Can you recommend the best course available to amp up my skills on Allergen Prevention?';
    setInputMode('text');
    sendMessage(voiceText);
  }

  function handleNewChat() {
    setMessages([]);
    setInputText('');
    setInputMode('text');
    setExpandedIds(new Set());
    msgCountRef.current = 0;
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleChipPress(chip: string) {
    sendMessage(chip);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const hasMessages = messages.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {/* Fixed top: header + tabs */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.white }}>
        <AskHeader
          onNewChat={handleNewChat}
          onConversations={() => router.push('/conversations')}
        />
        <AskTabs active={activeTab} onChange={setActiveTab} />
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* ── Empty state ─────────────────────────────────────────────── */}
        {activeTab === 'chat' && !hasMessages && (
          <View style={s.emptyRoot}>
            <View style={s.emptyCenter}>
              <AskLogo size={92} />
              <Text style={s.emptyHeading}>What do you want to know?</Text>
              <Text style={s.emptySubtitle}>
                Ask anything about your learning, team, or compliance.
              </Text>
            </View>

            {/* Prompt chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.chipsRow}
              style={s.chipsScroll}
            >
              {PROMPT_CHIPS.map((chip) => (
                <TouchableOpacity
                  key={chip}
                  style={s.chip}
                  onPress={() => handleChipPress(chip)}
                  activeOpacity={0.75}
                >
                  <Text style={s.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Chat messages ────────────────────────────────────────────── */}
        {activeTab === 'chat' && hasMessages && (
          <ScrollView
            ref={scrollRef}
            style={s.chatScroll}
            contentContainerStyle={[s.chatContent, { paddingBottom: 12 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg) => {
              if (msg.role === 'user') {
                return (
                  <View key={msg.id} style={s.msgRow}>
                    <UserBubble text={msg.text} />
                  </View>
                );
              }
              if (msg.role === 'ai' && msg.state === 'thinking') {
                return (
                  <View key={msg.id} style={s.msgRow}>
                    <ThinkingBubble />
                  </View>
                );
              }
              if (msg.role === 'ai' && msg.state === 'done') {
                return (
                  <View key={msg.id} style={s.msgRow}>
                    <AIResponse
                      msg={msg}
                      expanded={expandedIds.has(msg.id)}
                      onToggleExpand={() => toggleExpand(msg.id)}
                    />
                  </View>
                );
              }
              return null;
            })}
          </ScrollView>
        )}

        {/* ── Search tab ──────────────────────────────────────────────── */}
        {activeTab === 'search' && (
          <View style={s.searchRoot}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 4 }}
            >
              {SEARCH_COURSES.map((c) => (
                <SearchCourseRow key={c.id} course={c} />
              ))}
              <Text style={s.itemsFound}>00 Items found</Text>
            </ScrollView>
            <FilterPills active={searchFilter} onChange={setSearchFilter} />
          </View>
        )}

        {/* ── Bottom: input OR voice capture ──────────────────────────── */}
        <View
          style={[
            s.inputArea,
            { paddingBottom: tabBarHeight + 4 },
          ]}
        >
          {inputMode === 'voice' ? (
            <VoiceCaptureBar barAnims={barAnims} onStop={handleVoiceStop} />
          ) : (
            <ChatInputBar
              value={inputText}
              onChangeText={setInputText}
              onSend={() => sendMessage(inputText)}
              onMic={handleMicPress}
              inputRef={inputRef}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  // Empty state
  emptyRoot: {
    flex: 1,
    backgroundColor: colors.white,
  },
  emptyCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyHeading: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.gray[900],
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: fontSizes.sm * 1.6,
  },
  chipsScroll: { flexGrow: 0, marginBottom: 4 },
  chipsRow:    { paddingHorizontal: 16, gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: radii.full,
    borderWidth: 1.5, borderColor: colors.gray[200],
    backgroundColor: colors.gray[50],
  },
  chipText: { fontSize: fontSizes.xs, fontWeight: '500', color: colors.gray[700] },

  // Search
  searchRoot:  { flex: 1, backgroundColor: colors.white },
  itemsFound: {
    textAlign: 'center',
    fontSize: fontSizes.sm,
    color: colors.gray[400],
    paddingVertical: 16,
  },

  // Chat
  chatScroll:  { flex: 1, backgroundColor: colors.white },
  chatContent: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  msgRow:      { width: '100%' },

  // Input area
  inputArea: {
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray[100],
  },
});
