/**
 * Survey Screen
 *
 * Multi-question form engine driven entirely by a SurveyConfig object.
 * Swap the mock config with a real API call to make it fully backend-configurable.
 *
 * Supports question types:
 *   - single_choice  — radio-button list with optional sub-description per option
 *   - text           — multi-line free-text area
 *
 * Flow:
 *   Q1…Qn-1 → "Continue" (grey/disabled until answered for mandatory questions)
 *   Qn      → "Submit"   (always active for optional questions)
 *   Submit  → success toast → auto-navigate back to home after 2.5 s
 *
 * Figma: nodes 6383-89694 / 89697 (single choice) + 89716 / 89717 (text)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, fontSizes, radii } from '@/constants/tokens';
import { COMPANY_ONBOARDING_SURVEY, type SurveyConfig } from '@/constants/survey';

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Green tag badge above the question */
function QuestionTag({ label, variant }: { label: string; variant: 'pale' | 'filled' }) {
  const isPale = variant === 'pale';
  return (
    <View style={[tag.root, isPale ? tag.pale : tag.filled]}>
      <Ionicons
        name={isPale ? 'chatbubble-ellipses-outline' : 'clipboard-outline'}
        size={12}
        color={isPale ? '#112327' : '#fff'}
      />
      <Text style={[tag.label, !isPale && tag.labelFilled]}>{label}</Text>
    </View>
  );
}

const tag = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  pale:   { backgroundColor: '#E2F8BE' },
  filled: { backgroundColor: '#17B107' },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: '#112327',
  },
  labelFilled: { color: '#fff' },
});

/** Single radio option row */
function RadioOption({
  label,
  description,
  selected,
  onPress,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[ro.row, selected && ro.rowSelected]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Radio circle */}
      <View style={ro.radioWrap}>
        <View style={[ro.outer, selected && ro.outerSelected]}>
          {selected && <View style={ro.inner} />}
        </View>
      </View>

      {/* Text */}
      <View style={ro.textBlock}>
        <Text style={[ro.label, selected && ro.labelSelected]}>{label}</Text>
        {description ? <Text style={ro.desc}>{description}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const ro = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingRight: 12,
  },
  rowSelected: {
    backgroundColor: '#F7F7F7',
    borderColor: '#9F9F9F',
    shadowColor: 'rgba(36,12,64,0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  radioWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  outer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9F9F9F',
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerSelected: {
    borderColor: '#121212',
    backgroundColor: '#121212',
  },
  inner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  textBlock: {
    flex: 1,
    gap: 2,
    paddingTop: 6,
  },
  label: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.gray[900],
  },
  labelSelected: { fontWeight: '700' },
  desc: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: '#686868',
    lineHeight: 22,
  },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function SurveyScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  // In production: fetch from API using survey ID passed as route param
  const survey: SurveyConfig = COMPANY_ONBOARDING_SURVEY;

  const [qIndex,      setQIndex]      = useState(0);
  const [answers,     setAnswers]     = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const q             = survey.questions[qIndex];
  const total         = survey.questions.length;
  const isLast        = qIndex === total - 1;
  const answer        = answers[q.id] ?? '';

  // Continue is active when the question is optional OR has an answer
  const canContinue = q.optional || (q.type === 'single_choice' ? !!answer : true);

  function handleBack() {
    if (qIndex > 0) {
      setQIndex((i) => i - 1);
    } else {
      router.back();
    }
  }

  function handleContinue() {
    if (!canContinue) return;
    if (isLast) {
      // Submit — show toast then go home
      setShowSuccess(true);
      setTimeout(() => {
        router.replace('/(app)/' as any);
      }, 2500);
    } else {
      setQIndex((i) => i + 1);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[s.root, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />

        {/* ── Nav bar ──────────────────────────────────────────────────────── */}
        <View style={s.navBar}>
          <TouchableOpacity style={s.backBtn} onPress={handleBack} activeOpacity={0.75}>
            <Ionicons name="chevron-back" size={18} color={colors.gray[900]} />
          </TouchableOpacity>

          <View style={s.navTitles}>
            <Text style={s.navTitle} numberOfLines={1}>{survey.title}</Text>
            <Text style={s.navSub}>Question {qIndex + 1} of {total}</Text>
          </View>
        </View>

        {/* ── Question card ─────────────────────────────────────────────────── */}
        <View style={s.cardWrap}>
          <ScrollView
            style={s.card}
            contentContainerStyle={s.cardInner}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={s.qHeader}>
              {q.tag && <QuestionTag label={q.tag.label} variant={q.tag.variant} />}
              <Text style={s.qText}>{q.question}</Text>
              {q.description ? <Text style={s.qDesc}>{q.description}</Text> : null}
            </View>

            {/* ── Single choice ─────────────────────────────────────────────── */}
            {q.type === 'single_choice' && q.options && (
              <View style={s.options}>
                {q.options.map((opt) => (
                  <RadioOption
                    key={opt.id}
                    label={opt.label}
                    description={opt.description}
                    selected={answer === opt.id}
                    onPress={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                  />
                ))}
              </View>
            )}

            {/* ── Free text ─────────────────────────────────────────────────── */}
            {q.type === 'text' && (
              <TextInput
                style={s.textArea}
                multiline
                placeholder={q.placeholder ?? 'Share your feedback'}
                placeholderTextColor="#898989"
                value={answer}
                onChangeText={(t) => setAnswers((prev) => ({ ...prev, [q.id]: t }))}
                textAlignVertical="top"
              />
            )}
          </ScrollView>
        </View>

        {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
        <View style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
          <TouchableOpacity
            style={[s.ctaBtn, !canContinue && s.ctaBtnDisabled]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={s.ctaText}>{isLast ? 'Submit' : 'Continue'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Success toast (Figma node 6383-89730) ─────────────────────────── */}
        {showSuccess && (
          <View style={[s.toast, { top: insets.top + 8 }]}>
            <Ionicons name="checkmark-circle" size={16} color="#078810" />
            <View style={s.toastBody}>
              <Text style={s.toastTitle}>Survey submitted</Text>
              <Text style={s.toastSub}>Thanks for sharing your feedback!</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowSuccess(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={16} color={colors.gray[900]} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  // Nav bar
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
    backgroundColor: '#F2F2F2',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#E3E3E3',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  navTitles: { flex: 1, gap: 2 },
  navTitle: {
    fontSize: fontSizes.base,
    fontWeight: '800',
    color: colors.gray[900],
  },
  navSub: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: '#686868',
  },

  // Card area — fills remaining space
  cardWrap: {
    flex: 1,
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: 'rgba(36,12,64,0.16)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  cardInner: {
    padding: 16,
    gap: 24,
    flexGrow: 1,
  },

  // Question header
  qHeader: { gap: 8 },
  qText: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.gray[900],
    lineHeight: 28,
  },
  qDesc: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: '#686868',
    lineHeight: 22,
  },

  // Radio option list
  options: { gap: 8 },

  // Text area
  textArea: {
    borderWidth: 1,
    borderColor: '#CFCFCF',
    borderRadius: 12,
    padding: 12,
    minHeight: 214,
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: 24,
    backgroundColor: '#fff',
  },

  // Bottom CTA bar
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#F2F2F2',
  },
  ctaBtn: {
    height: 48,
    borderRadius: 20,
    backgroundColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnDisabled: {
    backgroundColor: '#B6B6B6',
  },
  ctaText: {
    fontSize: fontSizes.base,
    fontWeight: '800',
    color: colors.white,
  },

  // Toast (Figma node 6383-89730)
  toast: {
    position: 'absolute',
    left: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    shadowColor: 'rgba(36,12,64,0.16)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  toastBody: { flex: 1, gap: 2 },
  toastTitle: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.gray[900],
  },
  toastSub: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: '#686868',
  },
});
