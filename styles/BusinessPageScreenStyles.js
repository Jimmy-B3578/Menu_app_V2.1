import { StyleSheet, Platform, StatusBar } from 'react-native';
import { colors } from './themes';

export const styles = StyleSheet.create({
  // Main container for the screen (now using SafeAreaView)
  container: {
    flex: 1, // Take up all available space
    // Removed justifyContent and alignItems to allow natural stacking
    backgroundColor: colors.background || '#f5f5f5', 
    // Padding is handled by SafeAreaView and list content container
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  // Header container View that holds the static title
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 25,
    paddingBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: colors.background || '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    position: 'relative',
  },
  // Style for the main title text (now inside headerContainer)
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: colors.text || '#333', 
    textAlign: 'center',
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
    color: colors.textMuted || '#6c757d',
    textAlign: 'center',
  },
  // --- Detail View Specific Styles ---
  detailScrollView: {
    // flex: 1, // Removed: Should naturally fill space below header in a flex container
  },
  detailMapContainer: {
    height: 200, // Fixed height for the map section
    backgroundColor: colors.mapBackground || '#e0e0e0', // Placeholder color
    position: 'relative', // Needed for absolute positioning of directions button
  },
  detailMap: {
    ...StyleSheet.absoluteFillObject, // Make map fill container
  },
  detailMapPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mapBackground || '#e0e0e0',
  },
  directionsButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colors.primary || '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row', // Icon and text side-by-side
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  directionsButtonText: {
    color: colors.buttonText || '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5, // Space between icon and text
  },
  infoCard: {
    backgroundColor: colors.cardBackground || '#ffffff',
    padding: 16,
    margin: 15, // Margin around the card
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  businessHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailBusinessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text || '#333',
    flex: 1, // Allow name to take available space but shrink if needed
    marginRight: 10, // Add space between name and rating
  },
  detailSuburb: {
    fontSize: 16,
    color: colors.textSecondary || '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  detailRatingContainer: {
    alignItems: 'flex-end', // Align to the right
  },
  detailReviewCount: {
    fontSize: 14,
    color: colors.textSecondary || '#666',
    marginTop: 2, // Space between stars and review count
  },
  detailDescription: {
    fontSize: 16,
    color: colors.text || '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  detailActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#eee',
  },
  detailActionButton: {
    alignItems: 'center',
    padding: 5,
  },
  detailActionText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.primary || '#007AFF',
  },
  sectionCard: {
    backgroundColor: colors.cardBackground || '#ffffff',
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text || '#333',
    marginBottom: 12,
  },
  hoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  dayText: {
    fontSize: 14,
    color: colors.text || '#444',
  },
  hoursText: {
    fontSize: 14,
    color: colors.textSecondary || '#666',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    backgroundColor: colors.tagBackground || '#eef',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 13,
    color: colors.tagText || colors.primary || '#007AFF',
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#eee',
    paddingVertical: 10,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewAuthor: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text || '#333',
  },
  reviewText: {
    fontSize: 14,
    color: colors.text || '#555',
    lineHeight: 18,
  },
  noReviewsText: {
    fontSize: 14,
    color: colors.textSecondary || '#888',
    fontStyle: 'italic',
  },
  detailSpacer: {
    height: 30, // Add space at the very bottom of the ScrollView
  },
  // --- Header adjustments ---
  backButton: {
    padding: 5, // Clickable area
    position: 'absolute', // Position independently
    left: 15, // Distance from left
    top: 0, // Align with top of headerContainer padding
    bottom: 0,
    justifyContent: 'center',
  },
  headerSpacer: { // Empty view to help center title when back button is present
    width: 34, // Approx width of back button + padding
  },
  // Add fullscreen versions of loading/error for when detail view fails
  loadingContainerFullScreen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background || '#f5f5f5',
  },
  errorContainerFullScreen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.background || '#f5f5f5',
  },
  deleteButton: {
    backgroundColor: colors.danger || '#dc3545', // Standard delete color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10, // Margin within its section card
    marginHorizontal: 15, // Match sectionCard padding
  },
  deleteButtonDisabled: {
    backgroundColor: colors.errorMuted || '#efa6ad', // Lighter red when disabled
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // New styles for Admin Actions section
  adminActionsCard: {
    backgroundColor: colors.cardBackground || '#ffffff',
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10, // Space between admin buttons
    elevation: 2,
  },
  adminButtonIcon: {
    marginRight: 10,
  },
  adminButtonText: {
    color: colors.white || '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: colors.info || '#17a2b8', // A distinct color for edit
  },
});
