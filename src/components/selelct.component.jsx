import React, {useState, useRef, useContext} from 'react';
import {Pressable, StyleSheet, View, Modal, ScrollView} from 'react-native';
import TextWrapper from './text-wrapper.component';
import {COLORS} from '../assets/theme/theme';
import Icon from './icon.component';

const SelectContext = React.createContext();
const useSelectContext = () => useContext(SelectContext);

export const Select = ({children, defaultValue, onSelect}) => {
  const [visible, setVisible] = useState(false);
  const [selectPosition, setSelectPosition] = useState({
    top: 0,
    left: 0,
  });
  const selectRef = useRef(null);

  const onLayout = () => {
    selectRef.current.measure((x, y, width, height, pageX, pageY) => {
      setSelectPosition({top: pageY + height, left: pageX, width});
    });
  };

  const onClose = () => setVisible(false);

  const handleVisible = () => {
    setVisible(true);
  };

  const value = {
    selectPosition,
    onClose,
  };

  return (
    <SelectContext.Provider value={value}>
      <Pressable
        ref={selectRef}
        onPress={handleVisible}
        style={styles.select}
        onLayout={onLayout}>
        <TextWrapper>{defaultValue}</TextWrapper>
        <Icon
          name={!visible ? 'chevron-down-outline' : 'chevron-up-outline'}
          size={20}
          color={COLORS.black}
        />
      </Pressable>

      <Modal visible={visible} transparent={true} animationType="none">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            paddingHorizontal: 12,
          }}
          onPress={onClose}>
          {React.Children.map(children, child =>
            React.cloneElement(child, {onSelect}),
          )}
        </Pressable>
      </Modal>
    </SelectContext.Provider>
  );
};

export const SelectContent = ({children, onSelect}) => {
  const {selectPosition} = useSelectContext();
  return (
    <View style={[styles.selectContent, selectPosition]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {React.Children.map(children, child =>
          React.cloneElement(child, {onSelect}),
        )}
      </ScrollView>
    </View>
  );
};

export const SelectItem = ({children, value, onSelect, currentValue}) => {
  const {onClose} = useSelectContext();

  const handleOnSelect = val => {
    onSelect(val);
    onClose();
  };

  return (
    <Pressable
      style={({pressed}) => [
        styles.selectItem,
        {
          opacity: pressed ? 0.75 : 1,
          backgroundColor: value === currentValue ? '#eee' : 'transparent',
        },
      ]}
      onPress={() => handleOnSelect(value)}>
      <TextWrapper>{children}</TextWrapper>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  select: {
    height: 48,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
  },
  selectContent: {
    position: 'absolute',
    maxHeight: 180,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    elevation: 4,
    padding: 12,
    alignSelf: 'center',
    marginTop: 2,
  },
  selectItem: {
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
});
