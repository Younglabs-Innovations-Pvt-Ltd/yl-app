import {View, Text, Pressable} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import Icon from './icon.component';

const BottomSheetComponent = ({
  Children,
  isOpen,
  onClose,
  snapPoint,
  style,
  ...otherProps
}) => {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const {bgColor, textColors, colorYlMain, darkMode, bgSecondaryColor} =
    useSelector(state => state.appTheme);
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    setBottomSheetOpen(isOpen);
  }, [isOpen]);

  // variables
  const snapPoints = snapPoint || ['45%', '70%'];

  // callbacks
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      setBottomSheetOpen(false);
      onClose();
    }
  }, []);

  useEffect(() => {
    if (bottomSheetOpen) {
      bottomSheetRef.current.expand();
    } else {
      bottomSheetRef.current.close();
      onClose();
    }
  }, [bottomSheetOpen]);

  const closeBottomSheet = () => {
    bottomSheetRef.current.close();
    onClose();
  };

  return (
    <BottomSheet
      // className="relative"
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backgroundStyle={{backgroundColor: bgColor}}
      handleIndicatorStyle={{backgroundColor: textColors.textPrimary}}
      stackBehavior="replace"
      style={style}
      {...otherProps}>
      <View className="w-[100%]  flex flex-row justify-end items-center">
        <Pressable
          onPress={() => {
            setBottomSheetOpen(false);
          }}
          style={{backgroundColor: darkMode ? '#20202a' : bgColor}}
          className="h-9 w-9 flex mr-2 flex-row justify-center items-center rounded-full ">
          <Icon
            name="close-outline"
            size={25}
            color={textColors.textSecondary}
          />
        </Pressable>
      </View>
      <ScrollView
        className="flex-1 px-2 z-50"
        contentContainerStyle={{alignItems: 'center'}}>
        {typeof Children == 'function' ? <Children /> : Children}
      </ScrollView>
    </BottomSheet>
  );
};

export default BottomSheetComponent;
