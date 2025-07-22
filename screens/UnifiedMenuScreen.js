import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FoodMenuScreen from './FoodMenuScreen';
import DrinksMenuScreen from './DrinksMenuScreen';
import { colors } from '../styles/themes'; // Assuming you have a theme file
import { styles } from '../styles/UnifiedMenuScreenStyles';

const Tab = createMaterialTopTabNavigator();

export default function UnifiedMenuScreen({ route, navigation }) {
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
      headerStyle: styles.headerStyle,
      headerTintColor: styles.headerTintColor.color,
      headerTitleStyle: styles.headerTitleStyle,
    });
  }, [navigation, businessName]);

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName || 'Food'} // Default to Food tab if not specified
      screenOptions={{
        tabBarActiveTintColor: styles.tabBarActiveTintColor.color,
        tabBarInactiveTintColor: styles.tabBarInactiveTintColor.color,
        tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
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