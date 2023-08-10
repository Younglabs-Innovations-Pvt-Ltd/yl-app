import React from 'react';
import {StyleSheet, Pressable, ScrollView, View} from 'react-native';
import TextWrapper from './text-wrapper.component';
import {COLORS} from '../assets/theme/theme';

export const Dropdown = ({defaultValue, value, ...otherProps}) => {
  return (
    <Pressable style={styles.dropdown} {...otherProps}>
      <TextWrapper color="gray">{value || defaultValue}</TextWrapper>
    </Pressable>
  );
};

export const DropdownList = ({
  gutter,
  onClose,
  data,
  onChange,
  currentValue,
}) => {
  return (
    <Pressable
      style={[styles.optionList, {paddingTop: gutter + 20}]}
      onPress={onClose}>
      <View style={styles.listWrapper}>
        <ScrollView bounces={false}>
          {data.map(age => (
            <DropdownItem
              key={age}
              age={age}
              onClose={onClose}
              onChangeValue={onChange}
              currentValue={currentValue}
            />
          ))}
        </ScrollView>
      </View>
    </Pressable>
  );
};

const DropdownItem = ({age, onChangeValue, onClose, currentValue}) => {
  const handleChange = () => {
    onChangeValue({childAge: age});
    onClose();
  };

  return (
    <Pressable
      style={e => [
        styles.item,
        {opacity: e.pressed ? 0.25 : 1},
        {
          backgroundColor: currentValue === age ? '#3AA6B9' : 'transparent',
        },
      ]}
      onPress={handleChange}>
      <TextWrapper color={currentValue === age ? COLORS.white : COLORS.black}>
        {age}
      </TextWrapper>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
  },
  listWrapper: {
    width: '100%',
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    height: 240,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 4,
  },
  optionList: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
    paddingHorizontal: 8,
  },
  item: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 4,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
