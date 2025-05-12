import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  SafeAreaView
} from 'react-native';
import axios from 'axios';
import styles from '../styles/HomeScreenStyles';
import { colors } from '../styles/themes';
import uuid from 'react-native-uuid';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [processedResults, setProcessedResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchActive, setSearchActive] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setProcessedResults([]);
      setSearchActive(false);
      setError(null);
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setError(null);
    setSearchActive(true);

    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/search/pins?q=${encodeURIComponent(searchQuery)}`);
      const pins = response.data || [];
      const groupedResults = {};
      const queryRegex = new RegExp(searchQuery.trim().replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i');

      pins.forEach(pin => {
        let pinLevelMatch = false;
        if (queryRegex.test(pin.name) || queryRegex.test(pin.description) || (pin.cuisine && pin.cuisine.some(c => queryRegex.test(c)))) {
          pinLevelMatch = true;
        }

        let itemMatchFoundInPin = false;
        const addItemToGroup = (item, menuType) => {
          if (!groupedResults[pin.name]) {
            groupedResults[pin.name] = {
              id: pin._id || uuid.v4(),
              type: 'restaurantGroup',
              pinName: pin.name,
              originalPin: pin,
              items: []
            };
          }
          groupedResults[pin.name].items.push({
            id: uuid.v4(),
            type: 'menuItem',
            menuName: menuType,
            itemName: item.name,
            itemPrice: item.price,
            itemDescription: item.description,
          });
          itemMatchFoundInPin = true;
        };

        (pin.foodMenu || []).forEach(item => {
          if (item.type === 'item' && (queryRegex.test(item.name) || queryRegex.test(item.description))) {
            addItemToGroup(item, 'Food Menu');
          }
        });

        (pin.drinksMenu || []).forEach(item => {
          if (item.type === 'item' && (queryRegex.test(item.name) || queryRegex.test(item.description))) {
            addItemToGroup(item, 'Drinks Menu');
          }
        });

        if (pinLevelMatch && !itemMatchFoundInPin) {
          if (!groupedResults[pin.name]) {
            groupedResults[pin.name] = {
              id: pin._id || uuid.v4(),
              type: 'restaurantGroup',
              pinName: pin.name,
              originalPin: pin,
              items: [{
                id: uuid.v4(),
                type: 'pinDetails',
                pinDescription: pin.description,
                pinCuisine: pin.cuisine
              }]
            };
          }
        }
      });

      const newProcessedResults = Object.values(groupedResults);

      setProcessedResults(newProcessedResults);
      if (newProcessedResults.length === 0) {
        setError('No relevant items or businesses found.');
      }

    } catch (err) {
      console.error('Search API error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to fetch results.');
      setProcessedResults([]);
    }
    setIsLoading(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setProcessedResults([]);
    setError(null);
    setSearchActive(false);
    Keyboard.dismiss();
  };

  const renderResultItem = ({ item }) => {
    if (item.type === 'restaurantGroup') {
      return (
        <View style={styles.restaurantGroupContainer}>
          <Text style={styles.restaurantNameHeader}>{item.pinName}</Text>
          {item.items.map(menuItem => {
            if (menuItem.type === 'pinDetails') {
              return (
                <TouchableOpacity
                  key={menuItem.id}
                  style={styles.resultItem}
                  onPress={() => navigation.navigate('Business', { businessData: item.originalPin })}
                >
                  <Text style={styles.resultItemName}>{item.pinName} (Details)</Text>
                  {menuItem.pinDescription && <Text style={styles.resultItemDescription}>{menuItem.pinDescription}</Text>}
                  {menuItem.pinCuisine && menuItem.pinCuisine.length > 0 && (
                    <Text style={styles.resultItemCuisine}>Cuisine: {menuItem.pinCuisine.join(', ')}</Text>
                  )}
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={menuItem.id}
                style={styles.menuItemContainer}
                onPress={() => {
                  const menuScreen = menuItem.menuName === 'Food Menu' ? 'FoodMenu' : 'DrinksMenu';
                  navigation.navigate(menuScreen, {
                    businessId: item.originalPin._id,
                    businessName: item.originalPin.name,
                    pinCreatorId: item.originalPin.createdBy,
                    selectedItem: {
                      name: menuItem.itemName,
                      description: menuItem.itemDescription,
                    }
                  });
                }}
              >
                <View style={styles.menuItemHeader}>
                  <Text style={styles.menuItemName}>{menuItem.itemName}</Text>
                  {menuItem.itemPrice !== undefined && (
                    <Text style={styles.menuItemPrice}>{`$${parseFloat(menuItem.itemPrice).toFixed(2)}`}</Text>
                  )}
                </View>
                {menuItem.itemDescription && <Text style={styles.menuItemDescription}>{menuItem.itemDescription}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <View style={[styles.searchAreaContainer, searchActive ? styles.searchAreaTop : styles.searchAreaCenter]}>
        {!searchActive && (
          <Text style={styles.title}>Search Businesses & Items</Text>
        )}
      <TextInput
        style={styles.searchBar}
          placeholder="Search by name, description, cuisine, items..."
          placeholderTextColor="#808080"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchActive ? (
          <View style={styles.searchButtonContainer}>
            <TouchableOpacity style={[styles.searchButton, {backgroundColor: colors.primary, flex: 1, marginRight: 5}]} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.searchButton, {backgroundColor: colors.secondary || '#6c757d', flex: 1, marginLeft: 5}]} onPress={clearSearch}>
              <Text style={styles.searchButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
    </View>
      )}

      {!isLoading && error && searchActive && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!isLoading && !error && searchActive && processedResults.length === 0 && searchQuery.trim() !== '' && (
        <Text style={styles.noResultsText}>No relevant items or businesses found for "{searchQuery}".</Text>
      )}

      {searchActive && processedResults.length > 0 && (
        <FlatList
          data={processedResults}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id}
          style={styles.resultsContainer}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
} 