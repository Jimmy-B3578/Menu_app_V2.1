export const lightTheme = {
    // --- Global Palette ---
    primary: '#ff7c5d', // Updated to requested color
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
        text: '#000000', // Black text for better contrast on orange button in light mode
    },
    card: {
        shadow: '#0000001A', // subtle shadow
        background: '#FFFFFF', // Using surface color
    },
    input: {
        border: '#DDD',
        placeholder: '#555',
        text: '#1C1C1E', // Text color for input fields
        background: '#FFFFFF', // Using surface color
    },
    modal: {
        overlay: 'rgba(0, 0, 0, 0.4)',
        cancelButton: '#CCCCCC',
    },
    navigation: {
        icon: '#ff7c5d',
        iconInactive: '#999',
        border: '#DDD',
    },
    tabBar: {
        active: '#FF6B00',
        inactive: '#999',
        background: '#FFFFFF', // Using surface color
    },
    map: {
        recenterButton: '#FFFFFF', // Solid white background for better visibility
        backToSearchButton: 'rgba(0, 0, 0, 0.5)',
        darkMode: false,
    },
    review: {
        star: '#FAAD14',
        starUnselected: '#CCC',
    },
    amenity: {
        background: '#FFF5E6',
        text: '#555555', // Text color for amenity tags
    },
    distance: {
        text: '#FFFFFF', // Muted gray for distance text
    },
    highlight: {
        text: '#ff7c5d',
        border: '#ff7c5d',
        background: '#fff5f2', // Very light shade of #ff7c5d
    },
    edit: {
        background: '#4CAF50', // Green color for edit buttons
    },
};

export const darkTheme = {
    // --- Global Palette ---
    primary: '#ff7c5d', // vibrant orange works well in dark mode
    secondary: '#FF6B00',
    background: '#121212', // Main app background
    surface: '#1F1F1F',    // Card/modal surface
    border: '#2E2E2E',
    borderLight: '#FFFFFF',
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
        overlay: '#303030',   // Text that goes over accent colors
    },

    // --- Component-Specific Colors ---
    button: {
        primary: '#FFA940',
        secondary: '#DCDCDC',
        disabled: '#2E2E2E',
        text: '#FFFFFF', // White text for better contrast on colored buttons
    },
    card: {
        shadow: '#00000033',
        background: '#1F1F1F', // Using surface color
    },
    input: {
        border: '#3C3C3C',
        placeholder: '#BFBFBF',
        text: '#FFFFFF', // Using text.main for input text
        background: '#1F1F1F', // Using surface color
    },
    modal: {
        overlay: 'rgba(0, 0, 0, 0.7)',
        cancelButton: '#3C3C3C',
    },
    navigation: {
        icon: '#ff7c5d',
        iconInactive: '#777',
        border: '#2E2E2E',
    },
    tabBar: {
        active: '#FFA940',
        inactive: '#777',
        background: '#1F1F1F', // Using surface color
    },
    map: {
        recenterButton: '#FFFFFF', // Solid white background for better visibility in dark mode too
        backToSearchButton: 'rgba(255,255,255,0.8)',
        darkMode: true,
    },
    review: {
        star: '#FAAD14',
        starUnselected: '#3C3C3C',
    },
    amenity: {
        background: '#2A2A2A',
        text: '#BFBFBF', // Text color for amenity tags in dark mode
    },
    distance: {
        text: '#FFFFFF', // Lighter gray for dark mode distance text
    },
    highlight: {
        text: '#ff7c5d',
        border: '#ff7c5d',
        background: '#2a1f1c', // Very light shade of #ff7c5d for dark mode
    },
    edit: {
        background: '#4CAF50', // Green color for edit buttons
    },
};

// Export the original colors for backward compatibility
export const colors = lightTheme;