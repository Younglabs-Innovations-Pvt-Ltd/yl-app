import React from 'react';
import {StyleSheet, Pressable} from 'react-native';
import TextWrapper from './text-wrapper.component';

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
  loading,
  children,
  bg,
  rounded,
  outlined,
  outlineColor,
  textColor,
  shadow,
  textSize = 16,
  ...otherProps
}) => {
  const buttonStyle = ({pressed}) => [
    styles.button,
    {
      opacity: pressed ? 0.75 : 1,
      borderRadius: rounded || 0,
      elevation: shadow ? 2 : 0,
    },
    button_styles.styles(bg, outlined, outlineColor),
  ];

  return (
    <Pressable {...otherProps} style={buttonStyle} disabled={loading}>
      <TextWrapper
        fs={textSize}
        fw="700"
        styles={{textAlign: 'center', letterSpacing: 1.1}}
        color={textColor}>
        {children}
      </TextWrapper>
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
});
