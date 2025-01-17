import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CustomButton = ({ 
  onPress, 
  title, 
  loading = false,
  disabled = false,
  variant = 'primary',
  ...props 
}) => {
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.buttonContainer, disabled && styles.disabled]}
        {...props}
      >
        <LinearGradient
          colors={disabled ? ['#A0AEC0', '#718096'] : ['#4299E1', '#2B6CB0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.buttonContainer, 
        styles.linkButton,
        disabled && styles.disabled
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#4299E1" />
      ) : (
        <Text style={styles.linkButtonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.7,
  },
  linkButton: {
    backgroundColor: 'transparent',
  },
  linkButtonText: {
    color: '#4299E1',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CustomButton;