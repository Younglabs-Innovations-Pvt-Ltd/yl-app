import {View, Text} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';

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

  const CustomBackdrop = ({animatedIndex, style}) => {
    // animated variables
    const containerAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(animatedIndex.value, [0, 1], [0, 1]),
    }));

    // styles
    const containerStyle = useMemo(
      () => [
        style,
        {
          backgroundColor: '#000000a7',
        },
        containerAnimatedStyle,
      ],
      [style, containerAnimatedStyle],
    );

    return <Animated.View style={containerStyle} />;
  };

  const CustomBackDrop = () => {
    return <View className="bg-[#000000a7]"></View>;
  };

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
      <ScrollView
        className="flex-1 px-2 z-50"
        contentContainerStyle={{alignItems: 'center'}}>
        {typeof Children == 'function' ? <Children /> : Children}
      </ScrollView>
    </BottomSheet>
  );
};

export default BottomSheetComponent;
