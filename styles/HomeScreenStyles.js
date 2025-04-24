import { StyleSheet } from 'react-native';
import { colors } from './themes'; // Import theme colors

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background, // Use theme color
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text, // Use theme color
  },
  // Add other styles specific to HomeScreen
}); 