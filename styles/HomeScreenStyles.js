import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './themes'; // Import theme colors

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  // Main container for the whole screen
  fullScreenContainer: {
    flex: 1,
    backgroundColor: colors.background, // Use theme color
  },
  // Container for search bar and potentially results
  searchAreaContainer: {
    width: '100%',
    alignItems: 'center',
    // paddingHorizontal: 20, // Keep items from screen edges
  },
  searchAreaCenter: { // Initial position: Vertically centered
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50, // Offset to truly center the input area
  },
  searchAreaTop: { // Active position: At the top
    paddingTop: 20, // Status bar height approx + some margin
    // No flex: 1 here, content below will push it
  },
  searchBar: {
    height: 50,
    width: '90%', // Make it slightly wider
    borderColor: '#dfe1e5',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20, // Use paddingHorizontal
    fontSize: 16,
    backgroundColor: '#fff', // Keep white background
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 3, // Slightly increased elevation
    marginBottom: 10, // Add some margin below search bar
  },
  searchButton: {
    backgroundColor: colors.primary, // Use theme color for button
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10, // Space between input and button if search isn't active
    elevation: 2,
  },
  searchButtonText: {
    color: '#fff', // White text for button
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1, // Take remaining space
    width: '100%',
    paddingHorizontal: 15,
  },
  resultItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  resultItemPinName: { // Style for Pin Name when showing a matched item
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary, // Or another distinct color
    marginBottom: 2,
  },
  resultItemMenuContext: { // Style for "Found in Food/Drinks Menu:"
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.textMuted || '#888',
    marginBottom: 4,
  },
  resultItemDescription: {
    fontSize: 14,
    color: colors.textMuted || '#666', // Use a muted theme color or default
    marginTop: 4,
  },
  resultItemCuisine: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.primary, // Use primary color for cuisine
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.textMuted || '#666',
  },
  // Title for the screen (optional, if you re-add it)
  title: {
    fontSize: 24, // Original title was 20
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20, // Space below title if search bar is at top
  },
}); 