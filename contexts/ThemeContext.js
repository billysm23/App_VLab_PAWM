import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStoredTheme, syncThemeWithServer } from '../services/themeStorage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const storedTheme = await getStoredTheme();
    setTheme(storedTheme);
    setIsLoading(false);
  };

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      console.log('Toggling theme:', newTheme);
      await syncThemeWithServer(newTheme);
    } catch (error) {
      console.error('Error toggling theme:', error);
      setTheme(theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  console.log('Theme context:', context);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};