import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { colors, spacing } from '@/theme';

export function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="heading" style={styles.text}>
        Coming soon
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.textMuted,
  },
});
