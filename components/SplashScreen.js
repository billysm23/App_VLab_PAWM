import React, { useEffect } from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onAnimationComplete }) => {
  // Animation values
  const logoScale = new Animated.Value(0);
  const logoOpacity = new Animated.Value(0);
  const backgroundOpacity = new Animated.Value(0);
  const starOpacities = Array(10).fill().map(() => new Animated.Value(0));

  useEffect(() => {
    // Animations
    const splashAnimation = Animated.sequence([
      // Fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Logo
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 10,
          friction: 2,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Animate stars
      Animated.stagger(200, starOpacities.map(opacity =>
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      )),
    ]);

    splashAnimation.start(() => {
      // Hold for 1 second then trigger completion
      setTimeout(() => {
        onAnimationComplete();
      }, 1000);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Background */}
      <Animated.View 
        style={[
          styles.background,
          { opacity: backgroundOpacity }
        ]} 
      />

      {/* Stars */}
      {starOpacities.map((opacity, index) => (
        <Animated.View
          key={index}
          style={[
            styles.star,
            styles[`star${index + 1}`],
            { opacity }
          ]}
        />
      ))}

      {/* Logo */}
      <Animated.Image
        source={require('../assets/logo1.png')}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }]
          }
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001F3F',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#001F3F',
  },
  logo: {
    width: width * 0.5,
    height: height * 0.2,
    zIndex: 2,
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  // Star positions
  star1: { top: '15%', right: '10%' },
  star2: { top: '25%', left: '15%' },
  star3: { top: '35%', right: '25%' },
  star4: { top: '10%', right: '35%' },
  star5: { top: '20%', left: '25%' },
  star6: { top: '70%', left: '55%' },
  star7: { top: '5%', right: '15%' },
  star8: { top: '60%', left: '35%' },
  star9: { top: '85%', left: '15%' },
  star10: { top: '75%', right: '15%' },
});

export default SplashScreen;