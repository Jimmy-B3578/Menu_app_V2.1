import { StyleSheet, Platform, StatusBar } from 'react-native';
import { colors } from './themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#f5f5f5',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary || '#888',
    textAlign: 'center',
  },
  // Add menu item styles later
}); 