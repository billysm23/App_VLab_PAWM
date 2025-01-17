import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../components/theme';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { getQuizByLessonId, submitQuizResult } from '../services/api';

const QuizDetailScreen = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const { theme } = useTheme();
  const colors = useThemeColors(theme);

  useEffect(() => {
    fetchQuizDetails();
  }, [lessonId]);

  const fetchQuizDetails = async () => {
    try {
      const response = await getQuizByLessonId(lessonId);
      if (response.success) {
        setQuiz(response.data);
        // Initialize selected answers
        const initialAnswers = {};
        response.data.questions.forEach(q => {
          initialAnswers[q.id] = null;
        });
        setSelectedAnswers(initialAnswers);
      } else {
        setError(response.error?.message || 'Failed to fetch quiz');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId, optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      const selectedOption = selectedAnswers[question.id];
      const correctOption = question.options.find(opt => opt.is_correct);
      if (selectedOption === correctOption.id) {
        correctAnswers++;
      }
    });
    return (correctAnswers / quiz.questions.length) * 100;
  };

  const handleSubmitQuiz = async () => {
    // Check if all questions are answered
    const unansweredQuestions = Object.values(selectedAnswers).filter(v => v === null).length;
    if (unansweredQuestions > 0) {
      Alert.alert(
        'Incomplete Quiz',
        `You have ${unansweredQuestions} unanswered questions. Would you like to review them?`,
        [
          {
            text: 'Review',
            style: 'cancel'
          },
          {
            text: 'Submit Anyway',
            onPress: () => submitQuiz()
          }
        ]
      );
      return;
    }
    submitQuiz();
  };

  const submitQuiz = async () => {
    try {
      setSubmitting(true);
      const score = calculateScore();
      const response = await submitQuizResult(lessonId, score);
      
      if (response.success) {
        Alert.alert(
          'Quiz Completed',
          `Your score: ${score.toFixed(1)}%\n${score >= 60 ? 'Congratulations! You passed!' : 'Keep practicing!'}`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Quiz')
            }
          ]
        );
      } else {
        throw new Error(response.error?.message || 'Failed to submit quiz');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmitting(false);
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
        <TouchableOpacity 
          onPress={fetchQuizDetails}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.retryText, { color: colors.textLight }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {quiz?.lesson_title} Quiz
        </Text>
        <ThemeToggle/>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Question */}
        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.questionNumber, { color: colors.textReverse }]}>
            Question {currentQuestionIndex + 1}
          </Text>
          <Text style={[styles.questionText, { color: colors.textReverse2 }]}>
            {currentQuestion?.question_text}
          </Text>

          {/* Options */}
          <View style={styles.options}>
            {currentQuestion?.options.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  { 
                    backgroundColor: selectedAnswers[currentQuestion.id] === option.id
                      ? colors.primary
                      : colors.backgroundSecondary
                  }
                ]}
                onPress={() => handleSelectAnswer(currentQuestion.id, option.id)}
              >
                <Text style={[
                  styles.optionText,
                  { 
                    color: selectedAnswers[currentQuestion.id] === option.id
                      ? colors.textLight
                      : colors.text
                  }
                ]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={[styles.footer, { backgroundColor: colors.backgroundSecondary }]}>
        <TouchableOpacity
          onPress={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          style={[
            styles.navButton,
            { 
              backgroundColor: colors.background,
              opacity: currentQuestionIndex === 0 ? 0.5 : 1
            }
          ]}
        >
          <Feather name="chevron-left" size={24} color={colors.text} />
          <Text style={[styles.navButtonText, { color: colors.text }]}>
            Previous
          </Text>
        </TouchableOpacity>

        {currentQuestionIndex === quiz?.questions.length - 1 ? (
          <TouchableOpacity
            onPress={handleSubmitQuiz}
            disabled={submitting}
            style={[
              styles.submitButton,
              { backgroundColor: colors.primary }
            ]}
          >
            {submitting ? (
              <ActivityIndicator color={colors.textLight} />
            ) : (
              <Text style={[styles.submitButtonText, { color: colors.textLight }]}>
                Submit Quiz
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNextQuestion}
            style={[
              styles.navButton,
              { backgroundColor: colors.background }
            ]}
          >
            <Text style={[styles.navButtonText, { color: colors.text }]}>
              Next
            </Text>
            <Feather name="chevron-right" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 50,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  questionCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 14,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    lineHeight: 26,
  },
  options: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
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

export default QuizDetailScreen;