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

  const formatTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) return 'N/A';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 === 0 ? 12 : h % 12;
    const formattedMinutes = m < 10 ? `0${m}` : m;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const groupAndFormatHours = (hoursArray) => {
    if (!hoursArray || hoursArray.length === 0) return [];

    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    // Ensure hours are sorted according to dayOrder, in case they are not already
    const sortedHours = [...hoursArray].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

    const grouped = [];
    let currentGroup = null;

    for (const item of sortedHours) {
      const displayTimes = item.isOpen ? `${formatTime(item.open)} - ${formatTime(item.close)}` : 'Closed';
      const itemSignature = `${item.isOpen}-${item.open}-${item.close}`;

      if (currentGroup && currentGroup.signature === itemSignature) {
        currentGroup.endDay = item.day;
      } else {
        if (currentGroup) {
          grouped.push({
            days: currentGroup.startDay === currentGroup.endDay ? currentGroup.startDay : `${currentGroup.startDay} - ${currentGroup.endDay}`,
            times: currentGroup.times,
            key: `${currentGroup.startDay}-${currentGroup.signature}`
          });
        }
        currentGroup = {
          startDay: item.day,
          endDay: item.day,
          times: displayTimes,
          signature: itemSignature,
        };
      }
    }

    if (currentGroup) {
      grouped.push({
        days: currentGroup.startDay === currentGroup.endDay ? currentGroup.startDay : `${currentGroup.startDay} - ${currentGroup.endDay}`,
        times: currentGroup.times,
        key: `${currentGroup.startDay}-${currentGroup.signature}`
      });
    }
    return grouped;
  };

  useEffect(() => {
    if (selectedBusiness === null && !route.params?.refreshBusiness) {
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
  }, [selectedBusiness, route.params?.refreshBusiness]);

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

  useEffect(() => {
    if (route.params?.refreshBusiness) {
      const idToRefresh = route.params?.businessIdToRefresh || selectedBusiness?.id;
      if (idToRefresh) {
        const fetchUpdatedBusiness = async () => {
          setLoading(true);
          try {
            console.log(`[BusinessPageScreen] Refreshing business with ID: ${idToRefresh}`);
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/pins/${idToRefresh}`);
            const businessData = response.data;
            if (businessData) {
              handleSelectBusiness(businessData, openedFromMap, true);
            }
          } catch (err) {
            console.error("Failed to fetch updated business details:", err.response ? err.response.data : err.message, err.config);
            setError('Could not load updated details. Please try again.');
          } finally {
            setLoading(false);
            navigation.setParams({ refreshBusiness: undefined, businessIdToRefresh: undefined });
          }
        };
        fetchUpdatedBusiness();
      } else {
         console.warn("[BusinessPageScreen] refreshBusiness was true but no ID found to refresh.");
         navigation.setParams({ refreshBusiness: undefined, businessIdToRefresh: undefined });
      }
    }
  }, [route.params?.refreshBusiness, route.params?.businessIdToRefresh, selectedBusiness?.id, navigation, openedFromMap]);

  const handleSelectBusiness = (business, fromMap = false, isRefresh = false) => {
    const details = {
      id: business._id || business.id || '',
      name: business.name || business.title || 'Business Name',
      description: business.description || 'No description available.',
      address: business.address || 'Address not available',
      phone: business.phone || '',
      website: business.website || '',
      coordinate: business.coordinate || (business.location?.coordinates ? { latitude: business.location.coordinates[1], longitude: business.location.coordinates[0] } : null),
      creatorId: typeof business.createdBy === 'object' ? business.createdBy?._id : business.createdBy,
      hours: Array.isArray(business.hours) && business.hours.length > 0 ? business.hours : [],
      rating: business.rating || 0,
      reviewCount: business.reviewCount || 0,
      photos: business.photos || [],
      amenities: Array.isArray(business.amenities) && business.amenities.length > 0 ? business.amenities : [],
      reviews: business.reviews || [],
      ...business
    };
    if (!isRefresh) {
    setOpenedFromMap(fromMap);
    }
    setSelectedBusiness(details);
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

  const canEdit = useMemo(() => {
    if (!currentUser || !selectedBusiness || !selectedBusiness.creatorId) {
      return false;
    }
    return currentUser._id === selectedBusiness.creatorId;
  }, [currentUser, selectedBusiness]);

  const formattedHours = useMemo(() => {
    if (selectedBusiness?.hours) {
      return groupAndFormatHours(selectedBusiness.hours);
    }
    return [];
  }, [selectedBusiness?.hours]);

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
          {selectedBusiness.description ? (
          <Text style={styles.detailDescription}>{selectedBusiness.description}</Text>
          ) : (
            <Text style={styles.detailDescription}>No description available.</Text>
          )}
          <View style={styles.detailActionButtons}>
            {selectedBusiness.phone ? (
            <TouchableOpacity style={styles.detailActionButton} onPress={handleCall}>
              <Ionicons name="call-outline" size={24} color={colors.primary} />
              <Text style={styles.detailActionText}>Call</Text>
            </TouchableOpacity>
            ) : null}
            {selectedBusiness.website ? (
            <TouchableOpacity style={styles.detailActionButton} onPress={handleWebsite}>
              <Ionicons name="globe-outline" size={24} color={colors.primary} />
              <Text style={styles.detailActionText}>Website</Text>
            </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.detailActionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color={colors.primary} />
              <Text style={styles.detailActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {formattedHours.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Hours</Text>
            {formattedHours.map((group) => (
              <View key={group.key} style={styles.hoursItem}>
                <Text style={styles.dayText}>{group.days}</Text>
                <Text style={styles.hoursText}>{group.times}</Text>
            </View>
          ))}
        </View>
        )}

        {selectedBusiness.amenities && selectedBusiness.amenities.length > 0 && (
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
        )}

        {selectedBusiness.reviews && selectedBusiness.reviews.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Reviews</Text>
            {selectedBusiness.reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{review.author}</Text>
                <Text style={styles.starText}>{renderStars(review.rating)}</Text>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
            ))}
          </View>
        )}

        {(canEdit || canDelete) && (
          <View style={styles.adminActionsCard}>
            <Text style={styles.sectionTitle}>Admin Actions</Text>
            {canEdit && (
              <TouchableOpacity
                style={[styles.adminButton, styles.editButton]}
                onPress={() => navigation.navigate('EditBusiness', { businessData: selectedBusiness })}
              >
                <Ionicons name="pencil-outline" size={20} color={colors.white || '#fff'} style={styles.adminButtonIcon} />
                <Text style={styles.adminButtonText}>Edit Business Details</Text>
              </TouchableOpacity>
            )}
        {canDelete && (
            <TouchableOpacity
                style={[styles.adminButton, styles.deleteButton, deleting ? styles.deleteButtonDisabled : {}]}
              onPress={handleDeleteBusiness}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                  <>
                    <Ionicons name="trash-outline" size={20} color={colors.white || '#fff'} style={styles.adminButtonIcon} />
                    <Text style={styles.adminButtonText}>Delete Business</Text>
                  </>
              )}
            </TouchableOpacity>
            )}
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