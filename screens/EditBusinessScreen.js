import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import axios from 'axios';
import { colors } from '../styles/themes';
import styles from '../styles/EditBusinessScreenStyles'; // We will create this file
import { Ionicons } from '@expo/vector-icons';

// Helper to generate time slots for pickers
const generateTimeSlots = () => {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) { // 30-minute intervals
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      slots.push(`${hour}:${minute}`);
    }
  }
  return slots;
};
const TIME_SLOTS = generateTimeSlots();
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function EditBusinessScreen({ route, navigation }) {
  const { businessData } = route.params;
  
  const [name, setName] = useState(businessData?.name || '');
  const [description, setDescription] = useState(businessData?.description || '');
  const [phone, setPhone] = useState(businessData?.phone || '');
  const [website, setWebsite] = useState(businessData?.website || '');
  
  const [hours, setHours] = useState(() => {
    // Ensure hours are structured correctly with all days, defaulting if necessary
    const initialHours = DAYS_OF_WEEK.map(dayName => {
      const existingDay = businessData?.hours?.find(h => h.day === dayName);
      return {
        day: dayName,
        isOpen: existingDay ? existingDay.isOpen : true, // Default to open
        open: existingDay ? existingDay.open : '09:00',
        close: existingDay ? existingDay.close : '17:00'
      };
    });
    return initialHours;
  });

  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // New state for selected day index

  const [amenities, setAmenities] = useState(businessData?.amenities ? [...businessData.amenities] : []);
  const [currentAmenity, setCurrentAmenity] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: `Edit ${businessData?.name || 'Business'}`,
      headerBackTitle: 'Cancel', // Or simply 'Back'
    });
  }, [navigation, businessData?.name]);

  // Modified to use selectedDayIndex from state
  const handleHourChange = (field, value) => {
    const updatedHours = hours.map((h, i) => {
      if (i === selectedDayIndex) {
        return { ...h, [field]: value };
      }
      return h;
    });
    setHours(updatedHours);
  };

  // Modified to use selectedDayIndex from state
  const handleToggleOpen = () => {
    const updatedHours = hours.map((h, i) => {
      if (i === selectedDayIndex) {
        return { ...h, isOpen: !h.isOpen };
      }
      return h;
    });
    setHours(updatedHours);
  };

  const handleAddAmenity = () => {
    if (currentAmenity.trim() && !amenities.includes(currentAmenity.trim())) {
      setAmenities([...amenities, currentAmenity.trim()]);
      setCurrentAmenity('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setAmenities(amenities.filter(amenity => amenity !== amenityToRemove));
  };

  const handleSaveChanges = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Business name cannot be empty.');
      return;
    }

    // Check if businessData and businessData._id are valid
    if (!businessData || !businessData._id || (typeof businessData._id === 'string' && businessData._id.length !== 24)) { // Basic check for ObjectId-like string length
      Alert.alert(
        'Error',
        'Cannot save changes: Business ID is missing or invalid. This might happen if you are editing a newly created pin that wasn\'t properly initialized. Please try creating the pin again.'
      );
      setIsSaving(false); // Reset loading state
      return;
    }

    setIsSaving(true);
    const updatedData = {
      name,
      description,
      phone,
      website,
      hours, 
      amenities,
      // Include any other fields that are part of the Pin schema and are NOT auto-managed (like createdBy, location)
      // e.g., if 'cuisine' was editable here, you'd include it.
      // cuisine: businessData.cuisine // Assuming cuisine is not edited on this screen for now
    };

    try {
      await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/pins/${businessData._id}`, updatedData);
      navigation.navigate('Tabs', { screen: 'Business', params: { refreshBusiness: true, businessIdToRefresh: businessData._id } });
    } catch (error) {
      console.error('Error updating business details:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // This function now renders controls for the currently selected day (hours[selectedDayIndex])
  const renderSelectedDayEditor = () => {
    if (selectedDayIndex < 0 || selectedDayIndex >= hours.length) return null; // Guard clause
    
    const daySchedule = hours[selectedDayIndex];
    if (!daySchedule) return null; // Should not happen if selectedDayIndex is valid

    return (
      <>
        <TouchableOpacity onPress={handleToggleOpen} style={styles.isOpenButton}>
          <Text style={styles.isOpenButtonText}>{daySchedule.isOpen ? 'Open' : 'Closed'}</Text>
        </TouchableOpacity>
        {daySchedule.isOpen && (
          <View style={styles.timePickersRowContainer}> 
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Open:</Text>
              <Picker
                selectedValue={daySchedule.open}
                style={Platform.OS === 'ios' ? styles.iosPicker : styles.pickerStyle}
                itemStyle={Platform.OS === 'ios' ? styles.iosPickerItem : {}}
                onValueChange={(itemValue) => handleHourChange('open', itemValue)}
              >
                {TIME_SLOTS.map(time => (
                  <Picker.Item key={`${daySchedule.day}-open-${time}`} label={time} value={time} />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Close:</Text>
              <Picker
                selectedValue={daySchedule.close}
                style={Platform.OS === 'ios' ? styles.iosPicker : styles.pickerStyle}
                itemStyle={Platform.OS === 'ios' ? styles.iosPickerItem : {}}
                onValueChange={(itemValue) => handleHourChange('close', itemValue)}
              >
                {TIME_SLOTS.map(time => (
                  <Picker.Item key={`${daySchedule.day}-close-${time}`} label={time} value={time} />
                ))}
              </Picker>
            </View>
          </View>
        )}
      </>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={100}
      extraHeight={Platform.OS === 'ios' ? 130 : 120}
      resetScrollToCoords={{ x: 0, y: 0 }}
    >
      <Text style={styles.label}>Business Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter business name"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter business description"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Website</Text>
      <TextInput
        style={styles.input}
        value={website}
        onChangeText={setWebsite}
        placeholder="Enter website URL"
        keyboardType="url"
        autoCapitalize="none"
      />

      <Text style={styles.sectionTitle}>Opening Hours</Text>
      <View style={styles.hoursEditingContainer}>
        <View style={styles.daySelectorContainer}>
          <Picker
            selectedValue={DAYS_OF_WEEK[selectedDayIndex]}
            onValueChange={(itemValue, itemIndex) => setSelectedDayIndex(itemIndex)}
            style={styles.dayOfWeekPicker}
            itemStyle={styles.dayOfWeekPickerItem} // itemStyle is iOS only
            mode="dropdown" // Android specific to ensure it's a dropdown
          >
            {DAYS_OF_WEEK.map((day, index) => (
              <Picker.Item key={index} label={day} value={day} />
            ))}
          </Picker>
        </View>
        <View style={styles.selectedDayEditorContainer}>
          {renderSelectedDayEditor()}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Amenities</Text>
      <View style={styles.amenityInputContainer}>
        <TextInput
          style={styles.amenityInput}
          value={currentAmenity}
          onChangeText={setCurrentAmenity}
          placeholder="Add an amenity (e.g., WiFi)"
        />
        <TouchableOpacity style={styles.addAmenityButton} onPress={handleAddAmenity}>
          <Text style={styles.addAmenityButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.amenitiesListContainer}>
        {amenities.map((amenity, index) => (
          <View key={index} style={styles.amenityTagContainer}>
            <Text style={styles.amenityTagText}>{amenity}</Text>
            <TouchableOpacity onPress={() => handleRemoveAmenity(amenity)} style={styles.removeAmenityButton}>
              <Ionicons name="close-circle" size={20} color={colors.danger || '#dc3545'} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSaveChanges} 
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color={colors.white || '#fff'} />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
} 