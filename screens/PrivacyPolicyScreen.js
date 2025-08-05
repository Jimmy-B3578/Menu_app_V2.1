import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/UserContext';

export default function PrivacyPolicyScreen({ navigation }) {
  const { theme } = useTheme();

  // Set the header styling to match the theme
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.surface },
      headerTintColor: theme.text.main,
      headerTitleStyle: { color: theme.text.main },
    });
  }, [navigation, theme]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text.main }]}>Privacy Policy</Text>
        <Text style={[styles.date, { color: theme.text.subtext }]}>Last updated: August 5, 2025</Text>
        
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our app, SearchEat (the "App").
        </Text>
        
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          By using the App, you agree to the collection and use of information in accordance with this policy.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text.main }]}>1. Who We Are</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          SearchEat is a food search engine that allows users to search for restaurant menus and specific food ingredients. The App is operated from Australia and complies with the Australian Privacy Act 1988 and Apple App Store requirements.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text.main }]}>2. What Information We Collect</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          We only collect limited personal information necessary to provide the App's core features:
        </Text>
        
        <Text style={[styles.subsectionTitle, { color: theme.text.main }]}>Authentication Data</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          When you create an account or sign in using Auth0 via Google, we collect your name and email address.
        </Text>
        
        <Text style={[styles.subsectionTitle, { color: theme.text.main }]}>User Reviews</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          If you choose to leave reviews on menu items, we store the content of your review and associate it with your account.
        </Text>
        
        <Text style={[styles.subsectionTitle, { color: theme.text.main }]}>Usage Analytics</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          We may collect non-identifiable aggregated data such as the number of active users to help us understand general app usage.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text.main }]}>3. How We Use Your Information</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          We use your information only to:
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.text.main }]}>• Allow you to sign in and access your account</Text>
        <Text style={[styles.bulletPoint, { color: theme.text.main }]}>• Display and manage your reviews</Text>
        <Text style={[styles.bulletPoint, { color: theme.text.main }]}>• Count users for internal analytics and system improvements</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          We do not sell, rent, or share your personal information with third parties.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text.main }]}>4. Data Storage and Security</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          All data is stored securely on our servers. We use Auth0 for secure authentication and follow industry best practices to protect your personal data, including encryption and access controls.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text.main }]}>5. Your Privacy Rights</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          Under the Australian Privacy Principles (APPs):
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.text.main }]}>• You can request access to the personal information we hold about you</Text>
        <Text style={[styles.bulletPoint, { color: theme.text.main }]}>• You can request that we correct or delete your information</Text>
        <Text style={[styles.bulletPoint, { color: theme.text.main }]}>• You can delete your account at any time by contacting us</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          To make a request, email: searcheatenquiries@gmail.com
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text.main }]}>6. Third-Party Services</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          We use the following third-party services:
        </Text>
        <Text style={[styles.subsectionTitle, { color: theme.text.main }]}>Auth0 – for secure login and user authentication</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          You can read Auth0's privacy policy here: https://auth0.com/docs/secure/data-privacy-and-compliance
        </Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          These services may collect data in accordance with their own privacy policies. We do not control how third parties use your data outside of the App.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text.main }]}>7. Children's Privacy</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          Our App is not intended for children under 12. We do not knowingly collect personal data from children. If you believe your child has provided us with personal data, please contact us and we will delete it.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text.main }]}>8. Changes to This Privacy Policy</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          We may update this Privacy Policy from time to time. We will notify users of any significant changes through the App or via email. Your continued use of the App after changes means you accept the new policy.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text.main }]}>9. Contact Us</Text>
        <Text style={[styles.paragraph, { color: theme.text.main }]}>
          If you have any questions about this Privacy Policy or how we handle your data, please contact us at:
        </Text>
        <Text style={[styles.contactInfo, { color: theme.text.main }]}>SearchEat</Text>
        <Text style={[styles.contactInfo, { color: theme.text.main }]}>Email: searcheatenquiries@gmail.com</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
    marginLeft: 10,
  },
  contactInfo: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
    fontWeight: '500',
  },
}); 