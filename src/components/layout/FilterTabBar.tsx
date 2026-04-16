import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, radii, fontSizes } from '@/constants/tokens';
import type { FilterTab } from '@/types/course';

interface FilterTabBarProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
}

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'todo', label: 'To-Do' },
  { key: 'my-learning', label: 'My learning' },
  { key: 'events', label: 'Events' },
];

export function FilterTabBar({ activeTab, onTabChange }: FilterTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.8}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: radii.full,
  },
  tabActive: {
    backgroundColor: colors.tabActive,
  },
  tabLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.gray[500],
  },
  tabLabelActive: {
    color: colors.tabActiveText,
    fontWeight: '600',
  },
});
