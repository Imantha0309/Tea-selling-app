import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { useCart } from '@/context';
import { colors, spacing } from '@/theme';

const TABS: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'Shop', label: 'Shop', icon: 'leaf-outline', activeIcon: 'leaf' },
  { key: 'Cart', label: 'Cart', icon: 'cart-outline', activeIcon: 'cart' },
  { key: 'Admin', label: 'Admin', icon: 'settings-outline', activeIcon: 'settings' },
];

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { cartCount } = useCart();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {state.routes.map((route, index) => {
        const tab = TABS.find((t) => t.key === route.name);
        if (!tab) return null;
        const isFocused = state.index === index;
        const showBadge = route.name === 'Cart' && cartCount > 0;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.item}
          >
            <View style={styles.iconWrap}>
              <Ionicons
                name={isFocused ? tab.activeIcon : tab.icon}
                size={20}
                color={isFocused ? colors.mossDark : '#8A9389'}
              />
              {showBadge ? (
                <View style={styles.badge}>
                  <AppText style={styles.badgeText}>
                    {cartCount}
                  </AppText>
                </View>
              ) : null}
            </View>
            <AppText
              variant="smallBold"
              color={isFocused ? colors.mossDark : '#8A9389'}
              style={styles.label}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(241,239,228,0.92)',
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconWrap: {
    position: 'relative',
    width: 44,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10.5,
    lineHeight: 14,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.clay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
});
