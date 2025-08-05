import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import { UserProvider } from './context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './styles/themes';
import { useTheme } from './context/UserContext';

// Import screens
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import BusinessPageScreen from './screens/BusinessPageScreen';
import ProfileScreen from './screens/ProfileScreen';
import FoodMenuScreen from './screens/FoodMenuScreen';
import DrinksMenuScreen from './screens/DrinksMenuScreen';
import UnifiedMenuScreen from './screens/UnifiedMenuScreen';
import EditBusinessScreen from './screens/EditBusinessScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const USER_STORAGE_KEY = 'user_data';

function TabNavigator({ user, setUser }) {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Business') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.navigation.icon,
        tabBarInactiveTintColor: theme.navigation.iconInactive,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.navigation.border,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map">
        {(props) => <MapScreen {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Business" 
        listeners={({ navigation }) => ({ 
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Business', { resetView: Date.now() });
          },
        })}
      >
        {(props) => <BusinessPageScreen {...props} />} 
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} user={user} setUser={setUser} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const storedUser = await SecureStore.getItemAsync(USER_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log('👤 User loaded from storage');
        }
      } catch (e) {
        console.error('Error loading user from storage:', e);
        // Handle error, maybe delete invalid data?
        // await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <UserProvider user={user} isLoading={isLoading} setUser={setUser}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Tabs"
            options={{ headerShown: false }}
          >
            {(props) => <TabNavigator {...props} user={user} setUser={setUser} />} 
          </Stack.Screen>
          <Stack.Screen name="UnifiedMenu" component={UnifiedMenuScreen} />
          <Stack.Screen name="FoodMenu" component={FoodMenuScreen} options={{ title: 'Food Menu' }} />
          <Stack.Screen name="DrinksMenu" component={DrinksMenuScreen} options={{ title: 'Drinks Menu' }} />
          <Stack.Screen name="EditBusiness" component={EditBusinessScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
