import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { styles } from '../styles/BusinessPageScreenStyles.js';
import { colors } from '../styles/themes';
import axios from 'axios';

export default function BusinessPageScreen({ route, navigation }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/pins`;
        // console.log('Fetching businesses from:', apiUrl);
        
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
  }, []);

  const renderBusinessCard = ({ item }) => (
    <View style={styles.businessCard}> 
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name || 'Unnamed Business'}</Text>
        <Text style={styles.cardSuburb}>{item.suburb || 'Unknown Suburb'}</Text>
      </View>
      
      <View style={styles.cardDetailsRow}> 
        <View style={styles.cardRatingContainer}>
          <Text style={styles.starText}>★☆☆☆☆</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}> 
        <ActivityIndicator size="large" color={colors.primary || '#0000ff'} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}> 
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}> 
      <View style={styles.headerContainer}> 
        <Text style={styles.title}>Businesses</Text>
      </View>
      
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
    </SafeAreaView>
  );
}