import React from 'react';
import {Text} from 'react-native';
import {COLORS} from '../utils/constants/colors';
import {FONTS} from '../utils/constants/fonts';

const TextWrapper = ({
  fs = 16,
  ff = FONTS.roboto,
  color = COLORS.black,
  fw = '400',
  children,
  styles,
  ...otherProps
}) => {
  return (
    <Text
      style={{
        fontSize: fs,
        fontFamily: ff,
        color: color,
        fontWeight: fw,
        ...styles,
      }}
      {...otherProps}>
      {children}
    </Text>
  );
};

export default TextWrapper;
