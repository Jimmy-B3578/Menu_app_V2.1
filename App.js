import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import { UserProvider } from './context/UserContext';

// Import screens
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import BusinessPageScreen from './screens/BusinessPageScreen';
import ProfileScreen from './screens/ProfileScreen';
import FoodMenuScreen from './screens/FoodMenuScreen';
import DrinksMenuScreen from './screens/DrinksMenuScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const USER_STORAGE_KEY = 'user_data';

function TabNavigator({ user, setUser }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
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
          <Stack.Screen name="FoodMenu" component={FoodMenuScreen} options={{ title: 'Food Menu' }} />
          <Stack.Screen name="DrinksMenu" component={DrinksMenuScreen} options={{ title: 'Drinks Menu' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
