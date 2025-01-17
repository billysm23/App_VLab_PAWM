import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useThemeColors } from './theme';

const { width } = Dimensions.get('window');

const FeatureCard = ({ icon, title, description }) => {
  const { theme } = useTheme();
  const colors = useThemeColors(theme);
  
  return (
    <View style={[styles.card, { 
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadowMd
    }]}>
      <View style={[styles.iconContainer, {
        backgroundColor: colors.iconBackground
      }]}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.accent2} />
      </View>
      <Text style={[styles.cardTitle, { color: theme === 'dark' ? colors.text : '#002861FF' }]}>{title}</Text>
      <Text style={[styles.cardDescription, { color: theme === 'dark' ? colors.textSecondary : '#2A507DFF' }]}>
        {description}
      </Text>
    </View>
  );
};

const FeaturesSection = () => {
  const { theme } = useTheme();
  const colors = useThemeColors(theme);

  const features = [
    {
      icon: 'book-open-variant',
      title: 'Interactive Learning',
      description: 'Engage with hands-on exercises and real-time feedback to enhance your understanding.'
    },
    {
      icon: 'brain',
      title: 'Problem Solving',
      description: 'Develop critical thinking skills through challenging problems and scenarios.'
    },
    {
      icon: 'chart-line',
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking and feedback.'
    },
    {
      icon: 'code-tags',
      title: 'Practical Skills',
      description: 'Learn essential computational thinking skills valuable across disciplines.'
    }
  ];

  return (
    <View style={styles.featuresContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Why Choose CT Lab?
      </Text>
      <View style={styles.cardsContainer}>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featuresContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 80 : 100,
  },
  sectionTitle: {
    fontSize: Platform.OS === 'android' 
      ? Math.min(22, width * 0.055) 
      : Math.min(24, width * 0.06),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 4,
    elevation: Platform.OS === 'android' ? 3 : 0,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: Platform.OS === 'android' 
      ? Math.min(16, width * 0.04) 
      : Math.min(18, width * 0.045),
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: Platform.OS === 'android' 
      ? Math.min(14, width * 0.035) 
      : Math.min(16, width * 0.04),
    lineHeight: Platform.OS === 'android' 
      ? Math.min(20, width * 0.05) 
      : Math.min(22, width * 0.055),
  },
});

export default FeaturesSection;