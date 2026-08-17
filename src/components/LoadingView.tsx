import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors, spacing } from '@/theme';

export interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = 'පූරවමින්...' }: LoadingViewProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.gold} />
      {message ? (
        <AppText variant="caption" color={colors.textMuted} style={styles.message}>
          {message}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  message: {
    marginTop: spacing.sm,
  },
});
