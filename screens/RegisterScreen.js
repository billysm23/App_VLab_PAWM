import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useThemeColors } from '../components/theme';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { register } from '../services/api';
import { storeToken } from '../services/storage';

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const colors = useThemeColors(theme);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    // Username validation
    if (formData.username.length < 6) {
      Alert.alert('Error', 'Username must be at least 6 characters long');
      return false;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#^_()\[\]$!%*?&])[A-Za-z\d@#^_()\[\]$!%*?&]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character');
      return false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await register(
        formData.username,
        formData.email,
        formData.password
      );
      
      await storeToken(response.data.token);
      
      Alert.alert(
        'Success', 
        'Registration successful!',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Home')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, {backgroundColor: colors.background}]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.card, {backgroundColor: colors.cardBackground}]}>
          <Text style={[styles.title, { color: colors.textReverse }]}>Create Account</Text>
          
          <TextInput
            style={[styles.input, {backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.textReverse}]}
            placeholder="Username"
            value={formData.username}
            onChangeText={(value) => handleInputChange('username', value)}
            autoCapitalize="none"
            placeholderTextColor="#84909FFF"
          />
          
          <TextInput
            style={[styles.input, {backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.textReverse}]}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#84909FFF"
          />
          
          <TextInput
            style={[styles.input, {backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.textReverse}]}
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
            placeholderTextColor="#84909FFF"
          />
          
          <TextInput
            style={[styles.input, {backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.textReverse}]}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry
            placeholderTextColor="#84909FFF"
          />
          
          <TouchableOpacity 
            style={[styles.buttonWrapper, {shadowColor: colors.shadowMd}]}
            onPress={handleRegister}
            disabled={loading}
          >
            <LinearGradient
              colors={colors.gradients.button.colors}
              start={colors.gradients.button.start}
              end={colors.gradients.button.end}
              style={styles.button}
            >
              <Text style={[styles.buttonText, { color: colors.textLight }]}>
                {loading ? 'Creating Account...' : 'Register'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, {color: colors.textReverse2}]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, {color: colors.textLink}]}>Login here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ThemeToggle/>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    borderRadius: 12,
    padding: 24,
    gap: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  buttonWrapper: {
    borderRadius: 8,
    shadowOffset: {
      width: 0, 
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {},
  loginLink: {
    fontWeight: 'bold',
  },
});