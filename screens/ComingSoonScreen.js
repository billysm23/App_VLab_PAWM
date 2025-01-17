import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../components/theme';
import { useTheme } from '../contexts/ThemeContext';

const ComingSoonScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = useThemeColors(theme);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Coming Soon Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Coming Soon
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Exciting New Features on the Horizon!
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          We're working hard to bring you an enhanced experience. Stay tuned for updates!
        </Text>

        {/* Notification Button */}
        <TouchableOpacity style={[styles.notifyButton, {shadowColor: colors.shadowMd}]}>
          <LinearGradient
            colors={colors.gradients.button.colors}
            start={colors.gradients.button.start}
            end={colors.gradients.button.end}
            style={styles.gradientButton}
          >
            <Text style={[styles.buttonText, { color: colors.textLight }]}>
              Notify Me
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  notifyButton: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ComingSoonScreen;