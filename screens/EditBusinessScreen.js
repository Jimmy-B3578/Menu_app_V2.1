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
import { useTheme } from '../context/UserContext';
import styles from '../styles/EditBusinessScreenStyles'; // We will create this file
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

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
  const { theme } = useTheme();
  const { businessData } = route.params;
  
  const [name, setName] = useState(businessData?.name || '');
  const [description, setDescription] = useState(businessData?.description || '');
  const [phone, setPhone] = useState(businessData?.phone || '');
  const [website, setWebsite] = useState(businessData?.website || '');
  const [suburb, setSuburb] = useState(businessData?.suburb || '');
  
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
      headerStyle: {
        backgroundColor: theme.surface,
      },
      headerTintColor: theme.text.main,
      headerTitleStyle: {
        color: theme.text.main,
      },
    });
  }, [navigation, businessData?.name, theme]);

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

    if (!suburb.trim()) {
      Alert.alert('Validation Error', 'Suburb cannot be empty.');
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
      suburb,
      hours, 
      amenities,
      // Include any other fields that are part of the Pin schema and are NOT auto-managed (like createdBy, location)
      // e.g., if 'cuisine' was editable here, you'd include it.
      // cuisine: businessData.cuisine // Assuming cuisine is not edited on this screen for now
    };

    try {
      await axios.put(`${Constants.expoConfig.extra.EXPO_PUBLIC_API_URL}/pins/${businessData._id}`, updatedData);
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
        <TouchableOpacity onPress={handleToggleOpen} style={[styles.isOpenButton, { backgroundColor: theme.button.secondary }]}>
          <Text style={[styles.isOpenButtonText, { color: theme.button.text }]}>{daySchedule.isOpen ? 'Open' : 'Closed'}</Text>
        </TouchableOpacity>
        {daySchedule.isOpen && (
          <View style={styles.timePickersRowContainer}> 
            <View style={styles.pickerContainer}>
              <Text style={[styles.pickerLabel, { color: theme.text.subtext }]}>Open:</Text>
              <Picker
                selectedValue={daySchedule.open}
                style={Platform.OS === 'ios' ? [styles.iosPicker, { color: theme.input.text }] : [styles.pickerStyle, { backgroundColor: theme.input.background, borderColor: theme.input.border, color: theme.input.text }]}
                itemStyle={Platform.OS === 'ios' ? [styles.iosPickerItem, { color: theme.input.text }] : {}}
                onValueChange={(itemValue) => handleHourChange('open', itemValue)}
              >
                {TIME_SLOTS.map(time => (
                  <Picker.Item key={`${daySchedule.day}-open-${time}`} label={time} value={time} color={theme.input.text} />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Text style={[styles.pickerLabel, { color: theme.text.subtext }]}>Close:</Text>
              <Picker
                selectedValue={daySchedule.close}
                style={Platform.OS === 'ios' ? [styles.iosPicker, { color: theme.input.text }] : [styles.pickerStyle, { backgroundColor: theme.input.background, borderColor: theme.input.border, color: theme.input.text }]}
                itemStyle={Platform.OS === 'ios' ? [styles.iosPickerItem, { color: theme.input.text }] : {}}
                onValueChange={(itemValue) => handleHourChange('close', itemValue)}
              >
                {TIME_SLOTS.map(time => (
                  <Picker.Item key={`${daySchedule.day}-close-${time}`} label={time} value={time} color={theme.input.text} />
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
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={100}
      extraHeight={Platform.OS === 'ios' ? 130 : 120}
      resetScrollToCoords={{ x: 0, y: 0 }}
    >
      <Text style={[styles.label, { color: theme.text.main }]}>Business Name</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.input.border, color: theme.text.main }]}
        value={name}
        onChangeText={setName}
        placeholder="Enter business name"
        placeholderTextColor={theme.input.placeholder}
      />

      <Text style={[styles.label, { color: theme.text.main }]}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea, { backgroundColor: theme.surface, borderColor: theme.input.border, color: theme.text.main }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter business description"
        placeholderTextColor={theme.input.placeholder}
        multiline
        numberOfLines={4}
      />

      <Text style={[styles.label, { color: theme.text.main }]}>Suburb</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.input.border, color: theme.text.main }]}
        value={suburb}
        onChangeText={setSuburb}
        placeholder="Enter suburb"
        placeholderTextColor={theme.input.placeholder}
      />

      <Text style={[styles.label, { color: theme.text.main }]}>Phone Number</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.input.border, color: theme.text.main }]}
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        placeholderTextColor={theme.input.placeholder}
        keyboardType="phone-pad"
      />

      <Text style={[styles.label, { color: theme.text.main }]}>Website</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.input.border, color: theme.text.main }]}
        value={website}
        onChangeText={setWebsite}
        placeholder="Enter website URL"
        placeholderTextColor={theme.input.placeholder}
        keyboardType="url"
        autoCapitalize="none"
      />

      <Text style={[styles.sectionTitle, { color: theme.primary, borderBottomColor: theme.borderLight }]}>Opening Hours</Text>
      <View style={[styles.hoursEditingContainer, { backgroundColor: theme.surface, borderColor: theme.borderLight }]}>
        <View style={[styles.daySelectorContainer, { backgroundColor: theme.surface, borderColor: theme.input.border }]}>
          <Picker
            selectedValue={DAYS_OF_WEEK[selectedDayIndex]}
            onValueChange={(itemValue, itemIndex) => setSelectedDayIndex(itemIndex)}
            style={[styles.dayOfWeekPicker, { color: theme.input.text }]}
            itemStyle={[styles.dayOfWeekPickerItem, { color: theme.input.text }]} // itemStyle is iOS only
            mode="dropdown" // Android specific to ensure it's a dropdown
          >
            {DAYS_OF_WEEK.map((day, index) => (
              <Picker.Item key={index} label={day} value={day} color={theme.input.text} />
            ))}
          </Picker>
        </View>
        <View style={[styles.selectedDayEditorContainer, { backgroundColor: theme.surface, borderColor: theme.borderLight }]}>
          {renderSelectedDayEditor()}
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.primary, borderBottomColor: theme.borderLight }]}>Amenities</Text>
      <View style={styles.amenityInputContainer}>
        <TextInput
          style={[styles.amenityInput, { backgroundColor: theme.surface, borderColor: theme.input.border, color: theme.text.main }]}
          value={currentAmenity}
          onChangeText={setCurrentAmenity}
          placeholder="Add an amenity (e.g., WiFi)"
          placeholderTextColor={theme.input.placeholder}
        />
        <TouchableOpacity style={[styles.addAmenityButton, { backgroundColor: theme.success }]} onPress={handleAddAmenity}>
          <Text style={[styles.addAmenityButtonText, { color: theme.button.text }]}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.amenitiesListContainer}>
        {amenities.map((amenity, index) => (
          <View key={index} style={[styles.amenityTagContainer, { backgroundColor: theme.amenity.background }]}>
            <Text style={[styles.amenityTagText, { color: theme.amenity.text }]}>{amenity}</Text>
            <TouchableOpacity onPress={() => handleRemoveAmenity(amenity)} style={styles.removeAmenityButton}>
              <Ionicons name="close-circle" size={20} color={theme.error} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: theme.primary }, isSaving && { backgroundColor: theme.button.disabled }]}
        onPress={handleSaveChanges} 
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color={theme.button.text} />
        ) : (
          <Text style={[styles.saveButtonText, { color: theme.button.text }]}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
} 