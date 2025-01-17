import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import { useThemeColors } from '../components/theme';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { getToken } from '../services/storage';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const colors = useThemeColors(theme);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const checkLoginStatus = async () => {
    try {
      const token = await getToken();
      setIsLoggedIn(token !== null);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const animateContent = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (isMounted) {
        await checkLoginStatus();
        animateContent();
      }
    };

    initialize();

    const unsubscribe = navigation.addListener('focus', () => {
      if (isMounted) {
        checkLoginStatus();
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigation]);

  const LoggedInContent = () => (
    <View style={styles.content}>
      <View style={[styles.logoContainer, {
        shadowColor: colors.shadowMd
      }]}>
        <Image
          source={require('../assets/computer.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, { 
          color: colors.text,
          textShadow: colors.shadowSm
        }]}>
          Welcome to CT Lab! 🚀
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Explore our interactive learning modules and start your journey in computational thinking.
        </Text>
      </View>
    </View>
  );

  const WelcomeContent = () => (
    <View style={styles.content}>
      <View style={[styles.logoContainer, {
        shadowColor: colors.shadowMd
      }]}>
        <Image
          source={require('../assets/computer.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, { 
          color: colors.text,
          textShadow: colors.shadowSm
        }]}>
          Unlock Your Full Potential in Computational Thinking
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Dive into our interactive virtual lab designed to enhance your
          Computational Thinking skills. Experience hands-on learning that
          prepares you for real-world challenges.
        </Text>
      </View>

      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Login')}
      >
        <LinearGradient
          colors={colors.gradients.button.colors}
          start={colors.gradients.button.start}
          end={colors.gradients.button.end}
          style={styles.button}
        >
          <Text style={[styles.buttonText, { color: colors.textLight }]}>
            Get Started
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { 
      backgroundColor: colors.background
    }]}>
      <StatusBar
        barStyle={theme === 'dark' ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {isLoggedIn ? <LoggedInContent /> : <WelcomeContent />}
        </Animated.View>
      </ScrollView>
      {isLoggedIn && <Navbar navigation={navigation} />}
      <ThemeToggle />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
  animatedContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Platform.OS === 'android' ? 24 : 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: Platform.OS === 'android' ? width * 0.4 : width * 0.5,
    aspectRatio: 1,
    marginBottom: Platform.OS === 'android' ? 20 : 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 30 : 40,
    maxWidth: 600,
    width: '100%',
    paddingHorizontal: Platform.OS === 'android' ? 10 : 0,
  },
  title: {
    fontSize: Platform.OS === 'android' 
      ? Math.min(24, width * 0.06) 
      : Math.min(28, width * 0.07),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: Platform.OS === 'android'
      ? Math.min(30, width * 0.075)
      : Math.min(34, width * 0.085),
  },
  subtitle: {
    fontSize: Platform.OS === 'android'
      ? Math.min(14, width * 0.035)
      : Math.min(16, width * 0.04),
    textAlign: 'center',
    lineHeight: Platform.OS === 'android'
      ? Math.min(20, width * 0.05)
      : Math.min(24, width * 0.06),
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  buttonWrapper: {
    marginHorizontal: 8,
  },
  button: {
    paddingHorizontal: Platform.OS === 'android' ? 24 : 32,
    paddingVertical: Platform.OS === 'android' ? 12 : 16,
    borderRadius: 8,
    elevation: Platform.OS === 'android' ? 4 : 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: Platform.OS === 'android' ? 180 : 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Platform.OS === 'android'
      ? Math.min(14, width * 0.035)
      : Math.min(16, width * 0.04),
    fontWeight: 'bold',
  },
});