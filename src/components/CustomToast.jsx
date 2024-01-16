import {View, Text, useWindowDimensions, Dimensions} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

const CustomToast = ({toast}) => {
  const {textColors} = useSelector(state => state.appTheme);
  const {width, height} = Dimensions.get('window');

  return (
    <View
      className={`flex-wrap bg-[${textColors.textYlMain}] border border-gray-400 shadow-md shadow-gray-500 p-4 items-center rounded-xl`}
      // style={{width: width}}
      >
      <Text className="text-white flex-wrap font-semibold text-base w-[95%] text-center">
        {toast.message}
      </Text>
    </View>
  );
};

export default CustomToast;
