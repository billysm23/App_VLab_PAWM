import React from 'react';
import {
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

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  // Animation values for interactive elements
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    // Animate content when screen mounts
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
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1e293b"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/computer.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Unlock Your Full Potential in Computational Thinking
            </Text>
            <Text style={styles.subtitle}>
              Dive into our interactive virtual lab designed to enhance your
              Computational Thinking skills. Experience hands-on learning that
              prepares you for real-world challenges.
            </Text>
          </View>

          {/* CTA Button */}
          <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => {
              console.log('Get Started pressed but we hasn\'t made the redirect 😁');
            }}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
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
    color: '#ffffff',
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
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: Platform.OS === 'android'
      ? Math.min(20, width * 0.05)
      : Math.min(24, width * 0.06),
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#60a5fa',
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
    color: '#ffffff',
    fontSize: Platform.OS === 'android'
      ? Math.min(14, width * 0.035)
      : Math.min(16, width * 0.04),
    fontWeight: 'bold',
  },
});