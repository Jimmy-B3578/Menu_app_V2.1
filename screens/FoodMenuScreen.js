import React, { useState, useEffect } from 'react'; // Import hooks
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
  StyleSheet            // <<< Import (for local styles if needed)
} from 'react-native';
import { styles } from '../styles/FoodMenuScreenStyles';
import { colors } from '../styles/themes'; // Import colors
import uuid from 'react-native-uuid'; // <<< Import uuid for unique IDs

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
export default function FoodMenuScreen({ route, navigation }) {
  const { businessId, businessName } = route.params || {};

  // State for the menu structure
  const [menuStructure, setMenuStructure] = useState([]); // Array of {id, type, ...data}
  const [isLoading, setIsLoading] = useState(false); // For fetching existing menu later
  const [error, setError] = useState(null);

  // State for modals
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [isAddHeaderModalVisible, setIsAddHeaderModalVisible] = useState(false);

  // <<< State for Insertion Logic >>>
  const [itemModalSaveHandler, setItemModalSaveHandler] = useState(() => handleSaveNewItem);
  const [headerModalSaveHandler, setHeaderModalSaveHandler] = useState(() => handleSaveNewHeader);

  // TODO: useEffect to fetch existing menu for businessId

  // --- Save Handlers (Regular Add to End) ---
  const handleSaveNewItem = (itemData) => {
    handleSaveItem(itemData); // Defaults to appending
  };

  const handleSaveNewHeader = (headerData) => {
    handleSaveHeader(headerData); // Defaults to appending
  };

  // --- Generalized Save/Insert Logic ---
  const handleSaveItem = (itemData, index = null) => {
    const newItem = { id: uuid.v4(), type: 'item', ...itemData };
    setMenuStructure(prev => {
      const newStructure = [...prev];
      if (index !== null && index >= 0 && index <= newStructure.length) {
        console.log(`Inserting item at index ${index}`);
        newStructure.splice(index, 0, newItem); // Insert at index
      } else {
        console.log("Appending item to end");
        newStructure.push(newItem); // Append to end
      }
      return newStructure;
    });
    // TODO: API call to save update (passing index if applicable)
    resetModalSaveHandlers(); // Reset handlers after save
  };

   const handleSaveHeader = (headerData, index = null) => {
    const newHeader = { id: uuid.v4(), type: 'header', ...headerData };
     setMenuStructure(prev => {
      const newStructure = [...prev];
      if (index !== null && index >= 0 && index <= newStructure.length) {
         console.log(`Inserting header at index ${index}`);
        newStructure.splice(index, 0, newHeader); // Insert at index
      } else {
         console.log("Appending header to end");
        newStructure.push(newHeader); // Append to end
      }
      return newStructure;
    });
    // TODO: API call to save update (passing index if applicable)
    resetModalSaveHandlers(); // Reset handlers after save
  };

  // --- Modal Opening / Context Menu ---
  const openAddItemModal = (onSaveHandler = handleSaveNewItem) => {
    setItemModalSaveHandler(() => onSaveHandler); // Set the correct save handler
    setIsAddItemModalVisible(true);
  };

  const openAddHeaderModal = (onSaveHandler = handleSaveNewHeader) => {
    setHeaderModalSaveHandler(() => onSaveHandler); // Set the correct save handler
    setIsAddHeaderModalVisible(true);
  };

  // Reset modal handlers to default (append)
  const resetModalSaveHandlers = () => {
      setItemModalSaveHandler(() => handleSaveNewItem);
      setHeaderModalSaveHandler(() => handleSaveNewHeader);
  }

  // --- Long Press Context Menu ---
  const showContextMenu = (item, index) => {
    // Note: ActionSheetIOS is iOS only. Need custom modal for Android/cross-platform.
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Add Item Above', 'Add Item Below', 'Add Header Above', 'Add Header Below'],
          cancelButtonIndex: 0,
          // destructiveButtonIndex: ?, // Optional for delete
        },
        (buttonIndex) => {
          const insertionIndexAbove = index;
          const insertionIndexBelow = index + 1;

          if (buttonIndex === 1) { // Add Item Above
            openAddItemModal((itemData) => handleSaveItem(itemData, insertionIndexAbove));
          } else if (buttonIndex === 2) { // Add Item Below
            openAddItemModal((itemData) => handleSaveItem(itemData, insertionIndexBelow));
          } else if (buttonIndex === 3) { // Add Header Above
             openAddHeaderModal((headerData) => handleSaveHeader(headerData, insertionIndexAbove));
          } else if (buttonIndex === 4) { // Add Header Below
            openAddHeaderModal((headerData) => handleSaveHeader(headerData, insertionIndexBelow));
          }
          // If buttonIndex is 0 (Cancel) or undefined, do nothing
        }
      );
    } else {
      // Basic Alert for Android/Other platforms as fallback
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
    // Wrap item in TouchableOpacity for long press
    return (
      <TouchableOpacity onLongPress={() => showContextMenu(item, index)}>
        {item.type === 'header' ? (
          <View style={styles.headerItem}>
            <Text style={styles.headerText}>{item.title}</Text>
          </View>
        ) : item.type === 'item' ? (
          <View style={styles.menuItem}>
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

  return (
    <View style={styles.container}>
        {/* Add Buttons Container */}
        <View style={styles.addButtonsContainer}>
             <TouchableOpacity style={styles.addButton} onPress={() => openAddItemModal()}> 
                 <Text style={styles.addButtonText}>+ Add Menu Item</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.addButton} onPress={() => openAddHeaderModal()}> 
                 <Text style={styles.addButtonText}>+ Add Header</Text>
             </TouchableOpacity>
        </View>

        {/* Menu List */}
        <FlatList
            data={menuStructure}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={
                <Text style={styles.placeholderText}>No menu items added yet.</Text>
            }
            contentContainerStyle={styles.listContentContainer}
        />

        {/* Modals - Pass the dynamic save handler */}
        <AddItemModal
            visible={isAddItemModalVisible}
            onClose={() => { setIsAddItemModalVisible(false); resetModalSaveHandlers(); }}
            onSave={itemModalSaveHandler} // <<< Use state handler
        />
         <AddHeaderModal
            visible={isAddHeaderModalVisible}
            onClose={() => { setIsAddHeaderModalVisible(false); resetModalSaveHandlers(); }}
            onSave={headerModalSaveHandler} // <<< Use state handler
        />
    </View>
  );
} 