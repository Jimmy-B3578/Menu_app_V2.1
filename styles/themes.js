export const lightTheme = {
    // --- Global Palette ---
    primary: '#FF6B00', // warm orange for food-centric branding
    secondary: '#FFA940',
    background: '#FAFAFA', // Main app background
    surface: '#FFFFFF',    // Card/modal surface
    border: '#DDD',
    borderLight: '#EEE',
    error: '#FF4D4F',
    success: '#52C41A',
    warning: '#FAAD14',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // --- Text Colors (Consolidated) ---
    text: {
        main: '#1C1C1E',      // Primary text color
        subtext: '#555',      // Secondary/muted text
        overlay: '#FFFFFF',   // Text that goes over accent colors
    },

    // --- Component-Specific Colors ---
    button: {
        primary: '#FF6B00',
        secondary: '#CCCCCC',
        disabled: '#E0E0E0',
    },
    card: {
        shadow: '#0000001A', // subtle shadow
    },
    input: {
        border: '#DDD',
        placeholder: '#555',
    },
    modal: {
        overlay: 'rgba(0, 0, 0, 0.4)',
        cancelButton: '#CCCCCC',
    },
    navigation: {
        icon: '#FF6B00',
        iconInactive: '#999',
        border: '#DDD',
    },
    tabBar: {
        active: '#FF6B00',
        inactive: '#999',
    },
    map: {
        recenterButton: 'rgba(255, 255, 255, 0.9)',
        backToSearchButton: 'rgba(0, 0, 0, 0.5)',
        darkMode: false,
    },
    review: {
        star: '#FAAD14',
        starUnselected: '#CCC',
    },
    amenity: {
        background: '#FFF5E6',
    },
};

export const darkTheme = {
    // --- Global Palette ---
    primary: '#FFA940', // vibrant orange works well in dark mode
    secondary: '#FF6B00',
    background: '#121212', // Main app background
    surface: '#1F1F1F',    // Card/modal surface
    border: '#2E2E2E',
    borderLight: '#3C3C3C',
    error: '#FF4D4F',
    success: '#52C41A',
    warning: '#FAAD14',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // --- Text Colors (Consolidated) ---
    text: {
        main: '#FFFFFF',      // Primary text color
        subtext: '#BFBFBF',   // Secondary/muted text
        overlay: '#000000',   // Text that goes over accent colors
    },

    // --- Component-Specific Colors ---
    button: {
        primary: '#FFA940',
        secondary: '#555',
        disabled: '#2E2E2E',
    },
    card: {
        shadow: '#00000033',
    },
    input: {
        border: '#3C3C3C',
        placeholder: '#BFBFBF',
    },
    modal: {
        overlay: 'rgba(0, 0, 0, 0.7)',
        cancelButton: '#3C3C3C',
    },
    navigation: {
        icon: '#FFA940',
        iconInactive: '#777',
        border: '#2E2E2E',
    },
    tabBar: {
        active: '#FFA940',
        inactive: '#777',
    },
    map: {
        recenterButton: 'rgba(0, 0, 0, 0.8)',
        backToSearchButton: 'rgba(255,255,255,0.8)',
        darkMode: true,
    },
    review: {
        star: '#FAAD14',
        starUnselected: '#3C3C3C',
    },
    amenity: {
        background: '#2A2A2A',
    },
};

// Export the original colors for backward compatibility
export const colors = lightTheme;