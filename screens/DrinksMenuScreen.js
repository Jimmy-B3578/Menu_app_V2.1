import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/DrinksMenuScreenStyles'; // Assuming styles will be created

export default function DrinksMenuScreen({ route, navigation }) {
  // Get business ID passed from the map screen
  const { businessId, businessName } = route.params || {};

  // TODO: Fetch menu data based on businessId
  const menuItems = []; // Placeholder for fetched data

  return (
    <View style={styles.container}>
      {/* Removed title and business name - header handled by navigator */}
      {menuItems.length === 0 ? (
        <Text style={styles.placeholderText}>No menu items available.</Text>
      ) : (
        // TODO: Render actual menu list here
        <Text>Menu List Placeholder</Text>
      )}
    </View>
  );
} 