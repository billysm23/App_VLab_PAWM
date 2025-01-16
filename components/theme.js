export const themeColors = {
  light: {
    primary: '#001F3F',
    secondary: '#d5f6ff',
    accent: '#56c5fd',
    login: '#2162c2',

    // Background
    background: '#001F3F',
    backgroundSecondary: '#002c5c',
    backgroundAccent: '#004080',
    backgroundFeatures: '#f1f5f9',
    cardBackground: '#ffffff',
    cardBorder: '#e5e7eb',
    inputBackground: '#ffffff',
    inputBorder: '#e2e8f0',
    iconBackground: '#0f172a',

    // Text
    text: '#ffffff',
    textSecondary: '#a8c5e9',
    textLight: '#ffffff',
    textLink: 'rgb(74, 132, 223)',
    textBlue: 'rgb(0, 49, 87)',
    placeholderText: '#9ca3af',

    // Status
    error: '#dc3545',
    errorBackground: '#fef2f2',
    errorBorder: '#fecaca',
    success: '#28a745',
    warning: '#ffc107',

    gradients: {
      button: {
        colors: ['#156FFFFF', '#60a5fa'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
      },
      background: {
        colors: ['#ffffff', '#f1f5f9'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 }
      }
    },

    // Shadows
    shadowSm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    shadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    authShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    authShadowHover: '0 6px 12px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05)',
  },
  
  dark: {
    primary: '#60a5fa',
    secondary: '#1e3a8a',
    accent: '#60a5fa',
    login: '#3b82f6',

    // Background
    background: '#0A0F1E',
    backgroundSecondary: '#111827',
    backgroundAccent: '#1f2937',
    backgroundFeatures: '#111827',
    cardBackground: '#1f2937',
    cardBorder: '#374151',
    inputBackground: '#1f2937',
    inputBorder: '#374151',
    iconBackground: '#374151',

    // Text
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textLight: '#ffffff',
    textLink: '#60a5fa',
    textHighlight: '#93c5fd',
    placeholderText: '#64748b',

    // Buttons & Accents
    buttonPrimary: '#3b82f6',
    buttonSecondary: '#1d4ed8',
    buttonHover: '#2563eb',

    // Status Colors
    error: '#ef4444',
    errorBackground: 'rgba(239, 68, 68, 0.1)',
    errorBorder: 'rgba(239, 68, 68, 0.2)',
    success: '#22c55e',
    warning: '#f59e0b',

    gradients: {
      button: {
        colors: ['#3b82f6', '#0ea5e9'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
      },
      background: {
        colors: ['#0f172a', '#1e293b'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 }
      },
      card: {
        colors: ['#1e293b', '#334155'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 }
      }
    },

    // Shadows
    shadowSm: '0 1px 2px rgba(0, 0, 0, 0.4)',
    shadowMd: '0 4px 6px rgba(0, 0, 0, 0.4)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
    authShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    authShadowHover: '0 6px 12px -1px rgba(0, 0, 0, 0.4)',
  }
};
export const getThemeColors = (theme) => themeColors[theme];

export const useThemeColors = (theme) => {
  return themeColors[theme];
};