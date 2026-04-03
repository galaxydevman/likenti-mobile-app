import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import CartScreen from '../screens/CartScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ExploreCategoriesScreen from '../screens/ExploreCategoriesScreen';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import type { HomeStackParamList, RootTabParamList } from './types';
import {
  AnimatedTabBarButton,
  AnimatedTabLabel,
  TAB_ACTIVE_BG,
  TAB_ACTIVE_TINT,
  TAB_INACTIVE_TINT,
} from './AnimatedTabBarButton';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function TabBarChromeBackground() {
  return (
    <>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.white }]} />
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0)',
          'rgba(188, 204, 242, 0.16)',
          'rgba(218, 208, 236, 0.14)',
          'rgba(200, 228, 220, 0.12)',
          'rgba(255, 255, 255, 0)',
        ]}
        locations={[0, 0.22, 0.5, 0.78, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.tabBarTopAccent}
      />
    </>
  );
}
function NuhdeekTab() {
  return <PlaceholderScreen title="Nuhdeek" />;
}
function AccountTab() {
  return <PlaceholderScreen title="Account" />;
}
function MoreTab() {
  return <PlaceholderScreen title="More" />;
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: '', headerBackTitle: 'Back', headerTitleAlign: 'left' }}
      />
      <HomeStack.Screen
        name="ExploreCategories"
        component={ExploreCategoriesScreen}
        options={({ navigation }) => ({
          title: 'Explore Categories',
          headerTitleAlign: 'center',
          headerBackTitle: 'Back',
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Search"
              onPress={() => navigation.navigate('Search')}
              hitSlop={12}
              style={{ marginRight: 4 }}
            >
              <Ionicons name="search-outline" size={24} color={colors.textDark} />
            </Pressable>
          ),
        })}
      />
      <HomeStack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={({ route }) => ({ title: route.params.categoryTitle, headerBackTitle: 'Back' })}
      />
      <HomeStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product details', headerBackTitle: 'Back' }}
      />
    </HomeStack.Navigator>
  );
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
        tabBarButton: (props) => <AnimatedTabBarButton {...props} activeBackgroundColor={TAB_ACTIVE_BG} />,
        tabBarActiveTintColor: TAB_ACTIVE_TINT,
        tabBarInactiveTintColor: TAB_INACTIVE_TINT,
        tabBarActiveBackgroundColor: TAB_ACTIVE_BG,
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarLabel: ({ focused, children }) => (
          <AnimatedTabLabel focused={focused}>{children}</AnimatedTabLabel>
        ),
        tabBarBackground: () => <TabBarChromeBackground />,
        tabBarStyle: {
          borderTopWidth: 0,
          height: 82,
          paddingTop: 6,
          elevation: 4,
          shadowColor: 'rgba(130, 140, 160, 0.08)',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 1,
          shadowRadius: 5,
        },
      }}
    >
      <Tab.Screen
        name="Nuhdeek"
        component={NuhdeekTab}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'gift' : 'gift-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'cart' : 'cart-outline'} color={color} size={size} />
          ),
          tabBarBadge: lineCount > 0 ? lineCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#E11D48', color: colors.white },
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountTab}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreTab}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'reorder-three' : 'reorder-three-outline'} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarTopAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});

export default function RootNavigator() {
  return <TabsNavigator />;
}
