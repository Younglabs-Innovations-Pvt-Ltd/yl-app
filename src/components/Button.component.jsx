import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';

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
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
