import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { colors, spacing } from '@/theme';

export interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({ title, message, icon = 'leaf' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={40} color={colors.gold} />
      </View>
      <AppText variant="heading" color={colors.text} style={styles.title}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="body" color={colors.textMuted} style={styles.message}>
          {message}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
