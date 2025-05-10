import { StyleSheet, Platform, StatusBar } from 'react-native';
import { colors } from './themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#f5f5f5',
    // Removed centering for list view
    // justifyContent: 'center', 
    // alignItems: 'center', 
  },
  addButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.surface || '#fff', // Give buttons a background
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#eee',
  },
  addButton: {
    backgroundColor: colors.primary || '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: colors.buttonText || '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContentContainer: {
     paddingHorizontal: 15,
     paddingBottom: 20, // Add padding at the bottom
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary || '#888',
    textAlign: 'center',
    marginTop: 50, // Give it some space from the top
  },
  // Header Item Styles
  headerItem: {
      paddingVertical: 10,
      marginTop: 15, // Space above headers
      marginBottom: 5,
      borderBottomWidth: 2,
      borderBottomColor: colors.primary || '#ccc',
  },
  headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary || '#333',
  },
  // Menu Item Styles
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items to the top
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#eee',
  },
  menuItemMain: {
      flex: 1, // Allow text to take available space
      marginRight: 10, // Space between text and price
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text || '#333',
    marginBottom: 3, // Space between name and description
  },
   menuItemDescription: {
    fontSize: 13,
    color: colors.textSecondary || '#666',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary || '#007AFF',
    minWidth: 50, // Ensure price has some minimum width
    textAlign: 'right',
  },

  // Highlight styles
  highlightedMenuItem: {
    backgroundColor: colors.primary + '20', // 20 is hex for 12.5% opacity
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  highlightedMenuItemText: {
    color: colors.primary,
  },

  // --- Modal Styles ---
  keyboardAvoidingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  modalContainer: {
    width: '100%', 
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.surface || '#fff',
    padding: 25,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border || '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    color: colors.text,
  },
  inputDescription: {
      height: 80, 
      textAlignVertical: 'top',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
}); 