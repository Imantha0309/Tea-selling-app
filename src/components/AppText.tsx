import React from 'react';
import { Text, TextProps, TextStyle, StyleProp } from 'react-native';
import { colors, typography } from '@/theme';

export type AppTextVariant = keyof typeof typography;

export interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function AppText({ variant = 'body', color, style, ...rest }: AppTextProps) {
  return (
    <Text
      {...rest}
      style={[
        { ...typography[variant] },
        color ? { color } : null,
        style,
      ]}
    />
  );
}

export const textColors = colors;
