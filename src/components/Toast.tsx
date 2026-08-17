import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily } from '@/theme';

interface ToastContextValue {
  showToast: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [opacity] = useState(new Animated.Value(0));

  const showToast = useCallback(
    (msg: string) => {
      setMessage(msg);
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1600),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [opacity],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[styles.toast, { opacity, transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }] }]}
      >
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 100,
    backgroundColor: colors.mossDark,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  text: {
    color: colors.paper,
    fontSize: 13,
    fontFamily: fontFamily.sansSemiBold,
    textAlign: 'center',
  },
});
