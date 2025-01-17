import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QuizCard = ({ quiz, onStartQuiz, colors }) => {
  const isLocked = quiz.status === 'locked';
  const isCompleted = quiz.status === 'completed';
  
  const getStatusColor = () => {
    switch(quiz.status) {
      case 'locked':
        return colors.textSecondary;
      case 'completed':
        return colors.success;
      default:
        return colors.accent2;
    }
  };

  const getStatusIcon = () => {
    switch(quiz.status) {
      case 'locked':
        return 'lock';
      case 'completed':
        return 'check-circle';
      default:
        return 'edit-3';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onStartQuiz(quiz.lesson_id)}
      disabled={isLocked}
      style={[
        styles.container,
        { backgroundColor: colors.cardBackground }
      ]}
    >
      <View style={styles.header}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: colors.iconBackground }
        ]}>
          <Feather
            name={getStatusIcon()}
            size={24}
            color={getStatusColor()}
          />
        </View>
        
        <View style={styles.headerRight}>
          {isCompleted && quiz.last_score && (
            <View style={[
              styles.scoreBadge,
              { backgroundColor: colors.success }
            ]}>
              <Text style={[styles.scoreText, { color: colors.textLight }]}>
                Score: {quiz.last_score}%
              </Text>
            </View>
          )}
          <Text style={[
            styles.timeEstimate,
            { color: colors.textReverse2 }
          ]}>
            ~{quiz.estimated_time || '15'} mins
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textReverse }]}>
          {quiz.lesson_title} Quiz
        </Text>
        <Text style={[styles.description, { color: colors.textReverse2 }]}>
          {isLocked 
            ? 'Complete the previous lesson and its quiz to unlock.'
            : isCompleted
              ? 'Quiz completed! You can retake it to improve your score.'
              : 'Test your knowledge from this lesson.'}
        </Text>

        <View style={[
          styles.statsContainer,
          { borderTopColor: colors.cardBorder }
        ]}>
          <View style={styles.statItem}>
            <Feather name="help-circle" size={16} color={colors.textReverse} />
            <Text style={[styles.statText, { color: colors.textReverse }]}>
              {quiz.total_questions} Questions
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Feather 
              name="target" 
              size={16} 
              color={colors.textReverse}
            />
            <Text style={[styles.statText, { color: colors.textReverse }]}>
              Pass: 60%
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onStartQuiz(quiz.lesson_id)}
          disabled={isLocked}
          style={[
            styles.button,
            { 
              backgroundColor: isLocked 
                ? colors.backgroundSecondary 
                : colors.primary
            }
          ]}
        >
          <Text style={[
            styles.buttonText,
            { 
              color: isLocked 
                ? colors.textSecondary 
                : colors.textLight 
            }
          ]}>
            {isLocked ? 'Locked' : isCompleted ? 'Retake Quiz' : 'Start Quiz'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeEstimate: {
    fontSize: 14,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default QuizCard;