import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Heading2, Body } from '@/components/ui/Typography';
import { colors } from '@/constants/tokens';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Heading2>Page not found</Heading2>
        <Body style={{ marginTop: 8, marginBottom: 24 }}>
          This screen doesn't exist.
        </Body>
        <Link href="/" style={styles.link}>
          <Body style={{ color: colors.brand.primary, fontWeight: '600' }}>
            Go to home screen
          </Body>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  link: {
    marginTop: 16,
  },
});
