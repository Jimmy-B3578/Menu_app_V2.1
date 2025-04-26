import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Platform, Alert } from 'react-native';
import axios from 'axios'; // Import axios
import styles from '../styles/ProfileScreenStyles';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// ─── Auth0 settings (moved from App.js) ───────────────────────────────────────
// const AUTH0_DOMAIN    = 'dev-fjt581rnajzi2dl2.au.auth0.com';
// const AUTH0_CLIENT_ID = 'z3fXQz8n9LtfQWmHL0aJ4poJjNj8xxSt';
// Define API endpoint - Use your machine's local IP for Expo Go, or localhost for simulators/web
// Ensure your backend allows connections from this origin (CORS)
// const API_URL = 'http://<YOUR_PREVIOUS_IP_OR_LOCALHOST>:3000'; 
// const API_URL = 'https://4bbc-110-175-73-38.ngrok-free.app'; // <-- Replace with your actual ngrok https URL
// ────────────────────────────────────────────────────────────────────────────────

export default function ProfileScreen({ user, setUser }) { // Receive props

  // Build the proxy redirect URI
  const redirectUri = makeRedirectUri({ useProxy: true });
  // console.log('Generated Auth0 Redirect URI:', redirectUri);

  // Auth0 configuration (moved from App.js)
  const discovery = {
    authorizationEndpoint: `https://${process.env.EXPO_PUBLIC_AUTH0_DOMAIN}/authorize`,
  };
  const config = {
    clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID,
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
        return;
    }
    console.log(`Attempting to save user ${userData.email} to DB...`);
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
            name: userData.name,
            email: userData.email,
        });
        console.log('✅ User data saved successfully:', response.data);
        // Optional: Show a success toast or message
        // Example: Toast.show('Profile saved!', { duration: Toast.durations.SHORT });
    } catch (error) {   
        console.error('🚨 Error saving user data:', error.response ? error.response.data : error.message);
        // Optional: Show an error toast or message
        // Example: Toast.show('Error saving profile.', { duration: Toast.durations.LONG });
    }
  };
  // ------------------------------------------

  // Handle authentication response (moved from App.js)
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        const [, payload] = id_token.split('.');
        try {
            const decoded = JSON.parse(
                // Use Buffer for Node.js compatibility if needed, atob is browser-specific
                // For React Native, atob should work, but consider libraries like 'jwt-decode'
                atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
            );
            const newUser = { name: decoded.name, email: decoded.email };
            console.log('👤 User decoded:', newUser);
            setUser(newUser); // Update state
            saveUserToDb(newUser); // <<< Call the function to save/update user in DB
        } catch (e) {
            console.error('🚨 Error decoding JWT:', e);
        }
      } else {
        console.log('❌ Auth successful but missing id_token');
      }
    } else if (response?.type === 'error') {
      console.error('🚨 Auth error:', response.error);
    } else if (response?.type === 'cancel') {
      console.log('❌ Auth cancelled');
    }
  }, [response, setUser]); // Added setUser dependency

  // Sign In function (moved from App.js)
  const signIn = () => {
    console.log('🔑 signIn() called');
    promptAsync({ useProxy: true });
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
          onPress: () => {
            console.log('💨 signOut() called');
            // Simply clear the local user state without showing any Auth0 screens
            setUser(null);
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