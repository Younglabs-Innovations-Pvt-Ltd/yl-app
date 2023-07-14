import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {FONTS} from '../assets/theme/theme';

const Input = props => {
  return <TextInput {...props} selectionColor="#000" style={styles.input} />;
};

export default Input;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderColor: '#000',
    borderBottomWidth: 1,
    borderRadius: 4,
    fontSize: 18,
    letterSpacing: 1.15,
    fontFamily: FONTS.roboto,
  },
});
