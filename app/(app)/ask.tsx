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
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { colors, fontSizes, radii } from '@/constants/tokens';
import { AskLogo } from '@/components/ask/AskLogo';

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatMode = 'empty' | 'typing' | 'thinking' | 'response';
type AskTab = 'chat' | 'search';

// ─── Gradient sparkles icon (used inline in header + suggestions) ─────────────

const SPARK_SVG = (size: number) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

function GradientSparkIcon({ size = 20 }: { size?: number }) {
  return <SvgXml xml={SPARK_SVG(size)} width={size} height={size} />;
}

// ─── Prompt chips (empty state) ───────────────────────────────────────────────

const PROMPT_CHIPS = [
  'What courses are due this week?',
  'Summarise my team compliance',
  'Find fire safety training',
  'What\'s new in my learning plan?',
  'Help me prepare for 1:1',
];

// ─── Ask AI suggestions (typing state) ───────────────────────────────────────

const ASK_SUGGESTIONS = [
  'What compliance training is overdue?',
  'Show me leadership courses',
  'Summarise last week\'s team activity',
  'Find courses on customer service',
];

// ─── Thinking steps ───────────────────────────────────────────────────────────

const THINKING_STEPS = [
  { id: 'think',    label: 'Thinking' },
  { id: 'search',   label: 'Searching' },
  { id: 'browse',   label: 'Browsing knowledge base' },
  { id: 'courses',  label: 'Looking through courses' },
];

// ─── Related courses (response state) ────────────────────────────────────────

const RELATED_COURSES = [
  {
    id: '1',
    title: 'Fire Safety Fundamentals',
    duration: '45 min',
    category: 'Compliance',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=80',
  },
  {
    id: '2',
    title: 'Customer Service Excellence',
    duration: '1h 20 min',
    category: 'Skills',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=120&q=80',
  },
  {
    id: '3',
    title: 'Health & Safety at Work',
    duration: '30 min',
    category: 'Compliance',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=120&q=80',
  },
];

// ─── Spinner SVG (thinking state) ────────────────────────────────────────────

const SPINNER_SVG = `
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="spg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#F97316"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
  </defs>
  <circle cx="8" cy="8" r="6" fill="none" stroke="url(#spg)" stroke-width="2"
    stroke-dasharray="28" stroke-dashoffset="10" stroke-linecap="round"/>
</svg>`;

// ─── AskHeader ────────────────────────────────────────────────────────────────

function AskHeader({ onClose }: { onClose?: () => void }) {
  return (
    <View style={hdrStyles.row}>
      {/* Left icons */}
      <View style={hdrStyles.leftIcons}>
        <TouchableOpacity style={hdrStyles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="document-text-outline" size={20} color={colors.gray[700]} />
        </TouchableOpacity>
        <TouchableOpacity style={hdrStyles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="create-outline" size={20} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>

      {/* Center: sparkle + "Ask" */}
      <View style={hdrStyles.center}>
        <GradientSparkIcon size={18} />
        <Text style={hdrStyles.title}>Ask</Text>
      </View>

      {/* Right: close */}
      <View style={hdrStyles.rightIcons}>
        {onClose ? (
          <TouchableOpacity style={hdrStyles.iconBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={22} color={colors.gray[400]} />
          </TouchableOpacity>
        ) : (
          <View style={hdrStyles.iconBtn} />
        )}
      </View>
    </View>
  );
}

const hdrStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  leftIcons: { flexDirection: 'row', gap: 4, width: 72 },
  center:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rightIcons:{ width: 72, alignItems: 'flex-end' },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.gray[900],
  },
});

// ─── Segmented tabs (Chat / Search) ──────────────────────────────────────────

function AskSegmentedTabs({
  active,
  onChange,
}: {
  active: AskTab;
  onChange: (t: AskTab) => void;
}) {
  return (
    <View style={segStyles.track}>
      {(['chat', 'search'] as AskTab[]).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[segStyles.tab, active === tab && segStyles.tabActive]}
          onPress={() => onChange(tab)}
          activeOpacity={0.8}
        >
          <Text style={[segStyles.label, active === tab && segStyles.labelActive]}>
            {tab === 'chat' ? 'Chat' : 'Search'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const segStyles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: radii.full,
    padding: 3,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: radii.full,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.gray[500],
  },
  labelActive: {
    fontWeight: '700',
    color: colors.gray[900],
  },
});

// ─── Gradient border input ────────────────────────────────────────────────────

function GradientInput({
  value,
  onChangeText,
  onFocus,
  onSubmit,
  focused,
  inputRef,
}: {
  value: string;
  onChangeText: (t: string) => void;
  onFocus: () => void;
  onSubmit: () => void;
  focused: boolean;
  inputRef: React.RefObject<TextInput | null>;
}) {
  return (
    <View style={giStyles.wrapper}>
      {/* Gradient border ring — only shown when focused */}
      {focused ? (
        <LinearGradient
          colors={['#F97316', '#EC4899', '#A855F7']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={giStyles.gradientBorder}
        >
          <View style={giStyles.innerBox}>
            <InputInner
              value={value}
              onChangeText={onChangeText}
              onFocus={onFocus}
              onSubmit={onSubmit}
              inputRef={inputRef}
            />
          </View>
        </LinearGradient>
      ) : (
        <View style={giStyles.plainBorder}>
          <InputInner
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onSubmit={onSubmit}
            inputRef={inputRef}
          />
        </View>
      )}
    </View>
  );
}

function InputInner({
  value,
  onChangeText,
  onFocus,
  onSubmit,
  inputRef,
}: {
  value: string;
  onChangeText: (t: string) => void;
  onFocus: () => void;
  onSubmit: () => void;
  inputRef: React.RefObject<TextInput | null>;
}) {
  return (
    <View style={giStyles.inputRow}>
      <GradientSparkIcon size={18} />
      <TextInput
        ref={inputRef}
        style={giStyles.textInput}
        placeholder="Ask anything..."
        placeholderTextColor={colors.gray[400]}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        returnKeyType="send"
        onSubmitEditing={onSubmit}
        multiline={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onSubmit} activeOpacity={0.8}>
          <LinearGradient
            colors={['#F97316', '#A855F7']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={giStyles.sendBtn}
          >
            <Ionicons name="arrow-up" size={14} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const giStyles = StyleSheet.create({
  wrapper: { marginHorizontal: 16, marginBottom: 8 },
  gradientBorder: {
    borderRadius: radii.full,
    padding: 2,
  },
  innerBox: {
    backgroundColor: colors.white,
    borderRadius: radii.full - 2,
    overflow: 'hidden',
  },
  plainBorder: {
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.gray[900],
    padding: 0,
  },
  sendBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Typing: Ask AI suggestion rows ──────────────────────────────────────────

function SuggestionRow({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={srStyles.row} onPress={onPress} activeOpacity={0.7}>
      <GradientSparkIcon size={18} />
      <Text style={srStyles.text} numberOfLines={1}>
        {text}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={colors.gray[400]} />
    </TouchableOpacity>
  );
}

const srStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  text: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.gray[900],
  },
});

// ─── Thinking steps ───────────────────────────────────────────────────────────

function ThinkingSteps({ activeStep }: { activeStep: number }) {
  return (
    <View style={tsStyles.container}>
      {THINKING_STEPS.map((step, i) => {
        const done    = i < activeStep;
        const current = i === activeStep;
        const pending = i > activeStep;

        return (
          <View key={step.id} style={tsStyles.row}>
            {/* Icon column */}
            <View style={tsStyles.iconCol}>
              {done ? (
                <View style={tsStyles.doneCircle}>
                  <Ionicons name="checkmark" size={10} color={colors.white} />
                </View>
              ) : current ? (
                <SvgXml xml={SPINNER_SVG} width={16} height={16} />
              ) : (
                <View style={tsStyles.pendingDot} />
              )}
              {i < THINKING_STEPS.length - 1 && (
                <View style={[tsStyles.connector, done && tsStyles.connectorDone]} />
              )}
            </View>

            {/* Label */}
            <Text
              style={[
                tsStyles.label,
                done    && tsStyles.labelDone,
                current && tsStyles.labelCurrent,
                pending && tsStyles.labelPending,
              ]}
            >
              {step.label}
              {current ? '...' : ''}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const tsStyles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 32,
  },
  iconCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 10,
  },
  doneCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#A855F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[300],
    margin: 4,
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 14,
    backgroundColor: colors.gray[200],
    borderRadius: 1,
    marginTop: 3,
  },
  connectorDone: {
    backgroundColor: '#A855F7',
  },
  label: {
    fontSize: fontSizes.sm,
    paddingTop: 1,
    lineHeight: 20,
  },
  labelDone:    { color: colors.gray[400] },
  labelCurrent: { color: colors.gray[900], fontWeight: '600' },
  labelPending: { color: colors.gray[300] },
});

// ─── Response: Related course row ─────────────────────────────────────────────

function RelatedCourseRow({
  course,
}: {
  course: typeof RELATED_COURSES[0];
}) {
  return (
    <TouchableOpacity style={rcStyles.row} activeOpacity={0.7}>
      <Image source={{ uri: course.image }} style={rcStyles.thumb} />
      <View style={rcStyles.info}>
        <Text style={rcStyles.title} numberOfLines={2}>{course.title}</Text>
        <View style={rcStyles.meta}>
          <Text style={rcStyles.metaText}>{course.category}</Text>
          <View style={rcStyles.dot} />
          <Text style={rcStyles.metaText}>{course.duration}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.gray[400]} />
    </TouchableOpacity>
  );
}

const rcStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[100],
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    backgroundColor: colors.gray[200],
  },
  info: { flex: 1, gap: 4 },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: fontSizes.sm * 1.4,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: fontSizes.xs, color: colors.gray[500] },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.gray[300] },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function AskScreen() {
  const insets       = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [activeTab, setActiveTab] = useState<AskTab>('chat');
  const [inputText, setInputText] = useState('');
  const [mode, setMode]           = useState<ChatMode>('empty');
  const [inputFocused, setFocused]= useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [activeStep, setActiveStep]   = useState(0);

  const inputRef = useRef<TextInput | null>(null);

  // ── Thinking animation ───────────────────────────────────────────────────

  useEffect(() => {
    if (mode !== 'thinking') return;

    setActiveStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];

    THINKING_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setActiveStep(i);
        }, i * 1100),
      );
    });

    // Transition to response after all steps
    timers.push(
      setTimeout(() => {
        setMode('response');
      }, THINKING_STEPS.length * 1100 + 400),
    );

    return () => timers.forEach(clearTimeout);
  }, [mode]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleFocus() {
    setFocused(true);
    if (mode === 'empty') setMode('typing');
  }

  function handleTextChange(text: string) {
    setInputText(text);
    if (text.length > 0 && mode === 'empty') setMode('typing');
    if (text.length === 0 && mode === 'typing') setMode('empty');
  }

  function handleSubmit(text?: string) {
    const msg = text ?? inputText;
    if (!msg.trim()) return;
    setUserMessage(msg.trim());
    setInputText('');
    setFocused(false);
    inputRef.current?.blur();
    setMode('thinking');
  }

  function handleNewChat() {
    setMode('empty');
    setInputText('');
    setUserMessage('');
    setFocused(false);
  }

  function handleChipPress(chip: string) {
    setInputText(chip);
    setMode('typing');
    inputRef.current?.focus();
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.white }}>
        <AskHeader onClose={mode !== 'empty' ? handleNewChat : undefined} />
        <AskSegmentedTabs active={activeTab} onChange={setActiveTab} />
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* ── EMPTY STATE ─────────────────────────────────────────────── */}
        {mode === 'empty' && (
          <View style={styles.emptyRoot}>
            {/* Logo + heading */}
            <View style={styles.emptyCenter}>
              <AskLogo size={96} />
              <Text style={styles.emptyHeading}>What do you want to know?</Text>
              <Text style={styles.emptySubtitle}>
                Ask anything about your learning, team, or compliance.
              </Text>
            </View>

            {/* Prompt chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScroll}
              style={styles.chipsContainer}
            >
              {PROMPT_CHIPS.map((chip) => (
                <TouchableOpacity
                  key={chip}
                  style={styles.chip}
                  onPress={() => handleChipPress(chip)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Input */}
            <View style={[styles.inputWrapper, { paddingBottom: tabBarHeight + 8 }]}>
              <GradientInput
                value={inputText}
                onChangeText={handleTextChange}
                onFocus={handleFocus}
                onSubmit={() => handleSubmit()}
                focused={inputFocused}
                inputRef={inputRef}
              />
            </View>
          </View>
        )}

        {/* ── TYPING STATE ────────────────────────────────────────────── */}
        {mode === 'typing' && (
          <View style={styles.typingRoot}>
            <ScrollView
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingTop: 8 }}
            >
              <Text style={styles.suggestionsLabel}>Ask AI</Text>
              {ASK_SUGGESTIONS.filter((s) =>
                inputText.length === 0 ||
                s.toLowerCase().includes(inputText.toLowerCase()),
              ).map((s) => (
                <SuggestionRow
                  key={s}
                  text={s}
                  onPress={() => handleSubmit(s)}
                />
              ))}
            </ScrollView>

            <View style={[styles.inputWrapper, { paddingBottom: tabBarHeight + 8 }]}>
              <GradientInput
                value={inputText}
                onChangeText={handleTextChange}
                onFocus={handleFocus}
                onSubmit={() => handleSubmit()}
                focused={inputFocused}
                inputRef={inputRef}
              />
            </View>
          </View>
        )}

        {/* ── THINKING STATE ──────────────────────────────────────────── */}
        {mode === 'thinking' && (
          <View style={styles.chatRoot}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={[styles.chatContent, { paddingBottom: tabBarHeight + 16 }]}
            >
              {/* User message bubble */}
              <View style={styles.userBubbleRow}>
                <View style={styles.userBubble}>
                  <Text style={styles.userBubbleText}>{userMessage}</Text>
                </View>
              </View>

              {/* Thinking steps */}
              <View style={styles.aiBubbleWrapper}>
                <ThinkingSteps activeStep={activeStep} />
              </View>
            </ScrollView>
          </View>
        )}

        {/* ── RESPONSE STATE ──────────────────────────────────────────── */}
        {mode === 'response' && (
          <View style={styles.chatRoot}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={[styles.chatContent, { paddingBottom: tabBarHeight + 16 }]}
              showsVerticalScrollIndicator={false}
            >
              {/* User message bubble */}
              <View style={styles.userBubbleRow}>
                <View style={styles.userBubble}>
                  <Text style={styles.userBubbleText}>{userMessage}</Text>
                </View>
              </View>

              {/* AI response */}
              <View style={styles.aiResponseWrapper}>
                {/* Gradient sparkle avatar */}
                <View style={styles.aiAvatarRow}>
                  <GradientSparkIcon size={20} />
                </View>

                <Text style={styles.aiResponseText}>
                  Based on your current learning plan and team activity, here's what I found for you. Your compliance training has been progressing well this month. Here are some relevant courses that might help:
                </Text>

                {/* Related courses */}
                <View style={styles.relatedSection}>
                  <Text style={styles.relatedLabel}>Related courses</Text>
                  {RELATED_COURSES.map((c) => (
                    <RelatedCourseRow key={c.id} course={c} />
                  ))}
                </View>

                {/* Feedback row */}
                <View style={styles.feedbackRow}>
                  <TouchableOpacity style={styles.feedbackBtn} activeOpacity={0.7}>
                    <Ionicons name="copy-outline" size={16} color={colors.gray[500]} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.feedbackBtn} activeOpacity={0.7}>
                    <Ionicons name="thumbs-up-outline" size={16} color={colors.gray[500]} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.feedbackBtn} activeOpacity={0.7}>
                    <Ionicons name="thumbs-down-outline" size={16} color={colors.gray[500]} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Input bar for follow-up */}
            <View style={[styles.inputWrapper, { paddingBottom: tabBarHeight + 8 }]}>
              <GradientInput
                value={inputText}
                onChangeText={handleTextChange}
                onFocus={handleFocus}
                onSubmit={() => handleSubmit()}
                focused={inputFocused}
                inputRef={inputRef}
              />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Empty state
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

  // Prompt chips
  chipsContainer: {
    flexGrow: 0,
    marginBottom: 8,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    backgroundColor: colors.gray[50],
  },
  chipText: {
    fontSize: fontSizes.xs,
    fontWeight: '500',
    color: colors.gray[700],
    whiteSpace: 'nowrap',
  } as any,

  // Input wrapper (shared across states)
  inputWrapper: {
    paddingTop: 8,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray[100],
  },

  // ── Typing state
  typingRoot: {
    flex: 1,
    backgroundColor: colors.white,
  },
  suggestionsLabel: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // ── Chat (thinking + response shared)
  chatRoot: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },

  // User bubble
  userBubbleRow: {
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: colors.gray[100],
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '78%',
  },
  userBubbleText: {
    fontSize: fontSizes.sm,
    color: colors.gray[900],
    lineHeight: fontSizes.sm * 1.5,
  },

  // AI thinking wrapper
  aiBubbleWrapper: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    paddingVertical: 8,
    maxWidth: '90%',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  // AI response
  aiResponseWrapper: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 14,
    maxWidth: '94%',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    gap: 10,
  },
  aiAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiResponseText: {
    fontSize: fontSizes.sm,
    color: colors.gray[700],
    lineHeight: fontSizes.sm * 1.65,
  },

  // Related courses
  relatedSection: {
    gap: 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray[100],
    paddingTop: 10,
  },
  relatedLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },

  // Feedback
  feedbackRow: {
    flexDirection: 'row',
    gap: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray[100],
    paddingTop: 10,
  },
  feedbackBtn: {
    padding: 6,
    borderRadius: radii.sm,
  },
});
