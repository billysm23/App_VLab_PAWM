import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Navbar from '../components/Navbar';
import { useThemeColors } from '../components/theme';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { getUserProfile, logout } from '../services/api';
import { removeToken } from '../services/storage';

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = useThemeColors(theme);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        if (response.success && response.data.user) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert(
          'Error',
          'Failed to load user profile. Please try again.'
        );
      }
    };

    fetchUserProfile();
  }, []);

  const menuItems = [
    {
      title: 'Account Settings',
      icon: 'settings',
      items: [
        { name: 'Edit Profile', icon: 'edit-2', route: 'ComingSoon' },
        { name: 'Change Password', icon: 'lock', route: 'ChangePassword' },
      ]
    },
    {
      title: 'Preferences',
      icon: 'sliders',
      items: [
        { name: 'Language', icon: 'globe', route: 'ComingSoon' },
        { name: 'Notifications', icon: 'bell', route: 'ComingSoon' },
      ]
    },
    {
      title: 'Support',
      icon: 'help-circle',
      items: [
        { name: 'Help Center', icon: 'help-circle', route: 'ComingSoon' },
        { name: 'About Us', icon: 'info', route: 'About' },
      ]
    }
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes, Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await logout();
              await removeToken();
              navigation.replace('Login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const MenuItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.menuItem, 
        { 
          backgroundColor: theme === 'dark' ? colors.cardBackground : '#ffffff',
          borderColor: theme === 'dark' ? 'transparent' : '#e5e7eb',
          borderWidth: theme === 'dark' ? 0 : 1,
        }
      ]}
      onPress={() => navigation.navigate(item.route)}
    >
      <View style={styles.menuItemLeft}>
        <Feather name={item.icon} size={20} color={colors.accent2} />
        <Text style={[styles.menuItemText, { color: theme === 'dark' ? colors.text : '#002861FF' }]}>
          {item.name}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const MenuSection = ({ section }) => (
    <View style={styles.menuSection}>
      <View style={styles.sectionHeader}>
        <Feather name={section.icon} size={18} color={colors.accent} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {section.title}
        </Text>
      </View>
      {section.items.map((item, index) => (
        <MenuItem key={index} item={item} />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 75 }}>
        {/* Profile Header */}
        <View style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../assets/default-avatar.png')}
              style={styles.profileImage}
            />
            <TouchableOpacity 
              style={[styles.editImageButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Feather name="edit-2" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {userData ? userData.username : 'Loading...'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {userData ? userData.email : 'Loading...'}
          </Text>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          {menuItems.map((section, index) => (
            <MenuSection key={index} section={section} />
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={handleLogout}
          disabled={loading}
        >
          <Feather name="log-out" size={20} color="#ffffff" />
          <Text style={styles.logoutButtonText}>
            {loading ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Navbar navigation={navigation} activeRoute="Profile" />
      <ThemeToggle/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 23,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  menuContainer: {
    padding: 16,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 15,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    marginTop: 1,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;