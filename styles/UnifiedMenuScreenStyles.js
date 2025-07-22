import { StyleSheet } from 'react-native';
import { colors } from './themes';

export const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.background,
  },
  headerTintColor: {
    color: colors.text,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  tabBarActiveTintColor: {
    color: colors.primary,
  },
  tabBarInactiveTintColor: {
    color: colors.textMuted,
  },
  tabBarIndicatorStyle: {
    backgroundColor: colors.primary,
  },
  tabBarStyle: {
    backgroundColor: colors.background,
  },
  tabBarLabelStyle: {
    fontWeight: 'bold',
  },
}); 