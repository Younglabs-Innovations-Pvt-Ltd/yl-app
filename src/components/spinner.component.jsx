import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MotiImage} from 'moti';
import {Easing} from 'react-native-reanimated';

const Spinner = ({bg}) => {
  return (
    <View style={[styles.spinnerContainer, {backgroundColor: bg}]}>
      <MotiImage
        source={require('../assets/images/spinner.png')}
        style={styles.spinner}
        from={{
          rotate: '0deg',
        }}
        animate={{
          rotate: '360deg',
        }}
        transition={{
          duration: 700,
          type: 'timing',
          loop: true,
          repeatReverse: false,
          easing: Easing.linear,
        }}
      />
    </View>
  );
};

export default Spinner;

const styles = StyleSheet.create({
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  spinner: {
    width: 48,
    height: 48,
  },
});
