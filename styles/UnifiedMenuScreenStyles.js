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
    color: colors.tabBar.active,
  },
  tabBarInactiveTintColor: {
    color: colors.tabBar.inactive,
  },
  tabBarIndicatorStyle: {
    backgroundColor: colors.primary,
  },
  tabBarStyle: {
    backgroundColor: colors.tabBar.background,
  },
  tabBarLabelStyle: {
    fontWeight: 'bold',
  },
}); 