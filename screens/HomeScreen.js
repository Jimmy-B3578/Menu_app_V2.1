import React, { useState, useEffect } from 'react';
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
import styles from '../styles/HomeScreenStyles'; // Import styles
import { colors } from '../styles/themes'; // For direct color usage if needed

export default function HomeScreen({ navigation }) { // Added navigation prop
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchActive, setSearchActive] = useState(false); // To control search bar position

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchActive(false); // No query, remain centered or revert
      setError(null);
      return;
    }

    Keyboard.dismiss(); // Dismiss keyboard before search
    setIsLoading(true);
    setError(null);
    setSearchActive(true); // Activate search mode, move bar up

    try {
      // const response = await axios.get(`http://localhost:3000/search/pins?q=${searchQuery}`); // FOR LOCAL DEV
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/search/pins?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data || []);
      if (response.data.length === 0) {
        setError('No results found.');
      }
    } catch (err) {
      console.error('Search API error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to fetch results. Please ensure the API is running and the text index is configured if necessary.');
      setSearchResults([]);
    }
    setIsLoading(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setSearchActive(false); // Deactivate search mode, center bar
    Keyboard.dismiss();
  };

  const renderResultItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => {
        // Navigate to BusinessPageScreen with the pin data
        // Assuming businessData expects an object similar to a pin from GET /pins
        // You might need to adjust this based on what BusinessPageScreen expects
        // For now, we pass the whole item, assuming it contains coordinate info etc.
        navigation.navigate('Business', { businessData: item });
      }}
    >
      <Text style={styles.resultItemName}>{item.name}</Text>
      {item.description && <Text style={styles.resultItemDescription}>{item.description}</Text>}
      {item.cuisine && item.cuisine.length > 0 && (
        <Text style={styles.resultItemCuisine}>Cuisine: {item.cuisine.join(', ')}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <View style={[styles.searchAreaContainer, searchActive ? styles.searchAreaTop : styles.searchAreaCenter]}>
        {!searchActive && (
          <Text style={styles.title}>Search Businesses</Text> // Title shown only when search is not active
        )}
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name, description, cuisine..."
          placeholderTextColor="#808080"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch} // Search on keyboard submit
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

      {!isLoading && !error && searchActive && searchResults.length === 0 && searchQuery.trim() !== '' && (
         // This handles the case where search was performed but returned no results, different from initial state
        <Text style={styles.noResultsText}>No businesses found matching "{searchQuery}".</Text>
      )}

      {searchActive && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={renderResultItem}
          keyExtractor={(item) => item._id}
          style={styles.resultsContainer}
          keyboardShouldPersistTaps="handled" // So users can tap results without keyboard issues
        />
      )}
    </SafeAreaView>
  );
} 