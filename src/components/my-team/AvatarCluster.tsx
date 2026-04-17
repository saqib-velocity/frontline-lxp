import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSizes } from '@/constants/tokens';
import type { TeamMember } from '@/types/team';

interface Props {
  members: TeamMember[];
  /** How many avatars to show before "+N" */
  maxVisible?: number;
}

export function AvatarCluster({ members, maxVisible = 4 }: Props) {
  const visible = members.slice(0, maxVisible);
  const overflow = members.length - maxVisible;

  return (
    <View style={styles.row}>
      {visible.map((m, i) => (
        <View
          key={m.id}
          style={[
            styles.avatar,
            { backgroundColor: m.avatarColor, marginLeft: i === 0 ? 0 : -8, zIndex: maxVisible - i },
          ]}
        >
          <Text style={styles.initials}>{m.initials}</Text>
        </View>
      ))}
      {overflow > 0 && (
        <View style={[styles.avatar, styles.overflow, { marginLeft: -8 }]}>
          <Text style={styles.overflowText}>+{overflow}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  initials: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  overflow: {
    backgroundColor: colors.gray[300],
  },
  overflowText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.gray[700],
  },
});
