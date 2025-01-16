import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateTheme as apiUpdateTheme } from './api';
import { getToken } from './storage';

const THEME_KEY = 'app_theme';

export const storeTheme = async (theme) => {
  try {
    if (!theme || !['light', 'dark'].includes(theme)) {
      throw new Error('Invalid theme value');
    }
    await AsyncStorage.setItem(THEME_KEY, theme);
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
    const token = await getToken();
    await storeTheme(theme);

    if (token) {
      console.log('User is logged in, syncing with server...');
      try {
        const response = await apiUpdateTheme(theme);
        return response;
      } catch (error) {
        console.warn('Failed to sync theme with server:', error);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in theme sync process:', error);
    throw error;
  }
};