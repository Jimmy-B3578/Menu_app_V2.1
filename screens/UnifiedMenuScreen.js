import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FoodMenuScreen from './FoodMenuScreen';
import DrinksMenuScreen from './DrinksMenuScreen';
import { colors } from '../styles/themes'; // Assuming you have a theme file
import { useTheme } from '../context/UserContext';
import { styles } from '../styles/UnifiedMenuScreenStyles';

const Tab = createMaterialTopTabNavigator();

export default function UnifiedMenuScreen({ route, navigation }) {
  const { theme } = useTheme();
  const {
    businessId,
    businessName,
    pinCreatorId,
    selectedItem, // This will be passed to the specific menu screen
    initialRouteName, // Determines which tab to open first, e.g., 'Food' or 'Drinks'
  } = route.params;

  // Set the header title dynamically
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: businessName ? `${businessName} - Menu` : 'Menu',
      headerStyle: { backgroundColor: theme.surface },
      headerTintColor: theme.text.main,
      headerTitleStyle: { color: theme.text.main },
    });
  }, [navigation, businessName, theme]);

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName || 'Food'} // Default to Food tab if not specified
      screenOptions={{
        tabBarActiveTintColor: theme.text.main,
        tabBarInactiveTintColor: theme.text.main,
        tabBarIndicatorStyle: { backgroundColor: theme.primary },
        tabBarStyle: { backgroundColor: theme.surface },
        tabBarLabelStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen
        name="Food"
        component={FoodMenuScreen}
        initialParams={{ businessId, businessName, pinCreatorId, selectedItem: initialRouteName === 'Food' ? selectedItem : undefined }}
        options={{ title: 'Food Menu' }}
      />
      <Tab.Screen
        name="Drinks"
        component={DrinksMenuScreen}
        initialParams={{ businessId, businessName, pinCreatorId, selectedItem: initialRouteName === 'Drinks' ? selectedItem : undefined }}
        options={{ title: 'Drinks Menu' }}
      />
    </Tab.Navigator>
  );
} 