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
    marginBottom: 15,
    padding: 10,
    backgroundColor: colors.cardBackground || '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight || '#eee',
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary || '#555',
    marginBottom: 10,
  },
  dayHoursContainer: {
    // Styles for the container of toggle and pickers
  },
  isOpenButton: {
    backgroundColor: colors.secondary || '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  isOpenButtonText: {
    color: colors.white || '#fff',
    fontWeight: 'bold',
  },
  timePickersContainer: {
    // Styles for the container of open and close time pickers if needed
  },
  timePickersRowContainer: { // New style for horizontal layout of pickers
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'ios' ? 'center' : 'flex-start', // iOS Pickers are taller
  },
  pickerContainer: { // New style to wrap label and picker vertically
    flex: 1,
    marginHorizontal: Platform.OS === 'ios' ? 0 : 5, // No horizontal margin for iOS pickers as they are full width
  },
  pickerLabel: {
    fontSize: 14,
    color: colors.textMuted || '#666',
    marginBottom: Platform.OS === 'ios' ? -10 : 5, // Adjust for iOS picker item visibility
    marginLeft: Platform.OS === 'ios' ? 10 : 0, // Indent label slightly for iOS default picker style
    textAlign: Platform.OS === 'ios' ? 'left' : 'center',
  },
  pickerStyle: { // Basic style for Picker, might need platform adjustments
    height: 50, // Standard height for Android
    width: '100%',
    backgroundColor: colors.white || '#fff',
    borderRadius: Platform.OS === 'android' ? 8 : 0, // Android can have rounded Picker
    borderWidth: Platform.OS === 'android' ? 1 : 0, // Android can have border
    borderColor: Platform.OS === 'android' ? (colors.border || '#ccc') : undefined,
    marginBottom: 10,
  },
  iosPicker: { // Specific style for iOS Picker container/wrapper if needed for height
    height: 120, // iOS pickers need more height to show the wheel
    width: '100%', // Take full width within its flex container
    // backgroundColor: 'transparent', // Often set to transparent
  },
  iosPickerItem: { // Specific style for iOS Picker Items for text color etc.
    height: 120, // Should match the picker height
    // color: colors.text, // Uncomment and set if default color is not good
    fontSize: 16, // Example size
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
}); 