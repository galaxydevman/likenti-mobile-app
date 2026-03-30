import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import CartScreen from '../screens/CartScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import type { RootStackParamList, RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const HOME_LOGO = require('../../assets/icon/likenti_logo_transparent_white.png');

function NuhdeekTab() {
  return <PlaceholderScreen title="Nuhdeek" />;
}
function AccountTab() {
  return <PlaceholderScreen title="Account" />;
}
function MoreTab() {
  return <PlaceholderScreen title="More" />;
}

function TabsNavigator() {
  const { lineCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        transitionSpec: {
          animation: 'timing',
          config: {
            duration: 220,
          },
        },
        tabBarActiveTintColor: colors.headerBlue,
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: {
          borderTopColor: '#e5e5ea',
          height: 70,
        },
      }}
    >
      <Tab.Screen
        name="Nuhdeek"
        component={NuhdeekTab}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="gift-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" color={color} size={size} />,
          tabBarBadge: lineCount > 0 ? lineCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#E11D48', color: colors.white },
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={HOME_LOGO}
              style={{ width: size + 8, height: size + 8, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountTab}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreTab}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="reorder-three-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product details', headerBackTitle: 'Back' }}
      />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search', headerBackTitle: 'Back' }} />
    </Stack.Navigator>
  );
}
