import React from 'react';
import {StyleSheet, Pressable, ScrollView, View} from 'react-native';
import TextWrapper from './text-wrapper.component';
import {COLORS} from '../assets/theme/theme';
import Icon from './icon.component';

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
          {data.map(item => (
            <DropdownItem
              key={item}
              item={item}
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

const DropdownItem = ({item, onChangeValue, onClose, currentValue}) => {
  const handleChange = () => {
    onChangeValue(item);
    onClose();
  };

  return (
    <Pressable
      style={e => [
        styles.item,
        {backgroundColor: e.pressed ? '#eaeaea' : 'transparent'},
      ]}
      onPress={handleChange}>
      <TextWrapper>{item}</TextWrapper>
      {currentValue === item && (
        <Icon name="checkmark-outline" size={24} color={COLORS.pgreen} />
      )}
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
    height: 320,
  },
  optionList: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
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
