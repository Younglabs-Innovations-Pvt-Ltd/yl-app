import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {useSelector} from 'react-redux';
import {FONTS} from '../utils/constants/fonts';

const BottomSheetInput = ({placeHolder, value, setValue}) => {
  const [inputText, setInputText] = useState('');
  const {textColors, colorYlMain, bgColor} = useSelector(
    state => state.appTheme,
  );
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (value) {
      setInputText(value);
    }
  }, [value]);

  const renderLabel = () => {
    if ((inputText !== null && inputText !== '') || isFocus) {
      return (
        <Text
          style={[
            styles.label,
            {borderRadius: 8, paddingHorizontal: 4, paddingVertical: 2},
            {color: isFocus ? colorYlMain : textColors.textSecondary},
            {backgroundColor: bgColor, fontFamily: FONTS.primaryFont},
          ]}>
          {placeHolder || ''}
        </Text>
      );
    }
    return null;
  };

  const changeValue = e => {
    setValue && setValue(e);
    setInputText(e);
  };

  return (
    <View className="w-full">
      {renderLabel()}
      <BottomSheetTextInput
        placeholder={isFocus ? '' : placeHolder}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        style={[styles.input, {color: textColors.textPrimary}]}
        textContentType="name"
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="default"
        value={inputText}
        onChangeText={e => changeValue(e)}
        selectionColor={textColors.textYlMain}
        placeholderTextColor={textColors.textSecondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    left: 22,
    top: -13,
    zIndex: 999,
    paddingHorizontal: 2,
    fontSize: 14,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#78909C',
    borderRadius: 9,
    paddingHorizontal: 8,
    fontSize: 14,
  },
});

export default BottomSheetInput;
