import { DefaultTheme, Theme } from '@react-navigation/native';
import { colors } from '@/theme';

export const navigationTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.mossDark,
    background: colors.background,
    card: colors.paper,
    text: colors.ink,
    border: colors.border,
    notification: colors.danger,
  },
};
