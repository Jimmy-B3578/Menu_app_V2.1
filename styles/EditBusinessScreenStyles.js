import { StyleSheet, Platform } from 'react-native';
import { colors } from './themes'; // Assuming you have a theme file

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text || '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: colors.white || '#fff',
    borderColor: colors.border || '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary || '#007bff',
    marginTop: 25,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight || '#eee',
    paddingBottom: 5,
  },
  // Hours Styling
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 5 : 8,
    paddingVertical: Platform.OS === 'ios' ? 5 : 8,
    paddingHorizontal: 10,
    backgroundColor: colors.cardBackground || '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight || '#eee',
  },
  dayLabel: {
    fontSize: Platform.OS === 'ios' ? 14 : 15,
    fontWeight: '600',
    color: colors.textSecondary || '#555',
    flex: Platform.OS === 'ios' ? 2 : 1,
    marginRight: 5,
  },
  dayHoursControlsContainer: {
    flex: Platform.OS === 'ios' ? 3 : 2,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  isOpenButton: {
    backgroundColor: colors.secondary || '#6c757d',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  isOpenButtonText: {
    color: colors.white || '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  timePickersRowContainer: {
    flexDirection: Platform.OS === 'ios' ? 'column' : 'row',
    alignItems: 'stretch',
  },
  pickerContainer: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 5 : 0,
  },
  pickerLabel: {
    fontSize: 12,
    color: colors.textMuted || '#666',
    marginBottom: Platform.OS === 'ios' ? -15 : 2,
    marginLeft: Platform.OS === 'ios' ? 5 : 0,
    textAlign: Platform.OS === 'ios' ? 'left' : 'center',
  },
  pickerStyle: {
    height: Platform.OS === 'ios' ? 100 : 40,
    width: '100%',
    backgroundColor: colors.inputBackground || colors.white || '#fff',
    borderRadius: Platform.OS === 'android' ? 4 : 0,
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    borderColor: Platform.OS === 'android' ? (colors.border || '#ccc') : undefined,
  },
  iosPicker: {
    height: 100,
    width: '100%',
  },
  iosPickerItem: {
    height: 100,
    fontSize: Platform.OS === 'ios' ? 18 : 16,
  },
  // Amenities Styling
  amenityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  amenityInput: {
    flex: 1,
    backgroundColor: colors.white || '#fff',
    borderColor: colors.border || '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: colors.text,
    marginRight: 10,
  },
  addAmenityButton: {
    backgroundColor: colors.success || '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addAmenityButtonText: {
    color: colors.white || '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  amenitiesListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  amenityTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryMuted || '#e0e0e0',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityTagText: {
    color: colors.primary || '#007bff',
    fontSize: 14,
    marginRight: 5,
  },
  removeAmenityButton: {
    padding: 2,
  },
  // Save Button
  saveButton: {
    backgroundColor: colors.primary || '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonDisabled: {
    backgroundColor: colors.grey || '#aaa',
  },
  saveButtonText: {
    color: colors.white || '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // --- New Hours Styling (Single Editor) ---
  hoursEditingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: colors.cardBackground || '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight || '#eee',
    marginBottom: 20,
  },
  daySelectorContainer: {
    flex: Platform.OS === 'ios' ? 2 : 1.5,
    marginRight: 10,
    justifyContent: 'center',
  },
  dayOfWeekPicker: {
    height: Platform.OS === 'ios' ? 120 : 50,
    width: '100%',
  },
  dayOfWeekPickerItem: {
    height: Platform.OS === 'ios' ? 120 : undefined, 
    fontSize: Platform.OS === 'ios' ? 18 : undefined,
  },
  selectedDayEditorContainer: {
    flex: 3,
    flexDirection: 'column',
  },

  // --- Styles for controls within selectedDayEditorContainer (adapted for compactness) ---
  // dayContainer, dayLabel, dayHoursControlsContainer are no longer used as top-level repeated items

  isOpenButton: {
    backgroundColor: colors.secondary || '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignSelf: 'flex-start', 
    marginBottom: 8,
  },
  isOpenButtonText: {
    color: colors.white || '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  timePickersRowContainer: { 
    flexDirection: Platform.OS === 'ios' ? 'column' : 'row', 
    alignItems: 'stretch', 
  },
  pickerContainer: { 
    flex: 1, 
    marginBottom: Platform.OS === 'ios' ? 8 : 0,
    marginHorizontal: Platform.OS === 'android' && Platform.Version > 20 ? 2 : 0,
  },
  pickerLabel: {
    fontSize: 12,
    color: colors.textMuted || '#666',
    marginBottom: Platform.OS === 'ios' ? -15 : 3, 
    marginLeft: Platform.OS === 'ios' ? 5 : (Platform.OS === 'android' ? 5 : 0),
    textAlign: Platform.OS === 'ios' ? 'left' : 'left',
  },
  pickerStyle: {
    height: 45, 
    width: '100%',
    backgroundColor: colors.inputBackground || colors.white || '#fff',
    borderRadius: 4, 
    borderWidth: 1, 
    borderColor: colors.border || '#ccc',
    fontSize: 15,
  },
  iosPicker: {
    height: 100, 
    width: '100%',
  },
  iosPickerItem: {
    height: 100, 
    fontSize: 18,
  },
  // --- End of Hours Styling ---
}); 