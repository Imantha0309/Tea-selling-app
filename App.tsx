import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  Fraunces_500Medium,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';
import { enableScreens } from 'react-native-screens';
import { CartProvider, AdminProvider } from '@/context';
import { ToastProvider } from '@/components/Toast';
import { RootNavigator, navigationTheme } from '@/navigation';

enableScreens();
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_700Bold,
    Fraunces_500Medium,
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AdminProvider>
          <CartProvider>
            <ToastProvider>
              <NavigationContainer theme={navigationTheme}>
                <StatusBar style="dark" />
                {fontsLoaded ? <RootNavigator /> : null}
              </NavigationContainer>
            </ToastProvider>
          </CartProvider>
        </AdminProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
