import { StyleSheet } from 'react-native';
import { colors } from './themes';

export default StyleSheet.create({
  container: {
    flex: 1,
    // Remove justification and alignment
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: colors.background, // Map will provide background
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  // Add other styles specific to MapScreen

  // --- Styles for the Modal --- 
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
    shadowColor: 'rgba(0, 0, 0, 0.5)',
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

  // --- Styles for the Custom Button ---
  recenterButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 20, // Make it round
    width: 40, // Fixed size
    height: 40, // Fixed size
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  recenterButtonText: {
    fontSize: 20, // Adjust size of icon/emoji
  },

  // --- Styles for Create Button in Modal ---
  createButton: {
    backgroundColor: colors.primary, // Or choose a color like '#2196F3'
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    marginTop: 10, // Add some space above the button
  },
  createButtonText: {
    color: 'black', // Set text color to black
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  createButtonDisabled: { // Style for disabled state
    backgroundColor: '#cccccc',
  },
}); 