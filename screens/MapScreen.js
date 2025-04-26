import React, { useState, useEffect, useRef } from 'react';
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

export default function MapScreen({ user }) {
  const [initialRegion, setInitialRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // --- Restore marker/modal state ---
  const [markers, setMarkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarkerCoord, setNewMarkerCoord] = useState(null);
  const [locationName, setLocationName] = useState('');
  // ------------------------------------

  // --- Add MapView Ref ---
  const mapRef = useRef(null);
  // -----------------------

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

  const handleCreatePin = () => {
    if (newMarkerCoord && locationName.trim()) {
      const newMarker = {
        id: Date.now(),
        coordinate: newMarkerCoord,
        title: locationName.trim(),
      };
      setMarkers(prevMarkers => [...prevMarkers, newMarker]);
      handleCancel();
    } else {
      alert('Please enter a location name.');
    }
  };
  // ---------------

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

  let mapContent = <Text>Loading map...</Text>; // Placeholder while loading

  if (errorMsg) {
    mapContent = <Text>{errorMsg}</Text>; // Show error message
  }

  // Only render MapView when we have an initialRegion
  if (initialRegion) {
    mapContent = (
      <MapView
        ref={mapRef} // <<< Add ref
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion} // Set the initial region
        showsUserLocation={true} // Optionally show the blue dot for user location
        showsMyLocationButton={false} // <<< Turn off native button
        onLongPress={user && user.role === 'business' ? handleLongPress : undefined}
      >
        {/* Restore marker rendering */}
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

      {/* --- Custom Recenter Button --- */}
      {initialRegion && ( // Only show if map is loaded
        <Pressable style={styles.recenterButton} onPress={handleRecenter}>
          {/* You can use an icon here instead of text */}
          <Text style={styles.recenterButtonText}>⌖</Text>
        </Pressable>
      )}
      {/* --------------------------- */}

      {/* --- Restore Modal --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>X</Text>
            </Pressable>
            <Text style={styles.modalText}>Enter Location Name:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setLocationName}
              value={locationName}
              placeholder="e.g., Home, Favorite Cafe"
              placeholderTextColor="#808080"
            />
            <Pressable
              style={({ pressed }) => [
                styles.createButton,
                !locationName.trim() ? styles.createButtonDisabled : {},
                pressed ? { opacity: 0.7 } : {}
              ]}
              onPress={handleCreatePin}
              disabled={!locationName.trim()}
            >
              <Text style={styles.createButtonText}>Create Location</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* -------------------- */}
    </View>
  );
} 