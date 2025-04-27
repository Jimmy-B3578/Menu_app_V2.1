import React, { useState, useEffect } from 'react';
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
  StyleSheet
} from 'react-native';
import { styles } from '../styles/DrinksMenuScreenStyles';
import { colors } from '../styles/themes';
import uuid from 'react-native-uuid';

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
  const { businessId, businessName } = route.params || {};

  // State for the menu structure
  const [menuStructure, setMenuStructure] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for modals
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [isAddHeaderModalVisible, setIsAddHeaderModalVisible] = useState(false);

  // State for Insertion Logic
  const [itemModalSaveHandler, setItemModalSaveHandler] = useState(() => handleSaveNewItem);
  const [headerModalSaveHandler, setHeaderModalSaveHandler] = useState(() => handleSaveNewHeader);

  // TODO: useEffect to fetch existing menu for businessId

  // --- Save Handlers (Regular Add to End) ---
  const handleSaveNewItem = (itemData) => {
    handleSaveItem(itemData);
  };

  const handleSaveNewHeader = (headerData) => {
    handleSaveHeader(headerData);
  };

  // --- Generalized Save/Insert Logic ---
  const handleSaveItem = (itemData, index = null) => {
    const newItem = { id: uuid.v4(), type: 'item', ...itemData };
    setMenuStructure(prev => {
      const newStructure = [...prev];
      if (index !== null && index >= 0 && index <= newStructure.length) {
        console.log(`Inserting item at index ${index}`);
        newStructure.splice(index, 0, newItem);
      } else {
        console.log("Appending item to end");
        newStructure.push(newItem);
      }
      return newStructure;
    });
    resetModalSaveHandlers();
  };

   const handleSaveHeader = (headerData, index = null) => {
    const newHeader = { id: uuid.v4(), type: 'header', ...headerData };
     setMenuStructure(prev => {
      const newStructure = [...prev];
      if (index !== null && index >= 0 && index <= newStructure.length) {
         console.log(`Inserting header at index ${index}`);
        newStructure.splice(index, 0, newHeader);
      } else {
         console.log("Appending header to end");
        newStructure.push(newHeader);
      }
      return newStructure;
    });
    resetModalSaveHandlers();
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