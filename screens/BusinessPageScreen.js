import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Share,
  Alert
} from 'react-native';
import { styles } from '../styles/BusinessPageScreenStyles.js';
import { colors } from '../styles/themes';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

export default function BusinessPageScreen({ route, navigation }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [openedFromMap, setOpenedFromMap] = useState(false);
  const currentUser = useUser();

  useEffect(() => {
    if (selectedBusiness === null) {
      const fetchBusinesses = async () => {
        try {
          setLoading(true);
          setError(null);
          const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/pins`;
          const response = await axios.get(apiUrl);
          const pins = response.data;
          setBusinesses(pins || []);
        } catch (err) {
          console.error("Failed to fetch businesses:", err.response ? err.response.data : err.message);
          setError('Could not load businesses. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchBusinesses();
    }
  }, [selectedBusiness]);

  useEffect(() => {
    if (route.params?.businessData) {
      console.log("Processing businessData from route params:", route.params.businessData);
      handleSelectBusiness(route.params.businessData, true);
    }
  }, [route.params?.businessData]);

  useEffect(() => {
    if (route.params?.resetView) {
      console.log("Resetting view due to tab press signal.");
      setSelectedBusiness(null);
      navigation.setParams({ resetView: undefined });
    }
  }, [route.params?.resetView, navigation]);

  const handleSelectBusiness = (business, fromMap = false) => {
    const details = {
      id: business._id || business.id || '',
      name: business.name || business.title || 'Business Name',
      description: business.description || 'A cozy place to enjoy coffee and pastries with friends and family.',
      address: business.address || '123 Coffee Street, Melbourne',
      phone: business.phone || '+61 3 1234 5678',
      website: business.website || 'https://example.com',
      coordinate: business.coordinate || (business.location?.coordinates ? { latitude: business.location.coordinates[1], longitude: business.location.coordinates[0] } : null),
      creatorId: typeof business.createdBy === 'object' ? business.createdBy?._id : business.createdBy,
      hours: business.hours || [
        { day: 'Monday - Friday', hours: '7:00 AM - 6:00 PM' },
        { day: 'Saturday', hours: '8:00 AM - 5:00 PM' },
        { day: 'Sunday', hours: '9:00 AM - 4:00 PM' }
      ],
      rating: business.rating || 4.5,
      reviewCount: business.reviewCount || 123,
      photos: business.photos || [],
      amenities: business.amenities || ['Wi-Fi', 'Power Outlets', 'Outdoor Seating', 'Wheelchair Accessible'],
      reviews: business.reviews || [
        { author: 'John D.', rating: 5, text: 'Great coffee and atmosphere!' },
        { author: 'Sarah M.', rating: 4, text: 'Love the pastries here. Good service too.' },
        { author: 'Mike T.', rating: 4, text: 'Nice place to work from with good Wi-Fi.' }
      ]
    };
    setOpenedFromMap(fromMap);
    setSelectedBusiness(details);
    console.log("Selected Business with creatorId:", details.creatorId);
    console.log("Current User ID:", currentUser?._id);
  };

  const handleShare = async () => {
    if (!selectedBusiness) return;
    try {
      await Share.share({
        message: `Check out ${selectedBusiness.name}!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', error.message || 'Could not share this business.');
    }
  };

  const handleCall = () => {
    if (selectedBusiness?.phone) {
      Linking.openURL(`tel:${selectedBusiness.phone}`);
    }
  };

  const handleWebsite = () => {
    if (selectedBusiness?.website) {
      Linking.openURL(selectedBusiness.website);
    }
  };

  const handleDirections = async () => {
    if (!selectedBusiness?.coordinate) {
      Alert.alert('Error', 'No location data available for this business.');
      return;
    }
    try {
      const { latitude, longitude } = selectedBusiness.coordinate;
      const label = encodeURIComponent(selectedBusiness.name);
      const url = Platform.select({
        ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}(${label})`
      });
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Navigation App Not Available', 'Could not open map directions.');
      }
    } catch (error) {
      console.error('Error opening navigation app:', error);
      Alert.alert('Error', error.message || 'Could not open navigation app.');
    }
  };

  const handleBackPress = () => {
    if (openedFromMap) {
      console.log("Going back to Map screen");
      navigation.navigate('Map');
    } else {
      console.log("Going back to List view");
      setSelectedBusiness(null);
      setOpenedFromMap(false);
    }
  };

  const handleDeleteBusiness = async () => {
    if (!selectedBusiness || !selectedBusiness.id) return;

    Alert.alert(
      "Delete Business",
      `Are you sure you want to delete "${selectedBusiness.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel", onPress: () => setDeleting(false) },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              console.log('[BusinessPageScreen] Attempting to delete pin with ID:', selectedBusiness.id);
              await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/pins/${selectedBusiness.id}`);
              
              if (openedFromMap) {
                navigation.navigate('Map', { refresh: true, clearSelection: true });
              } else {
                setSelectedBusiness(null);
              }
            } catch (err) {
              console.error("Failed to delete business:", err.response ? err.response.data : err.message);
              Alert.alert("Error", "Could not delete the business. Please try again.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true, onDismiss: () => setDeleting(false) }
    );
  };

  const canDelete = useMemo(() => {
    if (!currentUser || !selectedBusiness || !selectedBusiness.creatorId) {
      return false;
    }
    return currentUser._id === selectedBusiness.creatorId;
  }, [currentUser, selectedBusiness]);

  const renderBusinessCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectBusiness(item, false)}>
      <View style={styles.businessCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.name || 'Unnamed Business'}</Text>
          <Text style={styles.cardSuburb}>{item.suburb || 'Suburb'}</Text>
        </View>
        <View style={styles.cardDetailsRow}>
          <View style={styles.cardRatingContainer}>
            <Text style={styles.starText}>★☆☆☆☆</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDetailView = () => {
    if (!selectedBusiness) return null;

    const renderStars = (rating) => {
      const totalStars = 5;
      let stars = '';
      for (let i = 1; i <= totalStars; i++) {
        stars += i <= rating ? '★' : '☆';
      }
      return stars;
    };

    return (
      <ScrollView style={styles.detailScrollView}>
        <View style={styles.detailMapContainer}>
          {selectedBusiness.coordinate ? (
            <MapView
              style={styles.detailMap}
              initialRegion={{
                latitude: selectedBusiness.coordinate.latitude,
                longitude: selectedBusiness.coordinate.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={selectedBusiness.coordinate} title={selectedBusiness.name} />
            </MapView>
          ) : (
            <View style={styles.detailMapPlaceholder}><Text>Map not available</Text></View>
          )}
          <TouchableOpacity style={styles.directionsButton} onPress={handleDirections}>
            <Ionicons name="navigate-outline" size={20} color="#fff" />
            <Text style={styles.directionsButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.detailBusinessName}>{selectedBusiness.name}</Text>
          <View style={styles.detailRatingContainer}>
            <Text style={styles.starText}>{renderStars(selectedBusiness.rating)}</Text>
            <Text style={styles.detailReviewCount}>{selectedBusiness.reviewCount} reviews</Text>
          </View>
          <Text style={styles.detailDescription}>{selectedBusiness.description}</Text>
          <View style={styles.detailActionButtons}>
            <TouchableOpacity style={styles.detailActionButton} onPress={handleCall}>
              <Ionicons name="call-outline" size={24} color={colors.primary} />
              <Text style={styles.detailActionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailActionButton} onPress={handleWebsite}>
              <Ionicons name="globe-outline" size={24} color={colors.primary} />
              <Text style={styles.detailActionText}>Website</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailActionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color={colors.primary} />
              <Text style={styles.detailActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Hours</Text>
          {selectedBusiness.hours.map((item, index) => (
            <View key={index} style={styles.hoursItem}>
              <Text style={styles.dayText}>{item.day}</Text>
              <Text style={styles.hoursText}>{item.hours}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {selectedBusiness.amenities.map((item, index) => (
              <View key={index} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {selectedBusiness.reviews.length > 0 ? selectedBusiness.reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{review.author}</Text>
                <Text style={styles.starText}>{renderStars(review.rating)}</Text>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          )) : (
            <Text style={styles.noReviewsText}>No reviews yet.</Text>
          )}
        </View>

        {canDelete && (
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={[styles.deleteButton, deleting ? styles.deleteButtonDisabled : {}]}
              onPress={handleDeleteBusiness}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.deleteButtonText}>Delete Business</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.detailSpacer} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        {selectedBusiness ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={colors.text || '#333'} />
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.headerSpacer} />
            <Text style={styles.title}>Businesses</Text>
            <View style={styles.headerSpacer} />
          </>
        )}
      </View>
      
      {loading && !selectedBusiness ? (
        <View style={styles.loadingContainerFullScreen}>
          <ActivityIndicator size="large" color={colors.primary || '#0000ff'} />
        </View>
      ) : error ? (
        <View style={styles.errorContainerFullScreen}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : selectedBusiness ? (
        renderDetailView()
      ) : (
        <FlatList
          style={styles.list}
          data={businesses}
          renderItem={renderBusinessCard}
          keyExtractor={item => item._id || item.id}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListText}>No businesses found.</Text>
    </View>
          )}
        />
      )}
    </SafeAreaView>
  );
} 