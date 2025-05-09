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
      const newProcessedResults = [];
      const queryRegex = new RegExp(searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

      pins.forEach(pin => {
        let pinLevelMatch = false;
        if (queryRegex.test(pin.name) || queryRegex.test(pin.description) || (pin.cuisine && pin.cuisine.some(c => queryRegex.test(c)))) {
          pinLevelMatch = true;
        }

        let itemMatchFoundInPin = false;
        (pin.foodMenu || []).forEach(item => {
          if (item.type === 'item' && (queryRegex.test(item.name) || queryRegex.test(item.description))) {
            newProcessedResults.push({
              id: uuid.v4(),
              type: 'menuItem',
              menuName: 'Food Menu',
              pinName: pin.name,
              itemName: item.name,
              itemDescription: item.description,
              originalPin: pin
            });
            itemMatchFoundInPin = true;
          }
        });

        (pin.drinksMenu || []).forEach(item => {
          if (item.type === 'item' && (queryRegex.test(item.name) || queryRegex.test(item.description))) {
            newProcessedResults.push({
              id: uuid.v4(),
              type: 'menuItem',
              menuName: 'Drinks Menu',
              pinName: pin.name,
              itemName: item.name,
              itemDescription: item.description,
              originalPin: pin
            });
            itemMatchFoundInPin = true;
          }
        });

        if (pinLevelMatch && !itemMatchFoundInPin) {
          newProcessedResults.push({
            id: uuid.v4(),
            type: 'pinMatch',
            pin: pin
          });
        }
      });

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
    if (item.type === 'menuItem') {
      return (
        <TouchableOpacity
          style={styles.resultItem}
          onPress={() => navigation.navigate('Business', { businessData: item.originalPin })}
        >
          <Text style={styles.resultItemPinName}>{item.pinName}</Text>
          <Text style={styles.resultItemMenuContext}>Found in {item.menuName}:</Text>
          <Text style={styles.resultItemName}>{item.itemName}</Text>
          {item.itemDescription && <Text style={styles.resultItemDescription}>{item.itemDescription}</Text>}
        </TouchableOpacity>
      );
    }

    if (item.type === 'pinMatch') {
      return (
        <TouchableOpacity
          style={styles.resultItem}
          onPress={() => navigation.navigate('Business', { businessData: item.pin })}
        >
          <Text style={styles.resultItemName}>{item.pin.name}</Text>
          {item.pin.description && <Text style={styles.resultItemDescription}>{item.pin.description}</Text>}
          {item.pin.cuisine && item.pin.cuisine.length > 0 && (
            <Text style={styles.resultItemCuisine}>Cuisine: {item.pin.cuisine.join(', ')}</Text>
          )}
        </TouchableOpacity>
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '90%' }}>
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