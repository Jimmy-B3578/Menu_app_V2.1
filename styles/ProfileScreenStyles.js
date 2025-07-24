import { StyleSheet } from 'react-native';
import { colors } from './themes';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  toggleContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  toggleLabel: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text.main,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text.main,
  },
}); 