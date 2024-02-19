import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector} from 'react-redux';
import {FONTS} from '../utils/constants/fonts';
// import AntDesign from '@expo/vector-icons/AntDesign';

const DropdownComponent = ({
  data,
  placeHolder,
  setSelectedValue,
  defaultValue,
}) => {
  const {darkMode, bgColor, textColors, bgSecondaryColor, colorYlMain} =
    useSelector(state => state.appTheme);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  // useEffect(() => {
  //   console.log('value is', value);
  // }, [value]);

  useEffect(() => {
    if (defaultValue && data) {
      const filtered = data?.filter(item => item.label === defaultValue);
      setValue(filtered[0]);
    }
  }, [defaultValue, data]);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          style={[
            styles.label,
            {borderRadius:8 , paddingHorizontal:4 , paddingVertical:2},
            {color: isFocus ? colorYlMain : textColors.textSecondary},
            {backgroundColor: bgColor, fontFamily: FONTS.primaryFont},
          ]}>
          {placeHolder}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container} className="">
      {renderLabel()}
      <Dropdown
        mode="default"
        style={[
          styles.dropdown,
          isFocus && {
            borderColor: colorYlMain,
          },
          {borderWidth: 1, borderColor: '#9ca3af'},
        ]}
        placeholderStyle={[
          styles.placeholderStyle,
          {color: textColors.textSecondary, fontFamily: FONTS.primaryFont},
        ]}
        selectedTextStyle={[
          styles.selectedTextStyle,
          {color: textColors.textPrimary},
        ]}
        inputSearchStyle={styles.inputSearchStyle}
        containerStyle={[
          {
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 8,
            backgroundColor: bgColor,
          },
        ]}
        activeColor={colorYlMain}
        itemTextStyle={{color: textColors.textPrimary}}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeHolder : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setSelectedValue(item.value);
          setValue(item);
          setIsFocus(false);
        }}
        itemContainerStyle={{borderRadius: 8}}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  dropdown: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
