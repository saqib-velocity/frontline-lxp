import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';

interface WelcomeCTAProps {
  onPress: () => void;
}

export function WelcomeCTA({ onPress }: WelcomeCTAProps) {
  return (
    <View style={styles.wrapper}>
      <SafeAreaView edges={['bottom']}>
        <Button
          label="Let's go!"
          onPress={onPress}
          variant="pill"
          size="xl"
          style={styles.button}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  button: {
    width: '100%',
  },
});
