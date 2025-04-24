import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Platform, Alert } from 'react-native';
import styles from '../styles/ProfileScreenStyles';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// ─── Auth0 settings (moved from App.js) ───────────────────────────────────────
const AUTH0_DOMAIN    = 'dev-fjt581rnajzi2dl2.au.auth0.com';
const AUTH0_CLIENT_ID = 'z3fXQz8n9LtfQWmHL0aJ4poJjNj8xxSt';
// ────────────────────────────────────────────────────────────────────────────────

export default function ProfileScreen({ user, setUser }) { // Receive props

  // Build the proxy redirect URI
  const redirectUri = makeRedirectUri({ useProxy: true });

  // Auth0 configuration (moved from App.js)
  const discovery = {
    authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
  };
  const config = {
    clientId: AUTH0_CLIENT_ID,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
    responseType: 'token id_token',
    extraParams: {
      nonce: 'nonce', // Consider generating a random nonce
      prompt: 'login', // Force login prompt
    },
  };

  const [request, response, promptAsync] = useAuthRequest(config, discovery);

  // Handle authentication response (moved from App.js)
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        // Decode the JWT payload
        const [, payload] = id_token.split('.');
        const decoded = JSON.parse(
          atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        );
        setUser({ name: decoded.name, email: decoded.email }); // Update state via prop
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