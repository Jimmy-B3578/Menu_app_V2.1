import { StyleSheet } from 'react-native';
import { colors } from './themes';

export const styles = StyleSheet.create({
  // Main container for the screen (now using SafeAreaView)
  container: {
    flex: 1, // Take up all available space
    // Removed justifyContent and alignItems to allow natural stacking
    backgroundColor: colors.background || '#f5f5f5', 
    // Padding is handled by SafeAreaView and list content container
  },
  // Header container View that holds the static title
  headerContainer: {
    paddingTop: 20, // Adjust top padding as needed (was title marginTop)
    paddingBottom: 15, // Adjust bottom padding (was title marginBottom)
    paddingHorizontal: 15, // Horizontal padding
    backgroundColor: colors.background || '#f5f5f5', // Match container background or set a specific header color
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Android Shadow
    elevation: 4,
  },
  // Style for the main title text (now inside headerContainer)
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: colors.text || '#333', 
    textAlign: 'center',
    // Removed marginTop and marginBottom, handled by headerContainer padding
    // marginTop: 20, 
    // marginBottom: 15, 
    // paddingHorizontal: 15,
  },
  // --- List Styles ---
  // Style for the FlatList component itself
  list: {
    flex: 1, // Make the list take remaining vertical space
  },
  listContentContainer: {
    paddingVertical: 10, // Padding inside the list
    paddingHorizontal: 15,
  },
  businessCard: {
    backgroundColor: colors.cardBackground || '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10, // Space between cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text || '#333',
  },
  cardDescription: { // Style for description (if added later)
    fontSize: 14,
    color: colors.textSecondary || '#666',
    marginTop: 4,
  },
  cardHeader: {
    flexDirection: 'row', // Arrange name and suburb horizontally
    justifyContent: 'space-between', // Push name to left, suburb to right
    alignItems: 'center', // Align items vertically if they have different heights
    marginBottom: 5, // Add some space below the header row
  },
  cardSuburb: {
    fontSize: 14, // Smaller font size
    color: colors.textSecondary || '#666', // Lighter color
    marginLeft: 10, // Add space between name and suburb
  },
  cardDetailsRow: {
    flexDirection: 'row', // Arrange children horizontally
    justifyContent: 'flex-end', // Push content (rating) to the right
    marginTop: 5, // Space above this row
  },
  cardRatingContainer: {
    // Container for stars, already pushed right by cardDetailsRow
  },
  starText: {
    fontSize: 16,
    color: colors.warning || '#FFD700', // Gold color for stars
  },
  // --- Loading/Error/Empty Styles ---
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background || '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background || '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: colors.error || '#dc3545', // Use theme error color or red
    textAlign: 'center',
  },
  emptyListContainer: {
    flex: 1, // Needed for centering within FlatList sometimes
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50, // Add some top margin
  },
  emptyListText: {
    fontSize: 16,
    color: colors.textSecondary || '#666',
  },
  // Add other styles below as needed
});
