import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import styles from '../styles/HomeScreenStyles';
import { colors } from '../styles/themes';
import uuid from 'react-native-uuid';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Function to calculate distance between two coordinates (in kilometers)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
};

// Helper function for calculateDistance
const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

// Format distance for display
const formatDistance = (distance) => {
  if (distance < 1) {
    // Convert to meters for distances less than 1km
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 10) {
    // Show one decimal place for distances between 1-10km
    return `${distance.toFixed(1)}km`;
  } else {
    // Round to nearest km for distances over 10km
    return `${Math.round(distance)}km`;
  }
};

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [processedResults, setProcessedResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

  // Request location permission and get user's location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setLocationPermissionDenied(true);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      } catch (err) {
        console.error('Error getting location:', err);
      }
    })();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchQuery('');
      setProcessedResults([]);
      setError(null);
      if (searchActive) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSearchActive(false);
      }
      Keyboard.dismiss();
      return;
    }

    Keyboard.dismiss();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setSearchActive(true);
    setIsLoading(true);
    setError(null);
    setProcessedResults([]);

    const animationDuration = 300;

    try {
      const animationDelayPromise = new Promise(resolve => setTimeout(resolve, animationDuration));
      
      const fetchDataPromise = axios.get(`${Constants.expoConfig.extra.EXPO_PUBLIC_API_URL}/search/pins?q=${encodeURIComponent(searchQuery)}`);

      const [_, response] = await Promise.all([animationDelayPromise, fetchDataPromise]);

      const pins = response.data || [];
      const groupedResults = {};
      const queryRegex = new RegExp(searchQuery.trim().replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i');

      pins.forEach(pin => {
        // Calculate distance if user location is available and pin has coordinates
        let distance = null;
        if (userLocation && pin.location?.coordinates?.length === 2) {
          const pinLat = pin.location.coordinates[1]; // GeoJSON format: [longitude, latitude]
          const pinLng = pin.location.coordinates[0];
          distance = calculateDistance(
            userLocation.latitude, 
            userLocation.longitude, 
            pinLat, 
            pinLng
          );
        }

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
              distance: distance, // Add distance to the group
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
              distance: distance, // Add distance to the group
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
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setProcessedResults([]);
    setError(null);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchActive(false);
    Keyboard.dismiss();
  };

  const renderResultItem = ({ item }) => {
    if (item.type === 'restaurantGroup') {
      return (
        <View style={styles.restaurantGroupContainer}>
          <View style={styles.restaurantNameHeaderContainer}>
            <View style={styles.restaurantNameInfoContainer}>
              <Text style={styles.restaurantNameHeaderText}>{item.pinName}</Text>
              {item.distance !== null && (
                <Text style={styles.distanceText}>Distance: {formatDistance(item.distance)}</Text>
              )}
            </View>
            {item.originalPin?.location?.coordinates && (
              <TouchableOpacity
                style={styles.viewOnMapButton}
                onPress={() => {
                  navigation.navigate('Map', { 
                    targetPinId: item.originalPin._id,
                    targetCoordinates: item.originalPin.location.coordinates, 
                    fromSearch: true 
                  });
                }}
              >
                <Text style={styles.viewOnMapButtonText}>View on Map</Text>
              </TouchableOpacity>
            )}
          </View>
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
                  // Determine the target tab name for UnifiedMenuScreen
                  const targetInitialRoute = menuItem.menuName === 'Food Menu' ? 'Food' : 'Drinks';
                  
                  navigation.navigate('UnifiedMenu', {
                    businessId: item.originalPin._id,
                    businessName: item.originalPin.name,
                    pinCreatorId: item.originalPin.createdBy,
                    selectedItem: { // Pass the item details for highlighting
                      name: menuItem.itemName,
                      description: menuItem.itemDescription,
                      // price: menuItem.itemPrice // You might want to pass price if Food/DrinksMenuScreen use it for highlighting
                    },
                    initialRouteName: targetInitialRoute // Tell UnifiedMenuScreen which tab to open
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
        <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchBar}
          placeholder="Search by name, description, cuisine, items..."
          placeholderTextColor="#808080"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
              <Ionicons name="close-circle" size={24} color="#808080" />
            </TouchableOpacity>
          )}
        </View>
        {searchActive ? (
          !isLoading && processedResults.length === 0 && (
            <View style={styles.searchButtonContainer}>
              <TouchableOpacity style={[styles.searchButton, {backgroundColor: colors.primary, flex: 1}]} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
          )
        ) : (
          <TouchableOpacity style={[styles.searchButton, styles.singleSearchButton]} onPress={handleSearch}>
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