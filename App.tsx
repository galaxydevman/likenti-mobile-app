import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme/ThemeContext';
import { CartProvider } from './src/context/CartContext';
import { RecentlyViewedProvider } from './src/context/RecentlyViewedContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <CartProvider>
          <RecentlyViewedProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <RootNavigator />
            </NavigationContainer>
          </RecentlyViewedProvider>
        </CartProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

