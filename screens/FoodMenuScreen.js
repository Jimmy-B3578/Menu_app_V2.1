import React, { useState, useEffect, useRef } from 'react'; // Import hooks and useRef
import {
  View,
  Text,
  FlatList, // Import FlatList
  TouchableOpacity, // Import TouchableOpacity
  Modal, // Import Modal
  TextInput, // Import TextInput
  Button, // Import Button
  Alert, // Import Alert for now
  KeyboardAvoidingView, // <<< Import
  Platform,             // <<< Import
  ActionSheetIOS,       // <<< Import (iOS only for now)
  StyleSheet,           // <<< Import (for local styles if needed)
  ActivityIndicator
} from 'react-native';
import { styles } from '../styles/FoodMenuScreenStyles';
import { colors } from '../styles/themes'; // Import colors
import uuid from 'react-native-uuid'; // <<< Import uuid for unique IDs
import axios from 'axios'; // Import axios for API calls
import { useUser } from '../context/UserContext'; // <<< Import useUser hook

// --- Add Item Modal Component (Modified for Editing) ---
const AddItemModal = ({ visible, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price ? String(initialData.price) : ''); // Ensure price is a string for TextInput
      setDescription(initialData.description || '');
      setIsEditMode(true);
    } else {
      setName('');
      setPrice('');
      setDescription('');
      setIsEditMode(false);
    }
  }, [initialData, visible]); // Re-run if initialData or visibility changes

  const handleSave = () => {
    if (!name.trim() || !price.trim()) {
        Alert.alert('Missing Information', 'Please enter at least a name and price.');
        return;
    }
    // Price validation: allow numbers, and optionally a single decimal point
    if (!/^[0-9]*\.?[0-9]+$/.test(price) && !/^[0-9]+$/.test(price)) {
        Alert.alert('Invalid Price', 'Please enter a valid number for the price (e.g., 10 or 9.99).');
        return;
    }
    onSave({ name, price: parseFloat(price), description }); // Convert price to float before saving
  };

  const handleClose = () => {
    // Resetting state is now primarily handled by useEffect when initialData changes or modal closes
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose} // Use modified handleClose
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditMode ? 'Edit Menu Item' : 'Add Menu Item'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Item Name*" value={name} onChangeText={setName}
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Price*" value={price} onChangeText={setPrice}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={[styles.input, styles.inputDescription]}
              placeholder="Description (Optional)" value={description} onChangeText={setDescription}
              multiline
              placeholderTextColor={colors.textSecondary}
            />
            <View style={styles.modalButtonRow}>
              <Button title="Cancel" onPress={handleClose} color={colors.error || '#dc3545'} />
              <Button title={isEditMode ? 'Save Changes' : 'Save Item'} onPress={handleSave} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// --- Add Header Modal Component ---
const AddHeaderModal = ({ visible, onClose, onSave }) => {
    const [title, setTitle] = useState('');

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert('Missing Information', 'Please enter a header title.');
            return;
        }
        onSave({ title });
        setTitle(''); onClose();
    };

    const handleClose = () => {
      setTitle(''); onClose();
    }

    return (
         <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
           <KeyboardAvoidingView
             behavior={Platform.OS === "ios" ? "padding" : "height"}
             style={styles.keyboardAvoidingContainer}
           >
             <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add Menu Header</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Header Title*" value={title} onChangeText={setTitle}
                        placeholderTextColor={colors.textSecondary}
                    />
                    <View style={styles.modalButtonRow}>
                       <Button title="Cancel" onPress={handleClose} color={colors.error || '#dc3545'} />
                       <Button title="Save Header" onPress={handleSave} />
                    </View>
                </View>
             </View>
          </KeyboardAvoidingView>
        </Modal>
    );
};


// --- Main Screen Component ---
export default function FoodMenuScreen({ route, navigation }) {
  const { businessId, businessName, pinCreatorId } = route.params || {}; // <<< Get pinCreatorId
  const currentUser = useUser(); // <<< Get current user from context

  // State for the menu structure
  const [menuStructure, setMenuStructure] = useState([]); // Array of {id, type, ...data}
  const [isLoading, setIsLoading] = useState(false); // For fetching existing menu later
  const [error, setError] = useState(null);

  // State for modals
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [isAddHeaderModalVisible, setIsAddHeaderModalVisible] = useState(false);
  const [editingItemData, setEditingItemData] = useState(null); // <<< For storing item being edited and its index

  // <<< State for Insertion Logic >>>
  const [itemModalSaveHandler, setItemModalSaveHandler] = useState(() => handleSaveNewItem);
  const [headerModalSaveHandler, setHeaderModalSaveHandler] = useState(() => handleSaveNewHeader);

  // <<< Determine Edit Permissions >>>
  const canEdit = currentUser && 
                  pinCreatorId && 
                  (currentUser._id === pinCreatorId || currentUser.role === 'admin');

  // <<< Add useEffect to fetch existing menu >>>
  useEffect(() => {
    const fetchMenu = async () => {
      if (!businessId) {
        setError("No Business ID provided.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/pins/${businessId}/foodMenu`;
        console.log("Fetching food menu from:", apiUrl);
        const response = await axios.get(apiUrl);
        setMenuStructure(response.data || []);
      } catch (err) {
        console.error("Failed to fetch food menu:", err.response ? err.response.data : err.message);
        setError("Could not load menu.");
        setMenuStructure([]); // Set to empty on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [businessId]); // Fetch when businessId changes

  // --- Save Handlers (Regular Add to End) ---
  const handleSaveNewItem = (itemData) => {
    handleSaveItem(itemData); // Defaults to appending
  };

  const handleSaveNewHeader = (headerData) => {
    handleSaveHeader(headerData); // Defaults to appending
  };

  // --- Generalized Save/Insert Logic with API Call ---
  const saveMenuToApi = async (updatedStructure) => {
    console.log('[FoodMenuScreen] saveMenuToApi called with updatedStructure:', updatedStructure);
    console.log('[FoodMenuScreen] saveMenuToApi - Business ID:', businessId);

    if (!businessId) {
      Alert.alert("Error", "Cannot save menu: Business ID is missing.");
      return false; // Indicate failure
    }
    setIsLoading(true); // Indicate saving process
    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/pins/${businessId}/menu`;
      await axios.put(apiUrl, {
        menuType: 'food',
        menuData: updatedStructure
      });
      console.log("Food menu saved successfully for pin:", businessId);
      return true; // Indicate success
    } catch (err) {
      console.error("Failed to save food menu:", err.response ? err.response.data : err.message);
      Alert.alert("Save Failed", "Could not save menu changes to the server.");
      setError("Failed to save menu."); // Optionally show persistent error
      return false; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItem = async (itemData, index = null) => {
    const newItem = { id: uuid.v4(), type: 'item', ...itemData };
    let optimisticStructure = [];

    setMenuStructure(prev => {
      const newStructure = [...prev];
      if (index !== null && index >= 0 && index <= newStructure.length) {
        newStructure.splice(index, 0, newItem);
      } else {
        newStructure.push(newItem);
      }
      optimisticStructure = newStructure; // Store the new structure for API call
      return newStructure; // Update UI immediately
    });
    setIsAddItemModalVisible(false); // <<< ADD THIS to close modal after initiating save
    resetModalSaveHandlers(); // <<< ENSURE this is called to clear any edit state/handler
    
    // Attempt to save the updated structure to the backend
    const success = await saveMenuToApi(optimisticStructure);
    if (!success) {
      // Optional: Revert UI if save failed (more complex state management might be needed)
      console.log("Save failed, UI might be out of sync with backend.");
      // Consider refetching or implementing a revert mechanism
    }
  };

   const handleSaveHeader = async (headerData, index = null) => {
    const newHeader = { id: uuid.v4(), type: 'header', ...headerData };
    let optimisticStructure = [];

     setMenuStructure(prev => {
      const newStructure = [...prev];
      if (index !== null && index >= 0 && index <= newStructure.length) {
        newStructure.splice(index, 0, newHeader);
      } else {
        newStructure.push(newHeader);
      }
       optimisticStructure = newStructure;
      return newStructure;
    });
    setIsAddHeaderModalVisible(false); // <<< ADD THIS
    resetModalSaveHandlers(); // <<< ENSURE this is called

    const success = await saveMenuToApi(optimisticStructure);
     if (!success) {
        console.log("Save failed, UI might be out of sync with backend.");
    }
  };

  // --- Modal Opening / Context Menu ---
  const openAddItemModal = (onSaveHandler = handleSaveNewItem, editData = null) => {
    setItemModalSaveHandler(() => onSaveHandler); // Set the correct save handler
    setEditingItemData(editData); // Set editing item data if provided
    setIsAddItemModalVisible(true);
  };

  const openAddHeaderModal = (onSaveHandler = handleSaveNewHeader) => {
    setHeaderModalSaveHandler(() => onSaveHandler); // Set the correct save handler
    setIsAddHeaderModalVisible(true);
  };

  // Reset modal handlers to default (append)
  const resetModalSaveHandlers = () => {
    setItemModalSaveHandler(() => handleSaveNewItem); // Default to adding new item
    setHeaderModalSaveHandler(() => handleSaveNewHeader);
    setEditingItemData(null); // <<< Clear editing item data when modals are reset
  };

  const handlePressEditItem = (itemToEdit, index) => {
    setEditingItemData({ ...itemToEdit, originalIndex: index });
    // Set the save handler for the AddItemModal to handle an update
    setItemModalSaveHandler(() => (updatedData) => handleSaveEditedItem(updatedData));
    setIsAddItemModalVisible(true);
  };

  const handleSaveEditedItem = async (updatedData) => {
    console.log('[FoodMenuScreen] handleSaveEditedItem called with updatedData:', updatedData);
    console.log('[FoodMenuScreen] current editingItemData:', editingItemData);

    if (!editingItemData) {
      console.error('[FoodMenuScreen] handleSaveEditedItem: editingItemData is null!');
      return;
    }

    const { originalIndex } = editingItemData;
    let optimisticStructure = [];

    setMenuStructure(prev => {
      const newStructure = [...prev];
      // Ensure type and id are preserved, update other fields from modal
      newStructure[originalIndex] = {
        ...newStructure[originalIndex], // Keeps original id and type
        name: updatedData.name,
        price: updatedData.price,
        description: updatedData.description,
      };
      optimisticStructure = newStructure;
      return newStructure;
    });

    setIsAddItemModalVisible(false); // Close modal first
    resetModalSaveHandlers(); // Reset save handlers and editingItemData

    console.log('[FoodMenuScreen] Attempting to save edited menu to API with optimisticStructure:', optimisticStructure);
    const success = await saveMenuToApi(optimisticStructure);
    if (!success) {
      console.log("[FoodMenuScreen] Failed to save edited item to API. UI might be out of sync.");
      // Consider error handling or reverting UI
    }
  };

  const handlePressDeleteItem = (itemToDelete, index) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            let optimisticStructure = [];
            setMenuStructure(prev => {
              const newStructure = [...prev];
              newStructure.splice(index, 1);
              optimisticStructure = newStructure;
              return newStructure;
            });
            const success = await saveMenuToApi(optimisticStructure);
            if (!success) {
              console.log("Failed to delete item from API. UI might be out of sync.");
              // Consider error handling or reverting UI
            }
          },
        },
      ]
    );
  };

  // --- Long Press Context Menu ---
  const showContextMenu = (item, index) => {
    if (!canEdit) return; // Only show context menu if user can edit

    // Options for items
    const itemOptions = [
      'Add Item Above',
      'Add Item Below',
      'Add Header Above',
      'Add Header Below',
      'Edit Item',         // <<< New Option
      'Delete Item',       // <<< New Option
      'Cancel',
    ];
    const itemCancelButtonIndex = itemOptions.length - 1;
    const itemDestructiveButtonIndex = itemOptions.length - 2; // Delete Item is destructive

    // Options for headers (no edit/delete for headers for now as per current scope)
    const headerOptions = [
      'Add Item Above',
      'Add Item Below',
      'Add Header Above',
      'Add Header Below',
      'Cancel',
    ];
    const headerCancelButtonIndex = headerOptions.length - 1;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: item.type === 'item' ? itemOptions : headerOptions,
          cancelButtonIndex: item.type === 'item' ? itemCancelButtonIndex : headerCancelButtonIndex,
          destructiveButtonIndex: item.type === 'item' ? itemDestructiveButtonIndex : undefined,
          title: item.type === 'item' ? item.name : item.title, // Show item/header name as title
          message: item.type === 'item' ? `Price: ${item.price}` : 'Menu Header'
        },
        (buttonIndex) => {
          if (item.type === 'item') {
            if (buttonIndex === itemCancelButtonIndex) return; // Cancel
            if (buttonIndex === 0) { // Add Item Above
              resetModalSaveHandlers();
              setItemModalSaveHandler(() => (itemData) => handleSaveItem(itemData, index));
              setIsAddItemModalVisible(true);
            } else if (buttonIndex === 1) { // Add Item Below
              resetModalSaveHandlers();
              setItemModalSaveHandler(() => (itemData) => handleSaveItem(itemData, index + 1));
              setIsAddItemModalVisible(true);
            } else if (buttonIndex === 2) { // Add Header Above
              resetModalSaveHandlers();
              setHeaderModalSaveHandler(() => (headerData) => handleSaveHeader(headerData, index));
              setIsAddHeaderModalVisible(true);
            } else if (buttonIndex === 3) { // Add Header Below
              resetModalSaveHandlers();
              setHeaderModalSaveHandler(() => (headerData) => handleSaveHeader(headerData, index + 1));
              setIsAddHeaderModalVisible(true);
            } else if (buttonIndex === 4) { // Edit Item
              handlePressEditItem(item, index);
            } else if (buttonIndex === 5) { // Delete Item
              handlePressDeleteItem(item, index);
            }
          } else { // Header actions
            if (buttonIndex === headerCancelButtonIndex) return; // Cancel
            // ... existing header actions, ensure indices match
            if (buttonIndex === 0) { // Add Item Above Header
                resetModalSaveHandlers();
                setItemModalSaveHandler(() => (itemData) => handleSaveItem(itemData, index));
                setIsAddItemModalVisible(true);
            } else if (buttonIndex === 1) { // Add Item Below Header
                resetModalSaveHandlers();
                setItemModalSaveHandler(() => (itemData) => handleSaveItem(itemData, index + 1));
                setIsAddItemModalVisible(true);
            } else if (buttonIndex === 2) { // Add Header Above Header
                resetModalSaveHandlers();
                setHeaderModalSaveHandler(() => (headerData) => handleSaveHeader(headerData, index));
                setIsAddHeaderModalVisible(true);
            } else if (buttonIndex === 3) { // Add Header Below Header
                resetModalSaveHandlers();
                setHeaderModalSaveHandler(() => (headerData) => handleSaveHeader(headerData, index + 1));
                setIsAddHeaderModalVisible(true);
            }
          }
        }
      );
    } else {
      // Android: Basic Alert for now, can be replaced with a custom modal later
      // For items, include Edit/Delete
      let androidActions = [
        { text: "Add Item Above", onPress: () => { /* ... setup and open modal ... */ } },
        { text: "Add Item Below", onPress: () => { /* ... setup and open modal ... */ } },
        { text: "Add Header Above", onPress: () => { /* ... setup and open modal ... */ } },
        { text: "Add Header Below", onPress: () => { /* ... setup and open modal ... */ } },
      ];
      if (item.type === 'item') {
        androidActions.push({ text: "Edit Item", onPress: () => handlePressEditItem(item, index) });
        androidActions.push({ text: "Delete Item", onPress: () => handlePressDeleteItem(item, index), style: "destructive" });
      }
      androidActions.push({ text: "Cancel", style: "cancel" });

      Alert.alert(
        item.type === 'item' ? item.name : item.title,
        item.type === 'item' ? `Price: ${item.price}` : 'Menu Header',
        androidActions,
        { cancelable: true }
      );
      // TODO: For Android, fully implement the modal opening logic for Add Above/Below as done for iOS.
      // For brevity, the detailed setup of setItemModalSaveHandler and setIsAddItemModalVisible is omitted here
      // but should mirror the iOS implementation for each "Add..." action.
      // Example for "Add Item Above" on Android:
      // { text: "Add Item Above", onPress: () => { 
      //     resetModalSaveHandlers(); 
      //     setItemModalSaveHandler(() => (itemData) => handleSaveItem(itemData, index)); 
      //     setIsAddItemModalVisible(true); 
      //   }
      // },
    }
  };

  // --- Render Function for FlatList ---
  const renderMenuItem = ({ item, index }) => {
    const itemSpecificStyle = item.type === 'header' ? styles.headerItem : styles.menuItem;
    // Only allow long press if user can edit
    const longPressHandler = canEdit ? () => showContextMenu(item, index) : undefined;

    return (
      <TouchableOpacity 
        onLongPress={longPressHandler} 
        disabled={!canEdit} // Disable long press feedback if not editable
      >
        {item.type === 'header' ? (
          <View style={itemSpecificStyle}>
            <Text style={styles.headerText}>{item.title}</Text>
          </View>
        ) : item.type === 'item' ? (
          <View style={itemSpecificStyle}>
            <View style={styles.menuItemMain}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              {item.description ? <Text style={styles.menuItemDescription}>{item.description}</Text> : null}
            </View>
            <Text style={styles.menuItemPrice}>${parseFloat(item.price).toFixed(2)}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  // --- Main Render Logic ---
  if (isLoading) {
    return (
        <View style={styles.loadingContainerFullScreen}> 
            <ActivityIndicator size="large" color={colors.primary || '#0000ff'} />
        </View>
    );
  }

  // Basic error display (could be improved)
  if (error && menuStructure.length === 0) { // Only show full screen error if list is empty
     return (
        <View style={styles.errorContainerFullScreen}> 
            <Text style={styles.errorText}>{error}</Text>
            {/* TODO: Add a retry button? */}
        </View>
    );
  }

  return (
    <View style={styles.container}>
        {/* Conditionally Render Add Buttons */}
        {canEdit && (
          <View style={styles.addButtonsContainer}>
               <TouchableOpacity style={styles.addButton} onPress={() => openAddItemModal()}> 
                   <Text style={styles.addButtonText}>+ Add Menu Item</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.addButton} onPress={() => openAddHeaderModal()}> 
                   <Text style={styles.addButtonText}>+ Add Header</Text>
               </TouchableOpacity>
          </View>
        )}

        {/* Menu List */}
        <FlatList
            data={menuStructure}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={
                // Show placeholder only if not loading and no error prevented initial load
                !isLoading && !error ? (
                     <Text style={styles.placeholderText}>No menu items added yet.</Text>
                ) : null
            }
            contentContainerStyle={styles.listContentContainer}
        />

        {/* Modals (Rendered regardless, but opened only if canEdit allows buttons/actions) */}
        <AddItemModal
            visible={isAddItemModalVisible}
            onClose={() => {
              setIsAddItemModalVisible(false);
              resetModalSaveHandlers(); 
            }}
            onSave={(dataFromModal) => {
              console.log('[FoodMenuScreen] AddItemModal onSave - checking editingItemData:', editingItemData);
              if (editingItemData) {
                handleSaveEditedItem(dataFromModal);
              } else {
                // For new items (including above/below via insertionIndexRef)
                handleSaveItem(dataFromModal, insertionIndexRef.current);
                insertionIndexRef.current = null; // Reset after use
              }
            }}
            initialData={editingItemData}
        />
         <AddHeaderModal
            visible={isAddHeaderModalVisible}
            onClose={() => {
              setIsAddHeaderModalVisible(false);
              resetModalSaveHandlers();
            }}
            onSave={headerModalSaveHandler} // <<< Use state handler
        />
    </View>
  );
} 