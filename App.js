import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SecureStore from 'expo-secure-store';

// Import screens
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import BusinessPageScreen from './screens/BusinessPageScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const USER_STORAGE_KEY = 'user_data';

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
    <NavigationContainer>
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
    </NavigationContainer>
  );
}
