import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import { FONTS } from '../utils/constants/fonts';

// setValue - state which will store the name
// placeHolder - placeholder for input box also the label

const Input = ({setValue, placeHolder , value ,isDisabled}) => {
  const {darkMode, bgColor, textColors, bgSecondaryColor, colorYlMain} =
    useSelector(state => state.appTheme);
  const [isFocus, setIsFocus] = useState(false);
  const [inputValue, setInputvalue] = useState(null);

  // console.log('isFocus', isFocus);
  const renderLabel = () => {
    if ((inputValue !== null && inputValue !== '') || isFocus) {
      return (
        <Text
          style={[
            styles.label,
            {color: isFocus ? colorYlMain : textColors.textSecondary},
            {backgroundColor: bgColor , fontFamily:FONTS.primaryFont},
          ]}
          >
          {placeHolder}
        </Text>
      );
    }
    return null;
  };

  const changeTextFunc = e => {
    setValue(e);
    setInputvalue(e);
  };

    // console.log("input is", inputValue);

  return (
    <View className="w-full py-2">
      {renderLabel()}
      <TextInput
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        placeholder={isFocus ? '' : placeHolder}
        className="border border-gray-400 rounded-[10px] px-2 text-base"
        style={{color:textColors.textPrimary}}
        value={value}
        disabled={isDisabled || false}
        onChangeText={changeTextFunc}
        keyboardShouldPersistTaps="handled"
        placeholderTextColor={"gray"}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    left: 22,
    top: -3,
    zIndex: 999,
    paddingHorizontal: 2,
    fontSize: 14,
  },
});
