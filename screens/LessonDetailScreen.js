import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Navbar from '../components/Navbar';
import { useThemeColors } from '../components/theme';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { getLessonById } from '../services/api';

const { width, height } = Dimensions.get('window');

const LessonDetailScreen = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { theme } = useTheme();
  const colors = useThemeColors(theme);
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    fetchLessonDetails();
  }, [lessonId]);

  useEffect(() => {
    if (lesson) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [lesson]);

  const fetchLessonDetails = async () => {
    try {
      setLoading(true);
      const response = await getLessonById(lessonId);
      
      if (response.success) {
        setLesson(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch lesson details');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching lesson details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity onPress={fetchLessonDetails} style={styles.retryButton}>
          <Text style={[styles.retryText, { color: colors.primary }]}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeader = () => (
    <LinearGradient
      colors={['#001F3F', '#133B64']}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <Text style={styles.title}>{lesson?.title || ''}</Text>
        <Text style={styles.description}>{lesson?.description || ''}</Text>
        <View style={styles.metaContainer}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{lesson?.level || ''}</Text>
          </View>
          <Text style={styles.duration}>Duration: {lesson?.duration || ''}</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const TabButton = ({ name, label }) => (
    <TouchableOpacity 
      onPress={() => setActiveTab(name)}
      style={[
        styles.tab,
        activeTab === name && styles.activeTab
      ]}
    >
      <Text style={[
        styles.tabText,
        activeTab === name && styles.activeTabText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <Text style={styles.sectionTitle}>Learning Objectives</Text>
            {lesson?.learning_objectives?.map((objective, index) => (
              <View key={index} style={styles.objectiveItem}>
                <Feather name="check-circle" size={20} color="#60a5fa" />
                <Text style={styles.objectiveText}>{objective}</Text>
              </View>
            ))}
            
            <Text style={styles.sectionTitle}>Prerequisites</Text>
            {lesson?.prerequisites?.map((prerequisite, index) => (
              <View key={index} style={styles.prerequisiteItem}>
                <Feather name="arrow-right" size={20} color="#60a5fa" />
                <Text style={styles.prerequisiteText}>{prerequisite}</Text>
              </View>
            ))}
          </>
        );
      case 'content':
        return (
          <View>
            {lesson?.topics?.map((topic, index) => (
              <View key={index} style={styles.topicCard}>
                <Text style={styles.topicIcon}>{topic.icon}</Text>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription}>{topic.description}</Text>
              </View>
            ))}
          </View>
        );
      case 'resources':
        return (
          <View>
            {lesson?.key_concepts?.map((concept, index) => (
              <View key={index} style={styles.conceptCard}>
                <Text style={styles.conceptTitle}>{concept.title}</Text>
                <Text style={styles.conceptDescription}>{concept.description}</Text>
                {concept.example && (
                  <View style={styles.exampleBox}>
                    <Text style={styles.exampleText}>{concept.example}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      {renderHeader()}
      
      <View style={styles.tabContainer}>
        <TabButton name="overview" label="Overview"/>
        <TabButton name="content" label="Content" />
        <TabButton name="resources" label="Resources" />
      </View>
      
      <ScrollView style={styles.contentContainer}>
        {renderContent()}
      </ScrollView>

      <Navbar navigation={navigation} activeRoute="Lessons" />
      <ThemeToggle/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F3F',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight + 20,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: '#D8EAFF',
    marginBottom: 20,
    lineHeight: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelBadge: {
    backgroundColor: '#60a5fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  duration: {
    color: '#D8EAFF',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#60a5fa',
  },
  tabText: {
    color: '#D8EAFF',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 15,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
  },
  objectiveText: {
    color: '#D8EAFF',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  prerequisiteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
  },
  prerequisiteText: {
    color: '#D8EAFF',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  topicCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  topicIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  topicDescription: {
    fontSize: 16,
    color: '#D8EAFF',
    lineHeight: 24,
  },
  conceptCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  conceptTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  conceptDescription: {
    fontSize: 16,
    color: '#D8EAFF',
    marginBottom: 15,
    lineHeight: 24,
  },
  exampleBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    borderRadius: 8,
  },
  exampleText: {
    color: '#D8EAFF',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default LessonDetailScreen;