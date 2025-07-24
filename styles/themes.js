export const colors = {
    // --- Global Palette ---
    primary: '#007AFF',
    secondary: '#5AC8FA',
    background: '#F0F0F7',
    surface: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#6c757d',
    textMuted: '#8E8E93',
    border: '#D1D1D6',
    borderLight: '#E5E5EA',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FFCC00',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // --- Component-Specific Colors ---
    button: {
        primary: '#007AFF',
        secondary: '#6c757d',
        text: '#FFFFFF',
        disabled: '#AEAEB2'
    },
    card: {
        background: '#FFFFFF',
        shadow: '#000000',
    },
    input: {
        background: '#FFFFFF',
        border: '#D1D1D6',
        text: '#1C1C1E',
        placeholder: '#8E8E93',
    },
    modal: {
        overlay: 'rgba(0, 0, 0, 0.5)',
        background: '#FFFFFF',
        cancelButton: '#AEAEB2',
    },
    navigation: {
        background: '#265476',
        icon: '#66FF66',
        iconInactive: '#00FFCC',
        title: '#1C1C1E',
        border: '#D1D1D6',
    },
    tabBar: {
        active: '#007AFF',
        inactive: '#8E8E93',
        background: '#FFFFFF',
    },
    map: {
        recenterButton: 'rgba(255, 255, 255, 0.9)',
        backToSearchButton: 'rgba(0,0,0,0.6)',
    },
    review: {
        star: '#FFCC00',
        starUnselected: '#000000',
    },
    amenity: {
        background: '#eef',
        text: '#007AFF',
    },
};

export const darkTheme = {
    ...colors,
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    textMuted: '#8E8E93',
    border: '#3A3A3C',
    card: {
        ...colors.card,
        background: '#1C1C1E',
    },
    input: {
        ...colors.input,
        background: '#2C2C2E',
        border: '#48484A',
        text: '#FFFFFF',
        placeholder: '#8E8E93',
    },
    modal: {
        ...colors.modal,
        background: '#1C1C1E',
    },
    navigation: {
        ...colors.navigation,
        background: '#1C1C1E',
        icon: '#007AFF',
        iconInactive: '#8E8E93',
        title: '#FFFFFF',
        border: '#3A3A3C',
    },
    tabBar: {
        ...colors.tabBar,
        background: '#1C1C1E',
    },
};