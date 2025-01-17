import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  ...props
}) => {
  const [isSecureTextVisible, setIsSecureTextVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View 
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A0AEC0"
          secureTextEntry={secureTextEntry && !isSecureTextVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <Feather
            name={isSecureTextVisible ? 'eye-off' : 'eye'}
            size={20}
            color="#718096"
            onPress={() => setIsSecureTextVisible(!isSecureTextVisible)}
            style={styles.icon}
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: '#2D3748',
  },
  focusedInput: {
    borderColor: '#4299E1',
  },
  errorInput: {
    borderColor: '#F56565',
  },
  icon: {
    padding: 4,
  },
  errorText: {
    color: '#F56565',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomInput;