import { StyleSheet, Platform, StatusBar } from 'react-native';
import { colors } from './themes';

export const styles = StyleSheet.create({
  // Main container for the screen (now using SafeAreaView)
  container: {
    flex: 1, // Take up all available space
    // Removed justifyContent and alignItems to allow natural stacking
    backgroundColor: colors.background, 
    // Padding is handled by SafeAreaView and list content container
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  // Header container View that holds the static title or search bar
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 25,
    paddingBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: colors.background,
    shadowColor: colors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    position: 'relative',
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input.background,
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.card.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: colors.text.main,
    paddingRight: 30, // Space for the clear/search icon
  },
  clearSearchButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  searchIconButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: colors.text.subtext,
    marginBottom: 15,
    textAlign: 'center',
  },
  clearSearchText: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  // Style for the main title text (now inside headerContainer)
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: colors.text.main, 
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
    backgroundColor: colors.card.background,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10, // Space between cards
    shadowColor: colors.card.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.main,
  },
  cardHeader: {
    flexDirection: 'row', // Arrange name and suburb horizontally
    justifyContent: 'space-between', // Push name to left, suburb to right
    alignItems: 'center', // Align items vertically if they have different heights
    marginBottom: 5, // Add some space below the header row
  },
  cardSuburb: {
    fontSize: 14, // Smaller font size
    color: colors.text.subtext, // Lighter color
    marginLeft: 10, // Add space between name and suburb
  },
  cardDetailsRow: {
    flexDirection: 'row', // Arrange children horizontally
    justifyContent: 'flex-end', // Push content (rating) to the right
    marginTop: 5, // Space above this row
  },
  cardRatingContainer: {
    // Container for stars, already pushed right by cardDetailsRow
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardReviewCount: {
    fontSize: 12,
    color: colors.text.subtext,
    marginLeft: 5,
  },
  starText: {
    fontSize: 16,
    color: colors.warning, // Gold color for stars
  },
  // --- Loading/Error/Empty Styles ---
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.error, // Use theme error color or red
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
    color: colors.text.subtext,
    textAlign: 'center',
  },
  // --- Detail View Specific Styles ---
  detailScrollView: {
    // flex: 1, // Removed: Should naturally fill space below header in a flex container
  },
  detailMapContainer: {
    height: 200, // Fixed height for the map section
    backgroundColor: colors.background, // Placeholder color
    position: 'relative', // Needed for absolute positioning of directions button
  },
  detailMap: {
    ...StyleSheet.absoluteFillObject, // Make map fill container
  },
  detailMapPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  directionsButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row', // Icon and text side-by-side
    alignItems: 'center',
    shadowColor: colors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  directionsButtonText: {
    color: colors.button.text,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5, // Space between icon and text
  },
  infoCard: {
    backgroundColor: colors.card.background,
    padding: 16,
    margin: 15, // Margin around the card
    borderRadius: 8,
    shadowColor: colors.card.shadow,
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
    color: colors.text.main,
    flex: 1, // Allow name to take available space but shrink if needed
    marginRight: 10, // Add space between name and rating
  },
  detailSuburb: {
    fontSize: 16,
    color: colors.text.subtext,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  detailRatingContainer: {
    alignItems: 'flex-end', // Align to the right
  },
  detailReviewCount: {
    fontSize: 14,
    color: colors.text.subtext,
    marginTop: 2, // Space between stars and review count
  },
  detailDescription: {
    fontSize: 16,
    color: colors.text.main,
    lineHeight: 22,
    marginBottom: 16,
  },
  detailActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailActionButton: {
    alignItems: 'center',
    padding: 5,
  },
  detailActionText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.primary,
  },
  sectionCard: {
    backgroundColor: colors.card.background,
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: colors.card.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.main,
    marginBottom: 12,
  },
  hoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  dayText: {
    fontSize: 14,
    color: colors.text.main,
  },
  hoursText: {
    fontSize: 14,
    color: colors.text.subtext,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    backgroundColor: colors.amenity.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 13,
    color: colors.amenity.text,
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    color: colors.text.main,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.text.subtext,
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
    color: colors.text.main,
    lineHeight: 18,
  },
  reviewActionButtons: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'flex-end',
  },
  reviewActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    padding: 3,
  },
  reviewActionText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 3,
  },
  noReviewsText: {
    fontSize: 14,
    color: colors.text.subtext,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 15,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.text.subtext,
  },
  ratingFilterContainer: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: colors.text.subtext,
    marginBottom: 5,
  },
  ratingFilterScroll: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 15,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.text.main,
  },
  seeAllReviewsButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 5,
  },
  seeAllReviewsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  showLessButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 5,
  },
  showLessText: {
    fontSize: 14,
    color: colors.text.subtext,
  },
  reviewsLoader: {
    marginVertical: 20,
  },
  addReviewButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  addReviewIcon: {
    marginRight: 8,
  },
  addReviewText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInToReviewButton: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signInToReviewText: {
    color: colors.text.subtext,
    fontSize: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modal.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: colors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.main,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.main,
    marginBottom: 8,
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  ratingStar: {
    padding: 5,
  },
  reviewInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalStar: {
    fontSize: 26,
    marginHorizontal: 5,
  },
  modalStarSelected: {
    color: colors.review.star
  },
  modalStarUnselected: {
    color: colors.review.starUnselected
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: colors.modal.cancelButton,
  },
  modalSubmitButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewActionTextDanger: {
    color: colors.error,
  },
  // End of review styles
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
      backgroundColor: colors.background,
  },
  errorContainerFullScreen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.background,
  },
  deleteButton: {
    backgroundColor: colors.error, // Standard delete color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10, // Margin within its section card
    marginHorizontal: 15, // Match sectionCard padding
  },
  deleteButtonDisabled: {
    backgroundColor: colors.button.disabled, // Lighter red when disabled
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // New styles for Admin Actions section
  adminActionsCard: {
    backgroundColor: colors.card.background,
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: colors.card.shadow,
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
    color: colors.white,
  },
  adminButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: colors.secondary, // A distinct color for edit
  },
});
