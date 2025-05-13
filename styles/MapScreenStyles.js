import { StyleSheet, Platform } from 'react-native';
import { colors } from './themes';

export default StyleSheet.create({
  // Main container for the Map screen
  container: {
    flex: 1, // Take up all available space
    // Removed previous centering styles as MapView handles layout
  },
  // Basic title style (potentially unused if header is hidden)
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },

  // --- Styles for the Modal (used for adding new locations) ---
  // Semi-transparent background overlay when modal is active
  centeredView: {
    flex: 1,
    justifyContent: 'center', // Center modal vertically
    alignItems: 'center', // Center modal horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // The actual modal content container
  modalView: {
    margin: 20, // Margin around the modal
    backgroundColor: 'white', // Background color of the modal
    borderRadius: 10, // Rounded corners
    padding: 35, // Inner padding
    alignItems: 'center', // Center items horizontally inside the modal
    shadowColor: 'rgba(0, 0, 0, 0.5)', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
    width: '80%', // Modal width relative to screen
    position: 'relative', // Allows absolute positioning for children (like cancel button)
  },
  // Text inside the modal (e.g., "Enter Location Name:")
  modalText: {
    marginBottom: 15, // Space below the text
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Text input field within the modal
  input: {
    height: 40, // Fixed height
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20, // Space below the input
    paddingHorizontal: 10, // Horizontal padding inside the input
    width: '100%', // Take full width of modal
    borderRadius: 5, // Slightly rounded corners
  },
  // 'X' button to close the modal
  cancelButton: {
    position: 'absolute', // Position freely within modalView
    top: 10, // Distance from top
    right: 10, // Distance from right
    padding: 5, // Clickable area
  },
  // Text style for the 'X' cancel button
  cancelButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888', // Grey color
  },

  // --- Styles for the Custom Recenter Button ---
  // The floating recenter button on the map
  recenterButton: {
    position: 'absolute', // Float over the map
    top: 60, // Distance from top edge of screen
    right: 20, // Distance from right edge of screen
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
    padding: 10, // Inner padding
    borderRadius: 20, // Make it round (half of width/height)
    width: 40, // Fixed width
    height: 40, // Fixed height (match width for circle)
    justifyContent: 'center', // Center icon vertically
    alignItems: 'center', // Center icon horizontally
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, // Android shadow
  },
  // Text style for the recenter button (e.g., the ⌖ symbol)
  recenterButtonText: {
    fontSize: 20,
    color: colors.text || '#333', // Ensure color is set
    // Add Android-specific adjustments for centering
    ...Platform.select({
      android: {
        textAlign: 'center', // Explicitly center text horizontally
        lineHeight: 22, // Adjust line height (slightly > fontSize) for vertical alignment
      },
      ios: {
        // Potentially minor iOS adjustments if needed later
        lineHeight: 20, // Match fontSize on iOS often works well
      }
    })
  },

  // --- Styles for Create Button in Modal ---
  // The button to confirm creating a new location
  createButton: {
    backgroundColor: colors.primary, // Use primary theme color
    borderRadius: 5,
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    elevation: 2,
    marginTop: 10, // Space above the button
  },
  // Text style for the create button
  createButtonText: {
    color: 'black', // Text color (make sure it contrasts with button BG)
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  // Style applied when the create button is disabled (e.g., no text entered)
  createButtonDisabled: {
    backgroundColor: '#cccccc', // Greyed out color
  },

  // --- Context Box Styles (Appears when a pin is selected) ---
  // The container for the context box at the bottom
  contextBox: {
    position: 'absolute', // Fixed position at the bottom
    bottom: 0,
    left: 5,
    right: 5,
    backgroundColor: colors.cardBackground || 'white', // Use theme color or fallback
    padding: 15, // Inner padding
    borderTopLeftRadius: 5, // Rounded top corners
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 }, // Shadow pointing upwards
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5, // Android shadow
    alignItems: 'center', // Center content horizontally by default
  },
  // Title text (location name) inside the context box
  contextBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text || '#494444',
    marginBottom: 15, // Space below the title
    marginTop: 10, // Space above the title
  },
  // Style for the full-width button ("View Business Page")
  contextButtonFull: {
    backgroundColor: colors.primary || '#007AFF', // Use primary theme color
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 8, // Rounded corners
    width: '100%', // Span full width
    alignItems: 'center', // Center text inside button
    marginBottom: 12, // Space below this button
  },
  // Container for the row of two half-width buttons
  contextButtonRow: {
    flexDirection: 'row', // Arrange children horizontally
    justifyContent: 'space-between', // Space out the two buttons
    width: '100%', // Take full width
  },
  // Style for the half-width buttons ("Food Menu", "Drinks Menu")
  contextButtonHalf: {
    backgroundColor: colors.secondary || '#5AC8FA', // Use secondary theme color
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: '48%', // Slightly less than half to allow space between
    alignItems: 'center', // Center text inside button
  },
  // Text style used for all buttons inside the context box
  contextButtonText: {
    color: colors.buttonText || 'white', // Use theme color or fallback
    fontWeight: 'bold',
    fontSize: 14,
  },

  // --- Loading/Error Message Styles ---
  // Container for the loading indicator
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background || '#f0f0f0', // Use theme background or fallback
  },
  // Container for displaying error messages (e.g., location permission denied)
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background || '#f0f0f0', // Use theme background or fallback
  },
  backToSearchButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20, // Adjust for status bar
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 10, // Ensure it's above map elements
  },
  backToSearchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 