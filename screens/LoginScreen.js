import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useThemeColors } from '../components/theme';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { login } from '../services/api';
import { storeToken } from '../services/storage';

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const colors = useThemeColors(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await login(email, password);
      if (response.success && response.data && response.data.token) {
        await storeToken(response.data.token);
        navigation.replace('Home');
      } else {
        throw new Error('Invalid login response format');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.card, {backgroundColor: colors.cardBackground}]}>
        <Text style={[styles.title, {color: colors.textReverse}]}>
          Login
        </Text>
        
        <TextInput
          style={[styles.input, {backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.textReverse}]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#84909FFF"
        />
        
        <TextInput
          style={[styles.input, {backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.textReverse}]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#84909FFF"
        />
        
        <TouchableOpacity 
          style={[styles.buttonWrapper, {shadowColor: colors.shadowMd}]}
          onPress={handleLogin}
          disabled={loading}
        >
          <LinearGradient
            colors={colors.gradients.button.colors}
            start={colors.gradients.button.start}
            end={colors.gradients.button.end}
            style={styles.button}
          >
            <Text style={[styles.buttonText, {color: colors.textLight}]}>
              {loading ? 'Loading...' : 'Login'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, {color: colors.textReverse2}]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.registerLink, {color: colors.textLink}]}>Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ThemeToggle/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    padding: 1,
  },
  registerText: {},
  registerLink: {
    fontWeight: 'bold',
  },
});