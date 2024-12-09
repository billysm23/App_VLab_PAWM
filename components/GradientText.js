// Sementara tidak jadi dipakai
import React from 'react';
import { Dimensions, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text } from 'react-native-svg';

const { width } = Dimensions.get('window');

const GradientText = ({ text }) => {
  const fontSize = Math.min(28, width * 0.07);
  
  return (
    <View style={{ height: 100, width: '100%', justifyContent: 'center', flexDirection:'row' }}>
      <Svg height="100" width="100%" viewBox="0 0 300 50">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor="#60a5fa" stopOpacity="1" />
            <Stop offset="0.45" stopColor="#93c5fd" stopOpacity="1" />
            <Stop offset="1" stopColor="#ffffff" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Text
          style={{ flexShrink: 1 }}
          fill="url(#grad)"
          x="50%"
          y="50%"
          fontSize={fontSize}
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {text}
        </Text>
      </Svg>
    </View>
  );
};

export default GradientText;