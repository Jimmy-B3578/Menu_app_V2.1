import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../styles/themes';

// 1. Create the Context
const UserContext = createContext(null);

// 2. Create the Provider Component
export const UserProvider = ({ children, user, isLoading, setUser }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(lightTheme);

  // Load theme preference on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('darkMode');
        if (savedTheme !== null) {
          const isDark = JSON.parse(savedTheme);
          setIsDarkMode(isDark);
          setCurrentTheme(isDark ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Toggle theme function
  const toggleTheme = async () => {
    try {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      setCurrentTheme(newDarkMode ? darkTheme : lightTheme);
      await AsyncStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isDarkMode,
    currentTheme,
    toggleTheme,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Create the Consumer Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context.user; 
};

// 4. Create theme hook
export const useTheme = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a UserProvider');
  }
  return {
    theme: context.currentTheme,
    isDarkMode: context.isDarkMode,
    toggleTheme: context.toggleTheme,
  };
}; 