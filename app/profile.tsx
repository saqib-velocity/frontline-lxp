import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, fontSizes, radii } from '@/constants/tokens';
import {
  useAppTheme,
  THEMES,
  THEME_META,
  type BrandTheme,
} from '@/context/ThemeContext';

// ─── Mini header preview ──────────────────────────────────────────────────────

function ThemePreview({ bg }: { bg: string }) {
  return (
    <View style={[pvS.header, { backgroundColor: bg }]}>
      {/* Fake logo bar */}
      <View style={pvS.logoBlock}>
        <View style={pvS.logoIcon} />
        <View style={pvS.logoText} />
      </View>
      <View style={pvS.icons}>
        <View style={pvS.iconDot} />
        <View style={pvS.iconDot} />
      </View>
    </View>
  );
}

const pvS = StyleSheet.create({
  header: {
    borderRadius: radii.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  logoBlock: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoIcon:  { width: 20, height: 20, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.6)' },
  logoText:  { width: 48, height: 10, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  icons:     { flexDirection: 'row', gap: 8 },
  iconDot:   { width: 14, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.5)' },
});

// ─── Theme option card ────────────────────────────────────────────────────────

function ThemeCard({
  id,
  active,
  onPress,
}: {
  id: BrandTheme;
  active: boolean;
  onPress: () => void;
}) {
  const meta   = THEME_META[id];
  const tokens = THEMES[id];

  return (
    <TouchableOpacity
      style={[tcS.card, active && tcS.cardActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ThemePreview bg={tokens.headerBg} />

      <View style={tcS.footer}>
        <View style={tcS.textCol}>
          <Text style={tcS.name}>{meta.name}</Text>
          <Text style={tcS.desc}>{meta.description}</Text>
        </View>
        <View style={[tcS.check, active && tcS.checkActive]}>
          {active && <Ionicons name="checkmark" size={12} color={colors.white} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const tcS = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
    overflow: 'hidden',
    padding: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardActive: {
    borderColor: colors.gray[900],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textCol: { flex: 1, gap: 2 },
  name:    { fontSize: fontSizes.xs, fontWeight: '700', color: colors.gray[900] },
  desc:    { fontSize: 10, color: colors.gray[500] },
  check: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 1.5, borderColor: colors.gray[300],
    alignItems: 'center', justifyContent: 'center',
  },
  checkActive: {
    backgroundColor: colors.gray[900],
    borderColor: colors.gray[900],
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const router          = useRouter();
  const { theme, tokens, setTheme } = useAppTheme();

  return (
    <View style={s.root}>
      <StatusBar style="dark" />

      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.white }}>
        {/* Nav bar */}
        <View style={s.navBar}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={20} color={colors.gray[700]} />
          </TouchableOpacity>
          <Text style={s.navTitle}>Profile &amp; Settings</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── User card ─────────────────────────────────────────────────── */}
        <View style={s.userCard}>
          {/* Avatar */}
          <View style={[s.avatar, { backgroundColor: tokens.headerBg }]}>
            <Text style={s.avatarInitials}>JD</Text>
          </View>

          <View style={s.userInfo}>
            <Text style={s.userName}>John Doe</Text>
            <Text style={s.userRole}>Frontline Associate · King Wing</Text>
          </View>

          <TouchableOpacity style={s.editBtn} activeOpacity={0.7}>
            <Ionicons name="pencil-outline" size={16} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>

        {/* ── Brand theme ───────────────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Brand Theme</Text>
          <Text style={s.sectionDesc}>
            Switch between King Wing branded experiences.
          </Text>

          <View style={s.themeRow}>
            <ThemeCard id="orange" active={theme === 'orange'} onPress={() => setTheme('orange')} />
            <ThemeCard id="dark"   active={theme === 'dark'}   onPress={() => setTheme('dark')}   />
          </View>
        </View>

        {/* ── App settings ──────────────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>App Settings</Text>

          {[
            { icon: 'notifications-outline', label: 'Notifications' },
            { icon: 'language-outline',      label: 'Language' },
            { icon: 'lock-closed-outline',   label: 'Privacy' },
            { icon: 'help-circle-outline',   label: 'Help & Support' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={s.settingRow} activeOpacity={0.7}>
              <View style={s.settingIcon}>
                <Ionicons name={item.icon as any} size={18} color={colors.gray[600]} />
              </View>
              <Text style={s.settingLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Sign out ──────────────────────────────────────────────────── */}
        <TouchableOpacity style={s.signOutBtn} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={s.signOutLabel}>Sign out</Text>
        </TouchableOpacity>

        <Text style={s.version}>King Wing LXP · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: colors.gray[50] },
  scroll:{ flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 40 },

  // Nav
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: colors.white,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.gray[100],
    alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { fontSize: fontSizes.base, fontWeight: '700', color: colors.gray[900] },

  // User card
  userCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: { fontSize: fontSizes.base, fontWeight: '800', color: colors.white },
  userInfo:   { flex: 1, gap: 3 },
  userName:   { fontSize: fontSizes.base, fontWeight: '700', color: colors.gray[900] },
  userRole:   { fontSize: fontSizes.xs, color: colors.gray[500] },
  editBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.gray[100],
    alignItems: 'center', justifyContent: 'center',
  },

  // Sections
  section: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  sectionTitle: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.gray[900] },
  sectionDesc:  { fontSize: fontSizes.xs, color: colors.gray[500], marginTop: -6 },
  themeRow:     { flexDirection: 'row', gap: 12 },

  // Settings rows
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray[100],
  },
  settingIcon: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: colors.gray[100],
    alignItems: 'center', justifyContent: 'center',
  },
  settingLabel: { flex: 1, fontSize: fontSizes.sm, color: colors.gray[900] },

  // Sign out
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: radii.lg,
  },
  signOutLabel: { fontSize: fontSizes.sm, fontWeight: '700', color: '#DC2626' },

  version: { textAlign: 'center', fontSize: fontSizes.xs, color: colors.gray[400] },
});
