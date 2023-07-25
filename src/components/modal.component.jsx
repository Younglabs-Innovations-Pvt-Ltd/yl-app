import React from 'react';
import {View, StyleSheet} from 'react-native';

const Modal = ({children, bg = 'transparent'}) => {
  return <View style={[styles.modal, {backgroundColor: bg}]}>{children}</View>;
};

export default Modal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
