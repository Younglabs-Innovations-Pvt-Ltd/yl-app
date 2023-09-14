import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {Easing} from 'react-native-reanimated';
import {IMAGES} from '../utils/constants/images';

const Spinner = ({style}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      source={IMAGES.SPINNER}
      style={[
        styles.spinner,
        {
          transform: [
            {
              rotate,
            },
          ],
          ...style,
        },
      ]}
    />
  );
};

export default Spinner;

const styles = StyleSheet.create({
  spinner: {
    width: 48,
    height: 48,
  },
});
