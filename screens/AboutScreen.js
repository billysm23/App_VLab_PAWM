import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useThemeColors } from '../components/theme';
import { useTheme } from '../contexts/ThemeContext';

const AboutScreen = ({navigation}) => {
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <LinearGradient
          colors={theme === 'dark' ? ['#001F3F', '#133B64'] : ['#1C65A9FF', '#60CCEFFF']}
          style={styles.header}
        >
          <Text style={[styles.title, { color: theme === 'dark' ? '#ffffff' : '#011A42FF' }]}>
            About CT Lab
          </Text>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.description, { color: colors.text }]}>
            CT Lab is an innovative virtual laboratory designed to enhance your understanding of Computational
            Thinking through interactive learning experiences. Our platform provides accessible, engaging, and 
            effective tools for learning computational thinking concepts, preparing students for the challenges of
            tomorrow's digital world.
          </Text>

          {/* Mission */}
          <View style={styles.missionContainer}>
            <Text style={[styles.missionTitle, { color: colors.text }]}>Our Mission</Text>
            <Text style={[styles.missionText, { color: colors.textSecondary }]}>
              To provide accessible, engaging, and effective tools for learning computational thinking concepts,
              preparing students for the challenges of tomorrow's digital world.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 1,
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 170,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  missionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  missionText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default AboutScreen;