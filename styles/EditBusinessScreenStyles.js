import { StyleSheet, Platform } from 'react-native';
import { colors } from './themes'; // Assuming you have a theme file

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: colors.input.background,
    borderColor: colors.input.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: colors.input.text,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 25,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
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
    backgroundColor: colors.card.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dayLabel: {
    fontSize: Platform.OS === 'ios' ? 14 : 15,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: Platform.OS === 'ios' ? 2 : 1,
    marginRight: 5,
  },
  dayHoursControlsContainer: {
    flex: Platform.OS === 'ios' ? 3 : 2,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  isOpenButton: {
    backgroundColor: colors.button.secondary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  isOpenButtonText: {
    color: colors.button.text,
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
    color: colors.textMuted,
    marginBottom: Platform.OS === 'ios' ? -15 : 2,
    marginLeft: Platform.OS === 'ios' ? 5 : 0,
    textAlign: Platform.OS === 'ios' ? 'left' : 'center',
  },
  pickerStyle: {
    height: Platform.OS === 'ios' ? 100 : 40,
    width: '100%',
    backgroundColor: colors.input.background,
    borderRadius: Platform.OS === 'android' ? 4 : 0,
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    borderColor: Platform.OS === 'android' ? colors.input.border : undefined,
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
    backgroundColor: colors.input.background,
    borderColor: colors.input.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: colors.input.text,
    marginRight: 10,
  },
  addAmenityButton: {
    backgroundColor: colors.success,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addAmenityButtonText: {
    color: colors.button.text,
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
    backgroundColor: colors.amenity.background,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityTagText: {
    color: colors.amenity.text,
    fontSize: 14,
    marginRight: 5,
  },
  removeAmenityButton: {
    padding: 2,
  },
  // Save Button
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonDisabled: {
    backgroundColor: colors.button.disabled,
  },
  saveButtonText: {
    color: colors.button.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // --- New Hours Styling (Single Editor) ---
  hoursEditingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: colors.card.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    backgroundColor: colors.button.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignSelf: 'flex-start', 
    marginBottom: 8,
  },
  isOpenButtonText: {
    color: colors.button.text,
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
    color: colors.textMuted,
    marginBottom: Platform.OS === 'ios' ? -15 : 3, 
    marginLeft: Platform.OS === 'ios' ? 5 : (Platform.OS === 'android' ? 5 : 0),
    textAlign: Platform.OS === 'ios' ? 'left' : 'left',
  },
  pickerStyle: {
    height: 45, 
    width: '100%',
    backgroundColor: colors.input.background,
    borderRadius: 4, 
    borderWidth: 1, 
    borderColor: colors.border,
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