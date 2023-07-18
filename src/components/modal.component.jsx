import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../assets/theme/theme';

const Modal = ({children, bg = COLORS.white}) => {
  return (
    <View style={[styles.spinnerContainer, {backgroundColor: bg}]}>
      {children}
    </View>
  );
};

export default Modal;

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
});
