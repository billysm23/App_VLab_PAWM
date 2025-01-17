import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import QuizCard from '../components/QuizCard';
import { useThemeColors } from '../components/theme';
import { useTheme } from '../contexts/ThemeContext';
import { getAllQuizzes } from '../services/api';
import { getToken } from '../services/storage';

const QuizScreen = ({ navigation }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const colors = useThemeColors(theme);

  useEffect(() => {
    checkAuthAndFetchQuizzes();
  }, []);

  const checkAuthAndFetchQuizzes = async () => {
    try {
      const token = await getToken();
      if (!token) {
        navigation.replace('Login');
        return;
      }
      fetchQuizzes();
    } catch (err) {
      console.error('Auth check error:', err);
      navigation.replace('Login');
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching quizzes...');
      
      const response = await getAllQuizzes();
      console.log('Quiz response:', response);
      
      if (response.success) {
        setQuizzes(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch quizzes');
      }
    } catch (err) {
      console.error('Error in fetchQuizzes:', err);
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (lessonId) => {
    const quiz = quizzes.find(q => q.lesson_id === lessonId);
    if (quiz.status === 'locked') {
      Alert.alert(
        'Quiz Locked',
        'Complete the previous lesson and its quiz first to unlock this quiz.'
      );
      return;
    }
    navigation.navigate('QuizDetail', { lessonId });
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
        <TouchableOpacity 
          onPress={fetchQuizzes}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.retryText, { color: colors.textLight }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Knowledge Check
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Test your understanding of each lesson
        </Text>
        
        <View style={styles.quizContainer}>
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.lesson_id}
              quiz={quiz}
              onStartQuiz={handleStartQuiz}
              colors={colors}
            />
          ))}
        </View>
      </ScrollView>
      <Navbar navigation={navigation} activeRoute="Quiz" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  quizContainer: {
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizScreen;