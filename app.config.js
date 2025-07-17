export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: "searcheat",
    "slug": "searcheat",
    "scheme": "searcheat",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": [
      "ios"
    ],
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "buildNumber": "11",
      "bundleIdentifier": "com.jamesbrown.SearchEat",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false,
        "NSLocationWhenInUseUsageDescription": "We use your location to show nearby businesses."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.jamesbrown.SearchEat"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-secure-store",
      "expo-web-browser"
    ],
    "owner": "james3578",
    "extra": {
      ...config.extra,
      // Add your extra configs here
      EXPO_PUBLIC_AUTH0_DOMAIN: process.env.EXPO_PUBLIC_AUTH0_DOMAIN,
      EXPO_PUBLIC_AUTH0_CLIENT_ID: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID,
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      "eas": {
        "projectId": "9fc6e8ce-ea1b-4267-bc95-7437debdc96a"
      }
    }
  }
}); 