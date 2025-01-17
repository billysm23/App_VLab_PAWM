import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useThemeColors } from './theme';

const Navbar = ({ navigation, activeRoute = 'Home' }) => {
  const { theme } = useTheme();
  const colors = useThemeColors(theme);

  const navItems = [
    { name: 'Home', icon: 'home', route: 'Home' },
    { name: 'Lessons', icon: 'book-open', route: 'Lessons' },
    { name: 'Quiz', icon: 'edit', route: 'Quiz' },
    { name: 'Profile', icon: 'user', route: 'Profile' }
  ];

  const NavButton = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => navigation.navigate(item.route)}
      style={[
        styles.navButton,
        activeRoute === item.route && styles.activeNavButton
      ]}
    >
      <View style={[
        styles.iconContainer,
        activeRoute === item.route && {
          backgroundColor: colors.primary
        }
      ]}>
        <Feather
          name={item.icon}
          size={23}
          color={activeRoute === item.route ? '#ffffff' : colors.textSecondary}
        />
      </View>
      <Text style={[
        styles.navText,
        { color: activeRoute === item.route ? colors.secondary : colors.textSecondary }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[
      styles.navbar,
      { 
        backgroundColor: colors.backgroundSecondary,
        borderTopColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }
    ]}>
      <View style={styles.navContent}>
        {navItems.map((item) => (
          <NavButton key={item.name} item={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeNavButton: {
    transform: [{ scale: 1.05 }],
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Navbar;