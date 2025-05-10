import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActionSheetIOS,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { styles } from '../styles/DrinksMenuScreenStyles';
import { colors } from '../styles/themes';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { useUser } from '../context/UserContext';

// --- Add Item Modal Component ---
const AddItemModal = ({ visible, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name.trim() || !price.trim()) {
        Alert.alert('Missing Information', 'Please enter at least a name and price.');
        return;
    }
    if (isNaN(parseFloat(price))) {
        Alert.alert('Invalid Price', 'Please enter a valid number for the price.');
        return;
    }
    onSave({ name, price, description });
    setName(''); setPrice(''); setDescription(''); onClose();
  };

  const handleClose = () => {
    setName(''); setPrice(''); setDescription(''); onClose();
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
            <Text style={styles.modalTitle}>Add Menu Item</Text>
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
              <Button title="Save Item" onPress={handleSave} />
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
export default function DrinksMenuScreen({ route, navigation }) {
  const { businessId, businessName, pinCreatorId, selectedItem } = route.params || {};
  const currentUser = useUser();

  // State for the menu structure
  const [menuStructure, setMenuStructure] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightedItemId, setHighlightedItemId] = useState(null);

  // State for modals
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [isAddHeaderModalVisible, setIsAddHeaderModalVisible] = useState(false);

  // State for Insertion Logic
  const [itemModalSaveHandler, setItemModalSaveHandler] = useState(() => handleSaveNewItem);
  const [headerModalSaveHandler, setHeaderModalSaveHandler] = useState(() => handleSaveNewHeader);

  // Determine Edit Permissions
  const canEdit = currentUser && 
                  pinCreatorId && 
                  (currentUser._id === pinCreatorId || currentUser.role === 'admin');

  // Add useEffect to fetch existing menu
  useEffect(() => {
    const fetchMenu = async () => {
      if (!businessId) {
        setError("No Business ID provided.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        // Use drinksMenu endpoint
        const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/pins/${businessId}/drinksMenu`; 
        console.log("Fetching drinks menu from:", apiUrl);
        const response = await axios.get(apiUrl);
        setMenuStructure(response.data || []);
      } catch (err) {
        console.error("Failed to fetch drinks menu:", err.response ? err.response.data : err.message);
        setError("Could not load menu.");
        setMenuStructure([]); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [businessId]);

  // Add useEffect to find and highlight the selected item
  useEffect(() => {
    if (selectedItem && menuStructure.length > 0) {
      const itemToHighlight = menuStructure.find(item => 
        item.type === 'item' && 
        item.name === selectedItem.name && 
        item.description === selectedItem.description
      );
      if (itemToHighlight) {
        setHighlightedItemId(itemToHighlight.id);
        // Scroll to the item after a short delay to ensure the list is rendered
        setTimeout(() => {
          const index = menuStructure.findIndex(item => item.id === itemToHighlight.id);
          if (index !== -1) {
            listRef.current?.scrollToIndex({ index, animated: true });
          }
        }, 100);
      }
    }
  }, [selectedItem, menuStructure]);

  // Add ref for the FlatList
  const listRef = useRef(null);

  // --- Save Handlers (Regular Add to End) ---
  const handleSaveNewItem = (itemData) => {
    handleSaveItem(itemData);
  };

  const handleSaveNewHeader = (headerData) => {
    handleSaveHeader(headerData);
  };

  // --- Generalized Save/Insert Logic with API Call ---
  const saveMenuToApi = async (updatedStructure) => {
    if (!businessId) {
      Alert.alert("Error", "Cannot save menu: Business ID is missing.");
      return false; 
    }
    setIsLoading(true); 
    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/pins/${businessId}/menu`;
      await axios.put(apiUrl, {
        menuType: 'drinks', // Set menuType to drinks
        menuData: updatedStructure
      });
      console.log("Drinks menu saved successfully for pin:", businessId);
      return true; 
    } catch (err) {
      console.error("Failed to save drinks menu:", err.response ? err.response.data : err.message);
      Alert.alert("Save Failed", "Could not save menu changes to the server.");
      setError("Failed to save menu."); 
      return false; 
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
      optimisticStructure = newStructure; 
      return newStructure;
    });
    resetModalSaveHandlers();
    const success = await saveMenuToApi(optimisticStructure);
    if (!success) {
      console.log("Save failed, UI might be out of sync with backend.");
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
    resetModalSaveHandlers();
    const success = await saveMenuToApi(optimisticStructure);
     if (!success) {
        console.log("Save failed, UI might be out of sync with backend.");
    }
  };

  // --- Modal Opening / Context Menu ---
  const openAddItemModal = (onSaveHandler = handleSaveNewItem) => {
    setItemModalSaveHandler(() => onSaveHandler);
    setIsAddItemModalVisible(true);
  };

  const openAddHeaderModal = (onSaveHandler = handleSaveNewHeader) => {
    setHeaderModalSaveHandler(() => onSaveHandler);
    setIsAddHeaderModalVisible(true);
  };

  const resetModalSaveHandlers = () => {
      setItemModalSaveHandler(() => handleSaveNewItem);
      setHeaderModalSaveHandler(() => handleSaveNewHeader);
  }

  // --- Long Press Context Menu ---
  const showContextMenu = (item, index) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Add Item Above', 'Add Item Below', 'Add Header Above', 'Add Header Below'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          const insertionIndexAbove = index;
          const insertionIndexBelow = index + 1;
          if (buttonIndex === 1) openAddItemModal((itemData) => handleSaveItem(itemData, insertionIndexAbove));
          else if (buttonIndex === 2) openAddItemModal((itemData) => handleSaveItem(itemData, insertionIndexBelow));
          else if (buttonIndex === 3) openAddHeaderModal((headerData) => handleSaveHeader(headerData, insertionIndexAbove));
          else if (buttonIndex === 4) openAddHeaderModal((headerData) => handleSaveHeader(headerData, insertionIndexBelow));
        }
      );
    } else {
      Alert.alert(
          'Menu Actions',
          `What would you like to do with "${item.title || item.name}"?`,
          [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Add Item Above', onPress: () => openAddItemModal((itemData) => handleSaveItem(itemData, index)) },
              { text: 'Add Item Below', onPress: () => openAddItemModal((itemData) => handleSaveItem(itemData, index + 1)) },
              { text: 'Add Header Above', onPress: () => openAddHeaderModal((headerData) => handleSaveHeader(headerData, index)) },
              { text: 'Add Header Below', onPress: () => openAddHeaderModal((headerData) => handleSaveHeader(headerData, index + 1)) },
          ],
           { cancelable: true }
      );
    }
  };

  // --- Render Function for FlatList ---
  const renderMenuItem = ({ item, index }) => {
    const isHighlighted = item.id === highlightedItemId;
    return (
      <TouchableOpacity 
        onLongPress={canEdit ? () => showContextMenu(item, index) : null} 
        disabled={!canEdit}
      >
        {item.type === 'header' ? (
          <View style={styles.headerItem}>
            <Text style={styles.headerText}>{item.title}</Text>
          </View>
        ) : item.type === 'item' ? (
          <View style={[
            styles.menuItem,
            isHighlighted && styles.highlightedMenuItem
          ]}>
            <View style={styles.menuItemMain}>
              <Text style={[
                styles.menuItemName,
                isHighlighted && styles.highlightedMenuItemText
              ]}>{item.name}</Text>
              {item.description ? (
                <Text style={[
                  styles.menuItemDescription,
                  isHighlighted && styles.highlightedMenuItemText
                ]}>{item.description}</Text>
              ) : null}
            </View>
            <Text style={[
              styles.menuItemPrice,
              isHighlighted && styles.highlightedMenuItemText
            ]}>${parseFloat(item.price).toFixed(2)}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  // --- Main Render Logic (including loading/error) ---
  if (isLoading) {
    return (
        <View style={styles.loadingContainerFullScreen}> 
            <ActivityIndicator size="large" color={colors.primary || '#0000ff'} />
        </View>
    );
  }

  if (error && menuStructure.length === 0) {
     return (
        <View style={styles.errorContainerFullScreen}> 
            <Text style={styles.errorText}>{error}</Text>
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
            ref={listRef}
            data={menuStructure}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={
                !isLoading && !error ? (
                     <Text style={styles.placeholderText}>No menu items added yet.</Text>
                ) : null
            }
            contentContainerStyle={styles.listContentContainer}
        />

        {/* Modals (Rendered regardless, but opened only if canEdit allows buttons/actions) */}
        <AddItemModal
            visible={isAddItemModalVisible}
            onClose={() => { setIsAddItemModalVisible(false); resetModalSaveHandlers(); }}
            onSave={itemModalSaveHandler}
        />
         <AddHeaderModal
            visible={isAddHeaderModalVisible}
            onClose={() => { setIsAddHeaderModalVisible(false); resetModalSaveHandlers(); }}
            onSave={headerModalSaveHandler}
        />
    </View>
  );
} 