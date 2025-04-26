import { StyleSheet } from 'react-native';
import { colors } from './themes';

export default StyleSheet.create({
  container: {
    flex: 1,
    // Remove justification and alignment
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: colors.background, // Map will provide background
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  // Add other styles specific to MapScreen
}); 