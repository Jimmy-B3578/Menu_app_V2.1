import React, { createContext, useContext } from 'react';

// 1. Create the Context
const UserContext = createContext(null);

// 2. Create the Provider Component
export const UserProvider = ({ children, user, isLoading, setUser }) => {
  // We receive user, isLoading, setUser from App.js state
  const value = {
    user,      // The user object (or null if not logged in)
    isLoading, // Loading state from App.js
    // We don't necessarily need to expose setUser directly via context,
    // App.js handles setting it based on SecureStore.
    // If other components need to trigger login/logout, they should
    // likely call functions passed down or use navigation.
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
  // Return the user and loading state
  // If you need isLoading elsewhere, return { user, isLoading }
  return context.user; 
}; 