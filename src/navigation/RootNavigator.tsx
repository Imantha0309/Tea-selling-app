import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MainNavigator } from './MainNavigator';
import { colors } from '@/theme';

export function RootNavigator() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <MainNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
