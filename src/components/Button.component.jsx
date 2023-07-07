import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Button = ({children, bg, ...otherProps}) => {
  return (
    <TouchableOpacity
      {...otherProps}
      style={{...styles.button, backgroundColor: bg}}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
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
