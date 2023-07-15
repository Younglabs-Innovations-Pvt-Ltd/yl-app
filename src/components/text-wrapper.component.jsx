import React from 'react';
import {Text} from 'react-native';
import {FONTS, COLORS} from '../assets/theme/theme';

const TextWrapper = ({
  fs = 16,
  ff = FONTS.roboto,
  color = COLORS.black,
  fw = '400',
  children,
}) => {
  return (
    <Text
      style={{
        fontSize: fs,
        fontFamily: ff,
        color: color,
        fontWeight: fw,
      }}>
      {children}
    </Text>
  );
};

export default TextWrapper;
