import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import CartScreen from '../screens/CartScreen';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

export type RootTabParamList = {
  Nuhdeek: undefined;
  Home: undefined;
  Cart: undefined;
  More: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const HOME_LOGO = require('../../assets/icon/likenti_logo_transparent_white.png');

function NuhdeekTab() {
  return <PlaceholderScreen title="Nuhdeek" />;
}
function MoreTab() {
  return <PlaceholderScreen title="More" />;
}

export default function RootNavigator() {
  const { lineCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
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
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" color={color} size={size} />,
          tabBarBadge: lineCount > 0 ? lineCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#E11D48', color: colors.white },
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
