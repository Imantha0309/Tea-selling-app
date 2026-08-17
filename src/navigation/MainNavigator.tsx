import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { MAIN_ROUTES } from './routes';
import { MainStackParamList } from './types';
import { colors, fontFamily } from '@/theme';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name={MAIN_ROUTES.TABS}
        component={BottomTabNavigator}
      />
    </Stack.Navigator>
  );
}
