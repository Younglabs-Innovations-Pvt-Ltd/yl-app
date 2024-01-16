import {View, Text} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomSheetComponent = ({Children, isOpen, onClose, snapPoint}) => {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const {bgColor, textColors, colorYlMain, darkMode , bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
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
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      style={{}}
      backgroundStyle={{backgroundColor: bgColor}}
      handleIndicatorStyle={{backgroundColor: textColors.textPrimary}}>
      <View className="w-full px-3 items-end">
        <View
          className={`${
            darkMode ? 'bg-gray-500' : 'bg-gray-100'
          }  rounded-full p-1`}>
          <MIcon
            name="close"
            color={textColors.textSecondary}
            size={30}
            onPress={closeBottomSheet}
          />
        </View>
      </View>
      <ScrollView
        className="flex-1 px-2 z-50"
        contentContainerStyle={{alignItems: 'center'}}>
        <Children />
      </ScrollView>
    </BottomSheet>
  );
};

export default BottomSheetComponent;
