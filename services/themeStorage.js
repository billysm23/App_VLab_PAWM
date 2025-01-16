import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateTheme as apiUpdateTheme } from './api';

const THEME_KEY = 'app_theme';

export const storeTheme = async (theme) => {
  try {
    if (!theme || !['light', 'dark'].includes(theme)) {
      throw new Error('Invalid theme value');
    }
    await AsyncStorage.setItem(THEME_KEY, theme);
    console.log('Theme stored:', theme);
  } catch (error) {
    console.error('Error storing theme:', error);
    throw error;
  }
};

export const getStoredTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return theme || 'light'; // Default to light if no theme stored
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'light';
  }
};

export const syncThemeWithServer = async (theme) => {
  try {
    console.log('Syncing theme with server:', theme);
    const response = await apiUpdateTheme(theme);
    if (response.success) {
      await storeTheme(theme);
      console.log('Theme synced successfully');
    }
    return response;
  } catch (error) {
    console.error('Error syncing theme with server:', error);
    throw error;
  }
};