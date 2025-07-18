import React, { useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Platform, Alert, TextInput, Modal, Pressable } from 'react-native';
import axios from 'axios'; // Import axios
import styles from '../styles/ProfileScreenStyles';
import { useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

// ─── Auth0 settings (moved from App.js) ───────────────────────────────────────
// const AUTH0_DOMAIN    = 'dev-fjt581rnajzi2dl2.au.auth0.com';
// const AUTH0_CLIENT_ID = 'z3fXQz8n9LtfQWmHL0aJ4poJjNj8xxSt';
// Define API endpoint - Use your machine's local IP for Expo Go, or localhost for simulators/web
// Ensure your backend allows connections from this origin (CORS)
// const API_URL = 'http://<YOUR_PREVIOUS_IP_OR_LOCALHOST>:3000'; 
// const API_URL = 'https://4bbc-110-175-73-38.ngrok-free.app'; // <-- Replace with your actual ngrok https URL
// ────────────────────────────────────────────────────────────────────────────────

const USER_STORAGE_KEY = 'user_data'; // Use the same key as in App.js

export default function ProfileScreen({ user, setUser }) { // Receive props

  // Build the deep link redirect URI
  const redirectUri = `${Constants.expoConfig.scheme}://${Constants.expoConfig.extra.EXPO_PUBLIC_AUTH0_DOMAIN}/ios/${Constants.expoConfig.ios.bundleIdentifier}/callback`;

  // Auth0 configuration (moved from App.js)
  const discovery = {
    authorizationEndpoint: `https://${Constants.expoConfig.extra.EXPO_PUBLIC_AUTH0_DOMAIN}/authorize`,
  };
  const config = {
    clientId: Constants.expoConfig.extra.EXPO_PUBLIC_AUTH0_CLIENT_ID,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
    responseType: 'token id_token',
    extraParams: {
      nonce: 'nonce', // Consider generating a random nonce
      prompt: 'login', // Force login prompt
    },
  };

  const [request, response, promptAsync] = useAuthRequest(config, discovery);

  // --- Function to save user data to backend ---
  const saveUserToDb = async (userData) => {
    if (!userData || !userData.email) {
        console.log('Cannot save user to DB: Invalid user data');
        return null; // Return null on failure
    }
    console.log(`Attempting to save user ${userData.email} to DB...`);
    try {
        const response = await axios.post(`${Constants.expoConfig.extra.EXPO_PUBLIC_API_URL}/users`, {
            name: userData.name,
            email: userData.email,
            role: userData.role // Send the role extracted from token
        });
        console.log('✅ User data saved/fetched successfully:', response.data);
        return response.data; // <<< RETURN the user object from backend response
    } catch (error) {
        console.error('🚨 Error saving/fetching user data:', error.response ? error.response.data : error.message);
        return null; // Return null on failure
    }
  };
  // ------------------------------------------

  // Handle authentication response (moved from App.js)
  useEffect(() => {
    // Make this effect async to await saveUserToDb
    const handleAuthResponse = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        if (id_token) {
          const [, payload] = id_token.split('.');
          try {
              const decoded = JSON.parse(
                  atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
              );
              console.log('### Decoded Auth0 Token Payload: ###', decoded);
              
              // Construct data from token to send to backend
              const tokenUserData = {
                name: decoded.name,
                email: decoded.email,
                role: decoded.role // Use role from token (or adjust key)
              };
              
              // --- Call backend, then set user state with backend data ---
              const savedUser = await saveUserToDb(tokenUserData);
              if (savedUser) {
                console.log('### Setting User State with DB Data: ###', savedUser);
                setUser(savedUser); // <<< Update state with data from DB
                // --- Save user to SecureStore --- 
                try {
                  await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(savedUser));
                  console.log('👤 User saved to storage');
                } catch (e) {
                  console.error('Error saving user to storage:', e);
                }
                // ----------------------------------
              } else {
                 console.error('Could not save or fetch user from database after login.');
                 // Handle error - maybe clear user state or show message
                 setUser(null);
                 // --- Clear storage on error too ---
                 try {
                     await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
                 } catch (e) { /* Ignore delete error */ }
                 // -----------------------------------
              }
              // -----------------------------------------------------------
              
          } catch (e) {
              console.error('🚨 Error decoding JWT:', e);
              setUser(null); // Clear user on error
              // --- Clear storage on error ---
              try {
                  await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
              } catch (e) { /* Ignore delete error */ }
              // -------------------------------
          }
        } else {
          console.log('❌ Auth successful but missing id_token');
          setUser(null); // Clear user
          // --- Clear storage --- 
          try {
            await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
          } catch (e) { /* Ignore delete error */ }
          // -------------------
        }
      } else if (response?.type === 'error' || response?.type === 'cancel') {
        console.error('🚨 Auth error:', response.error);
        setUser(null); // Clear user
        // --- Clear storage on auth error/cancel ---
        try {
          await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
          console.log('User storage cleared due to auth error/cancel.');
        } catch (e) { /* Ignore delete error */ }
        // -------------------------------------------
      }
    };

    handleAuthResponse(); // Call the async handler function

  }, [response, setUser]); // Added setUser dependency

  // Sign In function (moved from App.js)
  const signIn = () => {
    console.log('signIn() called');
    promptAsync();
  };

  // Sign Out function with Auth0 logout
  const signOut = async () => {
    // Show confirmation dialog
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log Out", 
          onPress: async () => {
            console.log('💨 signOut() called');
            setUser(null); // Clear local state
            // --- Delete user from SecureStore ---
            try {
              await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
              console.log('👤 User deleted from storage');
            } catch (e) {
              console.error('Error deleting user from storage:', e);
            }
            // ------------------------------------
          } 
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      {!user ? (
        <Button title="Log in with Auth0" onPress={signIn} disabled={!request} />
      ) : (
        <>
          <Text style={styles.userInfo}>Welcome, {user.name}!</Text>
          <Text style={styles.userInfo}>{user.email}</Text>
          <Button title="Log Out" onPress={signOut} />
        </>
      )}
    </View>
  );
} 