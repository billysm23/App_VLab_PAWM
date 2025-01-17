import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LessonCard from '../components/LessonCard';
import Navbar from '../components/Navbar';
import { useThemeColors } from '../components/theme';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { getAllLessons } from '../services/api';
import { getToken } from '../services/storage';

const LessonsScreen = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const colors = useThemeColors(theme);

  useEffect(() => {
    checkAuthAndFetchLessons();
  }, []);

  const checkAuthAndFetchLessons = async () => {
    try {
      const token = await getToken();
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigation.replace('Login');
        return;
      }

      fetchLessons(token);
    } catch (err) {
      console.error('Auth check error:', err);
      navigation.replace('Login');
    }
  };

  const fetchLessons = async () => {
    try {
      const token = await getToken();
      if (!token) {
        navigation.navigate('Login');
        return;
      }
      
      const response = await getAllLessons();
      if (response.success) {
        setLessons(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch lessons');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = (lessonId) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson.status === 'locked') {
      Alert.alert(
        'Lesson Locked',
        'Complete the previous lesson\'s quiz with a score of at least 60% to unlock this lesson.'
      );
      return;
    }
    navigation.navigate('LessonDetail', { lessonId });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.error, textAlign: 'center', marginBottom: 10 }}>
          {error}
        </Text>
        <TouchableOpacity onPress={fetchLessons}>
          <Text style={{ color: colors.primary }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView 
        contentContainerStyle={{ 
          padding: 16,
          paddingBottom: 80
        }}
      >
        <Text style={{ 
          fontSize: 20, 
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: 20,
          marginTop: 60,
          textAlign: 'center'
        }}>
          Computational Thinking Lessons
        </Text>
        
        <View style={{ gap: 16 }}>
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onStartLesson={handleStartLesson}
            />
          ))}
        </View>
      </ScrollView>
      <Navbar navigation={navigation} activeRoute="Lessons" />
      <ThemeToggle />
    </View>
  );
};

export default LessonsScreen;