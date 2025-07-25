import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { View, Text, StyleSheet } from 'react-native'; // Remove Text, keep StyleSheet if needed later
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  Button,
  Pressable, // For the 'X' button
  ActivityIndicator, // <<< Import ActivityIndicator
  Dimensions // <<< Import Dimensions
} from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker
import * as Location from 'expo-location'; // Import expo-location
import axios from 'axios'; // <<< Make sure axios is imported
import Constants from 'expo-constants';
import styles from '../styles/MapScreenStyles';
import { colors } from '../styles/themes'; // <<< Import colors
import { useTheme } from '../context/UserContext';

const { height: screenHeight } = Dimensions.get('window'); // Get screen height

export default function MapScreen({ route, user, navigation }) {
  const { theme } = useTheme();
  const [initialRegion, setInitialRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // --- Restore marker/modal state ---
  const [markers, setMarkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarkerCoord, setNewMarkerCoord] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [pinsInitiallyLoaded, setPinsInitiallyLoaded] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true); // <<< Add map loading state
  // ------------------------------------

  // --- Add State for Selected Marker and Context Box ---
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [contextBoxHeight, setContextBoxHeight] = useState(180); // Initial height (e.g., 30% of screen)
  // ---------------------------------------------------

  // --- Add MapView Ref ---
  const mapRef = useRef(null);
  // -----------------------

  // --- Fetch existing pins --- 
  const fetchPins = useCallback(async () => {
    try {
      const response = await axios.get(`${Constants.expoConfig.extra.EXPO_PUBLIC_API_URL}/pins`);
      const fetchedMarkers = response.data.map(pin => ({
        id: pin._id,
        coordinate: { latitude: pin.location.coordinates[1], longitude: pin.location.coordinates[0] },
        title: pin.name,
        createdBy: pin.createdBy,
      }));
      setMarkers(fetchedMarkers);
      setPinsInitiallyLoaded(true);
    } catch (error) {
      console.error('Error fetching pins:', error.response ? error.response.data : error.message);
      setPinsInitiallyLoaded(true); 
    }
  }, []);

  // --- Separate useEffect for fetching pins AND setting loading state ---
  useEffect(() => {
    // Check for refresh flag from navigation params
    if (route?.params?.refresh) {
      console.log('[MapScreen] Refresh true, fetching pins.');
      fetchPins();
      // Clear the refresh flag to prevent re-fetching on subsequent renders
      navigation.setParams({ refresh: undefined });
    }
    // If not a refresh from delete, then do initial fetch (if it wasn't done by refresh)
    // This condition ensures fetchPins() is called once on initial mount if not refreshing.
    else if (!pinsInitiallyLoaded && !route?.params?.refresh) { 
    fetchPins();
    }

    // Check for clearSelection flag
    if (route?.params?.clearSelection) {
      console.log('[MapScreen] clearSelection true, clearing selected marker.');
      setSelectedMarker(null);
      navigation.setParams({ clearSelection: undefined });
    }

    // Set a timeout to hide loading indicator after 0.5 seconds
    // This might need adjustment if fetchPins itself indicates loading
    const timer = setTimeout(() => {
      setIsMapLoading(false);
    }, 500); // 500 milliseconds

    // Clear the timer if the component unmounts before it fires
    return () => clearTimeout(timer);

  }, [fetchPins, route?.params?.refresh, route?.params?.clearSelection, navigation, pinsInitiallyLoaded]); // Added clearSelection and pinsInitiallyLoaded

  // --- Initial load effect FOR LOCATION ONLY ---
  useEffect(() => {
    let isMounted = true;

    const loadMapData = async () => {
      // console.log('### MapScreen Location useEffect running ###');
      // --- Location fetching logic (unchanged) ---
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!isMounted) return;
        setErrorMsg('Permission to access location was denied');
        setInitialRegion({ /* fallback */ });
        // --- REMOVE fetchPins call from here ---
        // console.log('### Location denied, calling fetchPins ###');
        // fetchPins(); 
        // ----------------------------------------
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({});
        if (!isMounted) return;
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        // --- REMOVE fetchPins call from here ---
        // console.log('### Location fetched, calling fetchPins ###');
        // fetchPins();
        // ----------------------------------------
      } catch (error) {
        if (!isMounted) return;
        setErrorMsg('Could not fetch location');
        setInitialRegion({ /* fallback */ });
        // --- REMOVE fetchPins call from here ---
        // console.log('### Location error, calling fetchPins ###');
        // fetchPins();
        // ----------------------------------------
      }
      // -----------------------------------------
    };

    loadMapData();

    return () => { isMounted = false; };

  // }, [user, fetchPins]); // Old dependencies
  // }, [fetchPins]); // Old dependency
  }, []); // <<< EMPTY dependency array for location effect
  // ---------------------------------------------------

  // --- Effect to handle navigation from HomeScreen search results ---
  useEffect(() => {
    const { targetPinId, targetCoordinates, fromSearch } = route.params || {};

    if (fromSearch && targetPinId && targetCoordinates && markers.length > 0) {
      const coordsArray = targetCoordinates; // Assuming it's [longitude, latitude]
      const targetLat = parseFloat(coordsArray[1]);
      const targetLng = parseFloat(coordsArray[0]);

      if (!isNaN(targetLat) && !isNaN(targetLng)) {
        const region = {
          latitude: targetLat,
          longitude: targetLng,
          latitudeDelta: 0.005, // Zoom in a bit closer
          longitudeDelta: 0.005,
        };
        mapRef.current?.animateToRegion(region, 1000);

        const foundMarker = markers.find(marker => marker.id === targetPinId);
        if (foundMarker) {
          // Delay marker selection slightly to allow map animation to start
          setTimeout(() => {
            handleMarkerPress(foundMarker);
          }, 500); // Adjust delay as needed
        }
      } else {
        console.warn('Invalid targetCoordinates received:', targetCoordinates);
      }
      
      // Important: Clear the params so this doesn't re-run on subsequent focuses of the MapScreen
      // unless explicitly navigated with these params again.
      // navigation.setParams({ targetPinId: undefined, targetCoordinates: undefined, fromSearch: undefined }); 
      // ^ Let's defer clearing `fromSearch` until the custom back button is pressed, so it remains visible.
      navigation.setParams({ targetPinId: undefined, targetCoordinates: undefined });
    }
  }, [route.params, markers, navigation]); // Rerun if route.params or markers change

  // --- Restore handlers ---
  const handleLongPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setNewMarkerCoord(coordinate);
    setLocationName('');
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setNewMarkerCoord(null);
    setLocationName('');
  };

  // --- Modify handleCreatePin to use API ---
  const handleCreatePin = async () => { // Make async
    if (!newMarkerCoord || !locationName.trim() || !user?._id) {
      alert('Missing data to create pin or user not logged in.');
      return;
    }

    const pinData = {
      name: locationName.trim(),
      latitude: newMarkerCoord.latitude,
      longitude: newMarkerCoord.longitude,
      userId: user._id, // Pass the logged-in user's ID
    };

    try {
      const response = await axios.post(`${Constants.expoConfig.extra.EXPO_PUBLIC_API_URL}/pins`, pinData);
      const createdPin = response.data;

      // Map backend data to frontend marker format
      const newMarker = {
        id: createdPin._id,
        coordinate: {
          latitude: createdPin.location.coordinates[1],
          longitude: createdPin.location.coordinates[0],
        },
        title: createdPin.name,
        createdBy: createdPin.createdBy,
      };

      setMarkers(prevMarkers => [...prevMarkers, newMarker]);
      handleCancel(); // Close modal and reset state
    } catch (error) {
      console.error('Error creating pin via API:', error.response ? error.response.data : error.message);
      alert('Failed to create pin. Please try again.');
      // Optionally: Keep modal open? handleCancel(); 
    }
  };
  // ----------------------------------------

  // --- Add Marker Press Handler ---
  const handleMarkerPress = (marker) => {
    // Reset state first to ensure re-render of context box
    setSelectedMarker(null); 
    
    // Use setTimeout to allow the null state to render before setting the new marker
    setTimeout(() => {
        setSelectedMarker(marker);
        // Optionally animate map to center the marker slightly above the context box
        if (mapRef.current && marker?.coordinate) {
            mapRef.current.animateToRegion({
                ...marker.coordinate,
                latitudeDelta: initialRegion?.latitudeDelta || 0.01,
                longitudeDelta: initialRegion?.longitudeDelta || 0.01,
            }, 300); // Animation duration 300ms
        }
    }, 0); // Delay of 0ms often works, adjust slightly if needed (e.g., 10)
  };
  // ------------------------------

  // --- Add Context Box Dismiss Handler ---
  const handleMapPress = () => {
    if (selectedMarker) {
      setSelectedMarker(null); // Hide context box when map is pressed
    }
  };
  // ------------------------------------

  // --- Recenter Handler ---
  const handleRecenter = async () => {
    // Re-check permissions (optional but good practice)
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Location permission is needed to recenter.');
      return;
    }
    try {
      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const userRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        // Use deltas from initialRegion or define new ones for zoom level
        latitudeDelta: initialRegion?.latitudeDelta || 0.01,
        longitudeDelta: initialRegion?.longitudeDelta || 0.01,
      };
      // Animate map to the user's location
      mapRef.current?.animateToRegion(userRegion, 1000); // Animate over 1 second
    } catch (error) {
      console.error("Error recentering:", error);
      alert('Could not get current location to recenter.');
    }
  };
  // ---------------------

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* --- Conditional Rendering Logic --- */}
      {isMapLoading ? (
        // Show loading indicator while timer is active
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}> 
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : errorMsg ? (
        // Show error message if location failed
        <View style={[styles.centeredMessageContainer, { backgroundColor: theme.background }]}> 
          <Text style={{ color: theme.text.main }}>{errorMsg}</Text>
        </View>
      ) : initialRegion ? (
        // Show map view if region is ready
                <MapView
          ref={mapRef}
          key={pinsInitiallyLoaded ? 'pins-loaded' : 'pins-loading'}
          style={styles.absoluteFill}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          userInterfaceStyle={theme.map.darkMode ? "dark" : "light"}
          onLongPress={user && user.role === 'business' ? handleLongPress : undefined}
          onPress={handleMapPress} // <<< Add map press handler
        >
          {markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              onPress={() => handleMarkerPress(marker)} // <<< Add marker press handler
            />
          ))}
        </MapView>
      ) : (
        // Fallback: Still loading region/permissions (show indicator or nothing)
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}
      {/* ----------------------------------- */}
      
      {/* --- Custom Back to Search Button --- */}
      {route.params?.fromSearch && (
        <Pressable 
          style={styles.backToSearchButton} 
          onPress={() => {
            setSelectedMarker(null); // Deselect the marker
            navigation.setParams({ fromSearch: undefined, targetPinId: undefined, targetCoordinates: undefined }); // Clear all relevant params
            navigation.navigate('Home');
          }}
        >
          <Text style={styles.backToSearchButtonText}>← Back to Search Results</Text>
        </Pressable>
      )}
      
      {/* --- Buttons and Modal (Rendered separately, potentially overlaying) --- */}
      {/* Custom Recenter Button - Conditionally render based on map readiness */}
      {!isMapLoading && initialRegion && (
        <Pressable style={styles.recenterButton} onPress={handleRecenter}>
          <Text style={styles.recenterButtonText}>⌖</Text>
        </Pressable>
      )}

      {/* --- Context Box --- */}
      {selectedMarker && (
        <View style={[styles.contextBox, { height: contextBoxHeight, backgroundColor: theme.background, shadowColor: theme.card.shadow }]}>
          <Text style={[styles.contextBoxTitle, { color: theme.text.main }]}>{selectedMarker.title}</Text>
          <Pressable 
            style={[styles.contextButtonFull, { backgroundColor: theme.primary }]} 
            onPress={() => {
                if (selectedMarker) {
                    navigation.navigate('Business', { businessData: selectedMarker });
                }
            }}
          >
            <Text style={[styles.contextButtonText, { color: theme.button.text }]}>View Business Page</Text>
          </Pressable>
          {/* Single Menu Button */}
            <Pressable 
            style={[styles.contextButtonFull, { backgroundColor: theme.primary }]} // Use full width style for the single menu button
              onPress={() => {
                if (selectedMarker) {
                navigation.navigate('UnifiedMenu', { 
                    businessId: selectedMarker.id, 
                    businessName: selectedMarker.title, 
                    pinCreatorId: selectedMarker.createdBy 
                  // No selectedItem or initialRouteName needed here for general menu access
                  });
                }
              }}
            >
            <Text style={[styles.contextButtonText, { color: theme.button.text }]}>View Menu</Text>
            </Pressable>
          {/* Add a drag handle or other controls to adjust height later if needed */}
        </View>
      )}
      {/* ----------------- */}

      {/* Modal - Renders based on its own visible state */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={[styles.centeredView, { backgroundColor: theme.modal.overlay }]}>
          <View style={[styles.modalView, { backgroundColor: theme.background, shadowColor: theme.card.shadow }]}>
            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Text style={[styles.cancelButtonText, { color: theme.text.subtext }]}>X</Text>
            </Pressable>
            <Text style={[styles.modalText, { color: theme.text.main }]}>Enter Location Name:</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, borderColor: theme.input.border, color: theme.text.main }]}
              onChangeText={setLocationName}
              value={locationName}
              placeholder="e.g., Home, Favorite Cafe"
              placeholderTextColor={theme.input.placeholder}
            />
            <Pressable
              style={({ pressed }) => [
                styles.createButton,
                { backgroundColor: theme.primary },
                !locationName.trim() && { backgroundColor: theme.button.disabled },
                pressed && styles.createButtonPressed
              ]}
              onPress={handleCreatePin}
              disabled={!locationName.trim()}
            >
              <Text style={[styles.createButtonText, { color: theme.button.text }]}>Create Location</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* ----------------------------------------------------------------------- */}
    </View>
  );
}

// Add styles for centeredMessageContainer if needed:
// centeredMessageContainer: {
//   flex: 1,
//   justifyContent: 'center',
//   alignItems: 'center',
//   padding: 20,
// }, 