import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';
import {FONTS} from '../assets/theme/theme';

const Button = ({children, bg, ...otherProps}) => {
  return (
    <Pressable
      {...otherProps}
      style={({pressed}) => [
        styles.button,
        {backgroundColor: bg, opacity: pressed ? 0.75 : 1},
      ]}>
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    paddingVertical: 6,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1.5,
    fontFamily: FONTS.roboto,
  },
});
