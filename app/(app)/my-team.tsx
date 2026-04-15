import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heading2, Body } from '@/components/ui/Typography';
import { colors } from '@/constants/tokens';

export default function MyTeamScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Heading2>My Team</Heading2>
        <Body style={{ marginTop: 8, color: colors.gray[500] }}>
          Coming soon
        </Body>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
