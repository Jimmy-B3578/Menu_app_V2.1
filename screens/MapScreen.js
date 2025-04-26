import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native'; // Remove Text, keep StyleSheet if needed later
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  Button,
  Pressable, // For the 'X' button
} from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker
import * as Location from 'expo-location'; // Import expo-location
import styles from '../styles/MapScreenStyles';

export default function MapScreen() {
  // State to hold the initial region, location, and error messages
  const [initialRegion, setInitialRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // --- State for Markers and Modal ---
  const [markers, setMarkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarkerCoord, setNewMarkerCoord] = useState(null);
  const [locationName, setLocationName] = useState('');
  // ------------------------------------

  useEffect(() => {
    (async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        // Optionally set a default initial region if permission denied
        setInitialRegion({
          latitude: 37.78825, // Default latitude (e.g., San Francisco)
          longitude: -122.4324, // Default longitude
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        return;
      }

      // Get the current location
      try {
        let location = await Location.getCurrentPositionAsync({});
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01, // Zoom level - smaller delta means more zoomed in
          longitudeDelta: 0.01,
        });
      } catch (error) {
        setErrorMsg('Could not fetch location');
        // Optionally set a default region on error too
        setInitialRegion({
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Handlers --- 
  const handleLongPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setNewMarkerCoord(coordinate); // Store coords for potential marker
    setLocationName(''); // Clear previous name
    setModalVisible(true); // Show modal
  };

  const handleCancel = () => {
    setModalVisible(false);
    setNewMarkerCoord(null);
    setLocationName('');
  };

  const handleCreatePin = () => {
    if (newMarkerCoord && locationName.trim()) {
      const newMarker = {
        id: Date.now(), // Simple unique ID
        coordinate: newMarkerCoord,
        title: locationName.trim(),
      };
      setMarkers(prevMarkers => [...prevMarkers, newMarker]);
      handleCancel(); // Close modal and reset state
    } else {
      // Optional: Add alert if name is empty
      alert('Please enter a location name.');
    }
  };
  // ---------------

  let mapContent = <Text>Loading map...</Text>; // Placeholder while loading

  if (errorMsg) {
    mapContent = <Text>{errorMsg}</Text>; // Show error message
  }

  // Only render MapView when we have an initialRegion
  if (initialRegion) {
    mapContent = (
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion} // Set the initial region
        showsUserLocation={true} // Optionally show the blue dot for user location
        showsMyLocationButton={true}
        onLongPress={handleLongPress} // <<< Add long press handler
      >
        {/* Render existing markers */}
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
          />
        ))}
      </MapView>
    );
  }

  return (
    <View style={styles.container}>
      {mapContent}
      {/* 
          You can add initialRegion or other props later 
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
      */}

      {/* --- Add Pin Modal --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel} // Handle back button on Android
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            {/* Cancel Button (Top Right 'X') */}
            <Pressable style={modalStyles.cancelButton} onPress={handleCancel}>
              <Text style={modalStyles.cancelButtonText}>X</Text>
            </Pressable>

            <Text style={modalStyles.modalText}>Enter Location Name:</Text>
            <TextInput
              style={modalStyles.input}
              onChangeText={setLocationName}
              value={locationName}
              placeholder="e.g., Home, Favorite Cafe"
            />
            <Button
              title="Create Location"
              onPress={handleCreatePin}
              disabled={!locationName.trim()} // Disable if name is empty
            />
          </View>
        </View>
      </Modal>
      {/* -------------------- */}
    </View>
  );
}

// --- Styles for the Modal --- (Consider moving to MapScreenStyles.js)
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    position: 'relative', // Needed for absolute positioning of cancel button
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
  },
  cancelButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
}); 