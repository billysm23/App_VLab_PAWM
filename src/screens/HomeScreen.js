import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientText from '../components/GradientText';

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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        style={styles.gradient}
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
            <GradientText
              text="Unlock Your Full Potential in Computational Thinking"
            />
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
              // Button log
              console.log('Get Started pressed but the developer hasn\'t made the redirect');
            }}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: width * 0.5,
    aspectRatio: 1,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    maxWidth: 600,
    width: '100%',
  },
  title: {
    fontSize: Math.min(28, width * 0.07),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: Math.min(34, width * 0.085),
  },
  subtitle: {
    fontSize: Math.min(16, width * 0.04),
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: Math.min(24, width * 0.06),
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#60a5fa',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: Math.min(16, width * 0.04),
    fontWeight: 'bold',
  },
});