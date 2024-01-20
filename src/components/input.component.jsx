import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {COLORS} from '../utils/constants/colors';
import {FONTS} from '../utils/constants/fonts';
import {useSelector} from 'react-redux';

const Input = ({noBorder, ...props}) => {
  const {textColors} = useSelector(state => state.appTheme);
  const styles = StyleSheet.create({
    input: {
      width: '100%',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderColor: textColors.textPrimary,
      borderRadius: 4,
      fontSize: 18,
      letterSpacing: 1.15,
      fontFamily: FONTS.roboto,
      color: textColors.textSecondary,
    },
  });

  return (
    <TextInput
      {...props}
      selectionColor={COLORS.black}
      style={[styles.input, {borderBottomWidth: noBorder ? 0 : 1}]}
      placeholderTextColor={'gray'}
    />
  );
};

export default Input;
