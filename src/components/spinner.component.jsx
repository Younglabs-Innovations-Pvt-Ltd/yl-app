import React from 'react';
import {StyleSheet} from 'react-native';
import {MotiImage} from 'moti';
import {Easing} from 'react-native-reanimated';

const Spinner = ({style}) => {
  return (
    <MotiImage
      source={require('../assets/images/spinner.png')}
      style={[styles.spinner, {...style}]}
      from={{
        rotate: '0deg',
      }}
      animate={{
        rotate: '360deg',
      }}
      transition={{
        duration: 350,
        type: 'timing',
        loop: true,
        repeatReverse: false,
        easing: Easing.linear,
      }}
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
