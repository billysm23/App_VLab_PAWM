import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useThemeColors } from './theme';

const LessonCard = ({ lesson, onStartLesson }) => {
  const isLocked = lesson.status === 'locked';
  const isCompleted = lesson.status === 'completed';
  const isAttempted = lesson.status === 'attempted';
  const { theme } = useTheme();
  const colors = useThemeColors(theme);
  
  const getStatusIcon = () => {
    switch(lesson.status) {
      case 'completed':
        return 'check-circle';
      case 'attempted':
        return 'clock';
      case 'locked':
        return 'lock';
      default:
        return 'book-open';
    }
  };

  const getLevelColor = () => {
    switch(lesson.level) {
      case 'Beginner':
        return { bg: colors.accent, text: colors.textReverse };
      case 'Intermediate':
        return { bg: colors.accent2, text: colors.text };
      case 'Advanced':
        return { bg: '#FC5959FF', text: colors.text };
      default:
        return { bg: colors.accent, text: colors.textReverse };
    }
  };

  return (
    <TouchableOpacity 
      disabled={isLocked}
      activeOpacity={0.85}
      style={[styles.container, { backgroundColor: colors.cardBackground }]}
      onPress={() => onStartLesson(lesson.id)}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
          <Feather
            name={getStatusIcon()}
            size={24}
            color={isCompleted ? colors.success : isLocked ? colors.textSecondary : colors.accent2}
          />
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor().bg }]}>
            <Text style={[styles.levelText, { color: getLevelColor().text }]}>
              {lesson.level}
            </Text>
          </View>
          <Text style={[styles.duration, { color: colors.textReverse2 }]}>
            {lesson.duration}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textReverse }]}>
          {lesson.title}
        </Text>
        <Text style={[styles.description, { color: colors.textReverse2 }]}>
          {lesson.description}
        </Text>

        {/* Prerequisites */}
        {lesson.prerequisites && lesson.prerequisites.length > 0 && (
          <View style={styles.prerequisitesContainer}>
            <Text style={[styles.prerequisitesTitle, { color: colors.text }]}>
              Prerequisites:
            </Text>
            {lesson.prerequisites.map((prereq, index) => (
              <View key={index} style={styles.prerequisiteItem}>
                <Text style={[styles.bullet, { color: colors.textSecondary }]}>•</Text>
                <Text style={[styles.prerequisiteText, { color: colors.textSecondary }]}>
                  {prereq}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Status Badge */}
        {(isCompleted || isAttempted) && (
          <View style={[
            styles.statusBadge,
            { backgroundColor: isCompleted ? colors.success : colors.warning }
          ]}>
            <Text style={[styles.statusText, { color: colors.textLight }]}>
              {isCompleted ? 'Completed' : 'In Progress'}
            </Text>
          </View>
        )}

        {/* Button */}
        <TouchableOpacity
          onPress={() => onStartLesson(lesson.id)}
          disabled={isLocked}
          style={[
            styles.button,
            { backgroundColor: isLocked ? colors.backgroundSecondary : colors.primary }
          ]}
        >
          <Text style={[
            styles.buttonText,
            { color: isLocked ? colors.textSecondary : colors.textLight }
          ]}>
            {isLocked ? 'Locked' : 'Start Lesson'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
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
    gap: 18,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  duration: {
    fontSize: 14,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  prerequisitesContainer: {
    marginTop: 12,
  },
  prerequisitesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  prerequisiteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bullet: {
    marginRight: 8,
    fontSize: 14,
  },
  prerequisiteText: {
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 8
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600'
  }
});

export default LessonCard;