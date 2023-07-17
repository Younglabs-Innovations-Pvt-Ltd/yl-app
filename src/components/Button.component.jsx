import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';
import {COLORS, FONTS} from '../assets/theme/theme';

const button_styles = {
  styles(bg, outlined, outlineColor) {
    if (outlined) {
      return {
        borderWidth: 1,
        borderColor: outlineColor,
      };
    }

    return {
      backgroundColor: bg,
    };
  },
};

const Button = ({
  children,
  bg,
  rounded,
  outlined,
  outlineColor,
  textColor,
  ...otherProps
}) => {
  return (
    <Pressable
      {...otherProps}
      style={({pressed}) => [
        styles.button,
        {
          opacity: pressed ? 0.75 : 1,
          borderRadius: rounded || 0,
        },
        button_styles.styles(bg, outlined, outlineColor),
      ]}>
      <Text style={[styles.buttonText, {color: textColor || COLORS.white}]}>
        {children}
      </Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    paddingVertical: 6,
    display: 'flex',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 1.5,
    fontFamily: FONTS.roboto,
  },
});
