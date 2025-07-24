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
import { useTheme } from '../context/UserContext';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Constants from 'expo-constants';

// --- Add Item Modal Component ---
const AddItemModal = ({ visible, onClose, onSave, initialData, theme }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price ? String(initialData.price) : '');
      setDescription(initialData.description || '');
      setIsEditMode(true);
    } else {
      setName('');
      setPrice('');
      setDescription('');
      setIsEditMode(false);
    }
  }, [initialData, visible]);

  const handleSave = () => {
    if (!name.trim() || !price.trim()) {
        Alert.alert('Missing Information', 'Please enter at least a name and price.');
        return;
    }
    if (!/^[0-9]*\\.?[0-9]+$/.test(price) && !/^[0-9]+$/.test(price)) {
        Alert.alert('Invalid Price', 'Please enter a valid number for the price (e.g., 10 or 9.99).');
        return;
    }
    onSave({ name, price: parseFloat(price), description });
  };

  const handleClose = () => {
    onClose();
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
        <View style={[styles.modalContainer, { backgroundColor: theme.modal.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.modal.background, shadowColor: theme.card.shadow }]}>
            <Text style={[styles.modalTitle, { color: theme.text.main }]}>{isEditMode ? 'Edit Menu Item' : 'Add Menu Item'}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.input.background, borderColor: theme.input.border, color: theme.input.text }]}
              placeholder="Item Name*" value={name} onChangeText={setName}
              placeholderTextColor={theme.input.placeholder}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.input.background, borderColor: theme.input.border, color: theme.input.text }]}
              placeholder="Price*" value={price} onChangeText={setPrice}
              keyboardType="numeric"
              placeholderTextColor={theme.input.placeholder}
            />
            <TextInput
              style={[styles.input, styles.inputDescription, { backgroundColor: theme.input.background, borderColor: theme.input.border, color: theme.input.text }]}
              placeholder="Description (Optional)" value={description} onChangeText={setDescription}
              multiline
              placeholderTextColor={theme.input.placeholder}
            />
            <View style={styles.modalButtonRow}>
              <Button title="Cancel" onPress={handleClose} color={theme.error} />
              <Button title={isEditMode ? 'Save Changes' : 'Save Item'} onPress={handleSave} color={theme.primary} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// --- Add Header Modal Component ---
const AddHeaderModal = ({ visible, onClose, onSave, initialData, theme }) => {
    const [title, setTitle] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setIsEditMode(true);
        } else {
            setTitle('');
            setIsEditMode(false);
        }
    }, [initialData, visible]);

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert('Missing Information', 'Please enter a header title.');
            return;
        }
        onSave({ title });
    };

     const handleClose = () => {
      onClose();
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
             <View style={[styles.modalContainer, { backgroundColor: theme.modal.overlay }]}>
                <View style={[styles.modalContent, { backgroundColor: theme.modal.background, shadowColor: theme.card.shadow }]}>
                    <Text style={[styles.modalTitle, { color: theme.text.main }]}>{isEditMode ? 'Edit Menu Header' : 'Add Menu Header'}</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.input.background, borderColor: theme.input.border, color: theme.input.text }]}
                        placeholder="Header Title*" value={title} onChangeText={setTitle}
                        placeholderTextColor={theme.input.placeholder}
                    />
                    <View style={styles.modalButtonRow}>
                       <Button title="Cancel" onPress={handleClose} color={theme.error} />
                       <Button title={isEditMode ? 'Save Changes' : 'Save Header'} onPress={handleSave} color={theme.primary} />
                    </View>
                </View>
             </View>
          </KeyboardAvoidingView>
        </Modal>
    );
};

// --- Main Screen Component ---
export default function DrinksMenuScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { businessId, businessName, pinCreatorId, selectedItem } = route.params || {};
  const currentUser = useUser();

  // State for the menu structure
  const [menuStructure, setMenuStructure] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightedItemId, setHighlightedItemId] = useState(null);

  // Add ref for tracking insertion index
  const insertionIndexRef = useRef(null);

  // State for modals
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [isAddHeaderModalVisible, setIsAddHeaderModalVisible] = useState(false);
  const [editingItemData, setEditingItemData] = useState(null);
  const [editingHeaderData, setEditingHeaderData] = useState(null); // For storing header being edited

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
        const apiUrl = `${Constants.expoConfig.extra.EXPO_PUBLIC_API_URL}/pins/${businessId}`; 
        console.log("Fetching drinks menu from:", apiUrl);
        const response = await axios.get(apiUrl);
        setMenuStructure(response.data.drinksMenu || []);
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
    handleSaveItem(itemData, insertionIndexRef.current); // Pass index
    insertionIndexRef.current = null; // Reset after use
  };

  const handleSaveNewHeader = (headerData) => {
    handleSaveHeader(headerData, insertionIndexRef.current); // Pass index
    insertionIndexRef.current = null; // Reset after use
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
    // Add these lines to close the modal
    setIsAddItemModalVisible(false);
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
    // Add these lines to close the modal
    setIsAddHeaderModalVisible(false);
    resetModalSaveHandlers();
    const success = await saveMenuToApi(optimisticStructure);
     if (!success) {
        console.log("Save failed, UI might be out of sync with backend.");
    }
  };

  const handlePressEditHeader = (headerToEdit, index) => {
    setEditingHeaderData({ ...headerToEdit, originalIndex: index });
    setHeaderModalSaveHandler(() => (updatedData) => handleSaveEditedHeader(updatedData));
    setIsAddHeaderModalVisible(true);
  };

  const handleSaveEditedHeader = async (updatedData) => {
    if (!editingHeaderData) {
        console.error('[DrinksMenuScreen] handleSaveEditedHeader: editingHeaderData is null!');
        return;
    }
    const { originalIndex } = editingHeaderData;
    let optimisticStructure = [];
    setMenuStructure(prev => {
        const newStructure = [...prev];
        newStructure[originalIndex] = {
            ...newStructure[originalIndex],
            title: updatedData.title,
        };
        optimisticStructure = newStructure;
        return newStructure;
    });
    setIsAddHeaderModalVisible(false);
    resetModalSaveHandlers();
    const success = await saveMenuToApi(optimisticStructure);
    if (!success) {
        console.log("[DrinksMenuScreen] Failed to save edited header to API.");
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
              console.log("Failed to delete item from API.");
            }
          },
        },
      ]
    );
  };

  const handlePressDeleteHeader = (headerToDelete, index) => {
    Alert.alert(
      "Delete Header",
      `Are you sure you want to delete the header "${headerToDelete.title}"? This action cannot be undone.`,
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
              console.log("Failed to delete header from API.");
            }
          },
        },
      ]
    );
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

  const handlePressEditItem = (itemToEdit, index) => {
    setEditingItemData({ ...itemToEdit, originalIndex: index });
    setItemModalSaveHandler(() => (updatedData) => handleSaveEditedItem(updatedData));
    setIsAddItemModalVisible(true);
  };

  const handleSaveEditedItem = async (updatedData) => {
    if (!editingItemData) {
      console.error('[DrinksMenuScreen] handleSaveEditedItem: editingItemData is null!');
      return;
    }

    const { originalIndex } = editingItemData;
    let optimisticStructure = [];

    setMenuStructure(prev => {
      const newStructure = [...prev];
      newStructure[originalIndex] = {
        ...newStructure[originalIndex],
        name: updatedData.name,
        price: updatedData.price,
        description: updatedData.description,
      };
      optimisticStructure = newStructure;
      return newStructure;
    });

    setIsAddItemModalVisible(false);
    resetModalSaveHandlers();

    const success = await saveMenuToApi(optimisticStructure);
    if (!success) {
      console.log("[DrinksMenuScreen] Failed to save edited item to API.");
    }
  };

  const resetModalSaveHandlers = () => {
      setItemModalSaveHandler(() => handleSaveNewItem);
      setHeaderModalSaveHandler(() => handleSaveNewHeader);
      setEditingItemData(null);
      setEditingHeaderData(null);
  }

  // --- Long Press Context Menu ---
  const showContextMenu = (item, index) => {
    const itemOptions = [
      'Add Item Above',
      'Add Item Below',
      'Add Header Above',
      'Add Header Below',
      'Edit Item',
      'Delete Item',
      'Cancel',
    ];

    const headerOptions = [
      'Add Item Above',
      'Add Item Below',
      'Add Header Above',
      'Add Header Below',
      'Edit Header',
      'Delete Header',
      'Cancel',
    ];
    
    const itemCancelButtonIndex = itemOptions.length - 1;
    const itemDestructiveButtonIndex = itemOptions.length - 2;
    const headerCancelButtonIndex = headerOptions.length - 1;
    const headerDestructiveButtonIndex = headerOptions.length - 2;

    const options = item.type === 'item' ? itemOptions : headerOptions;
    const cancelButtonIndex = item.type === 'item' ? itemCancelButtonIndex : headerCancelButtonIndex;
    const destructiveButtonIndex = item.type === 'item' ? itemDestructiveButtonIndex : headerDestructiveButtonIndex;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
          title: item.type === 'item' ? item.name : item.title,
        },
        (buttonIndex) => {
          if (buttonIndex === cancelButtonIndex) return;

          if (item.type === 'item') {
            if (buttonIndex === itemDestructiveButtonIndex) {
              handlePressDeleteItem(item, index);
            } else if (buttonIndex === 0) {
              insertionIndexRef.current = index; openAddItemModal();
            } else if (buttonIndex === 1) {
              insertionIndexRef.current = index + 1; openAddItemModal();
            } else if (buttonIndex === 2) {
              insertionIndexRef.current = index; openAddHeaderModal();
            } else if (buttonIndex === 3) {
              insertionIndexRef.current = index + 1; openAddHeaderModal();
            } else if (buttonIndex === 4) {
              handlePressEditItem(item, index);
            }
          } else { // Header actions
            if (buttonIndex === headerDestructiveButtonIndex) {
              handlePressDeleteHeader(item, index);
              return;
            }
            if (buttonIndex === 0) {
              insertionIndexRef.current = index; openAddItemModal();
            } else if (buttonIndex === 1) {
              insertionIndexRef.current = index + 1; openAddItemModal();
            } else if (buttonIndex === 2) {
              insertionIndexRef.current = index; openAddHeaderModal();
            } else if (buttonIndex === 3) {
              insertionIndexRef.current = index + 1; openAddHeaderModal();
            } else if (buttonIndex === 4) {
              handlePressEditHeader(item, index);
            }
          }
        }
      );
    } else {
      // Android Alert
      let actions = [
        { text: "Add Item Above", onPress: () => { insertionIndexRef.current = index; openAddItemModal(); }},
        { text: "Add Item Below", onPress: () => { insertionIndexRef.current = index + 1; openAddItemModal(); }},
        { text: "Add Header Above", onPress: () => { insertionIndexRef.current = index; openAddHeaderModal(); }},
        { text: "Add Header Below", onPress: () => { insertionIndexRef.current = index + 1; openAddHeaderModal(); }},
      ];

      if (item.type === 'item') {
        actions.push({ text: "Edit Item", onPress: () => handlePressEditItem(item, index) });
        actions.push({ text: "Delete Item", style: 'destructive', onPress: () => handlePressDeleteItem(item, index) });
      } else if (item.type === 'header') {
        actions.push({ text: "Edit Header", onPress: () => handlePressEditHeader(item, index) });
        actions.push({ text: "Delete Header", style: 'destructive', onPress: () => handlePressDeleteHeader(item, index) });
      }

      actions.push({ text: "Cancel", style: "cancel" });
      Alert.alert('Menu Actions', `What would you like to do with "${item.title || item.name}"?`, actions, { cancelable: true });
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
          <View style={[styles.headerItem, { borderBottomColor: theme.primary }]}>
            <Text style={[styles.headerText, { color: theme.primary }]}>{item.title}</Text>
          </View>
        ) : item.type === 'item' ? (
          <View style={[
            styles.menuItem,
            { borderBottomColor: theme.border },
            isHighlighted && styles.highlightedMenuItem
          ]}>
            <View style={styles.menuItemMain}>
              <Text style={[
                styles.menuItemName,
                { color: theme.text.main },
                isHighlighted && styles.highlightedMenuItemText
              ]}>{item.name}</Text>
              {item.description ? (
                <Text style={[
                  styles.menuItemDescription,
                  { color: theme.text.subtext },
                  isHighlighted && styles.highlightedMenuItemText
                ]}>{item.description}</Text>
              ) : null}
            </View>
            <Text style={[
              styles.menuItemPrice,
              { color: theme.primary },
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
        <View style={[styles.loadingContainerFullScreen, { backgroundColor: theme.background }]}> 
            <ActivityIndicator size="large" color={theme.primary} />
        </View>
    );
  }

  if (error && menuStructure.length === 0) {
     return (
        <View style={[styles.errorContainerFullScreen, { backgroundColor: theme.background }]}> 
            <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Conditionally Render Add Buttons */}
        {canEdit && (
          <View style={[styles.addButtonsContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
               <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={() => openAddItemModal()}> 
                   <Text style={[styles.addButtonText, { color: theme.button.text }]}>+ Add Menu Item</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={() => openAddHeaderModal()}> 
                   <Text style={[styles.addButtonText, { color: theme.button.text }]}>+ Add Header</Text>
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
                     <Text style={[styles.placeholderText, { color: theme.text.subtext }]}>No menu items added yet.</Text>
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
              insertionIndexRef.current = null;
            }}
            onSave={(dataFromModal) => {
              if (editingItemData) {
                handleSaveEditedItem(dataFromModal);
              } else {
                itemModalSaveHandler(dataFromModal);
              }
            }}
            initialData={editingItemData}
            theme={theme}
        />
         <AddHeaderModal
            visible={isAddHeaderModalVisible}
            onClose={() => { 
              setIsAddHeaderModalVisible(false); 
              resetModalSaveHandlers(); 
              insertionIndexRef.current = null;
            }}
            onSave={(dataFromModal) => {
              if (editingHeaderData) {
                handleSaveEditedHeader(dataFromModal);
              } else {
                headerModalSaveHandler(dataFromModal);
              }
            }}
            initialData={editingHeaderData}
            theme={theme}
        />
    </View>
  );
} 