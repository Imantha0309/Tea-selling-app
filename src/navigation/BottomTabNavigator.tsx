import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBar } from '@/components';
import { ShopScreen } from '@/screens/shop/ShopScreen';
import { CartScreen } from '@/screens/cart/CartScreen';
import { AdminScreen } from '@/screens/admin/AdminScreen';
import { TAB_ROUTES } from './routes';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, lazy: true }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tab.Screen name={TAB_ROUTES.SHOP} component={ShopScreen} />
      <Tab.Screen name={TAB_ROUTES.CART} component={CartScreen} />
      <Tab.Screen name={TAB_ROUTES.ADMIN} component={AdminScreen} />
    </Tab.Navigator>
  );
}
