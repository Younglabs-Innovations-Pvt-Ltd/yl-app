import {View, Text, useWindowDimensions, Dimensions} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomToast = ({toast}) => {
  const {textColors} = useSelector(state => state.appTheme);
  const {width, height} = Dimensions.get('window');
  // console.log('toast is', toast);
  let pColor = textColors.textYlMain;
  let icon = '';

  if (toast.type == 'danger') {
    pColor = '#E94E3F';
    icon = 'alert-circle-outline';
  } else if (toast.type == 'success') {
    pColor = '#23C13C';
    icon = 'check-circle';
  } else if (toast.type == 'warning') {
    pColor = '#AB950C';
    icon = 'alert-octagon';
  }

  return (
    <View
      className={`flex-wrap bg-white shadow-md shadow-gray-500 p-4 items-center rounded-xl flex-row`}
      style={{maxWidth: width - 40}}>
      {toast.type !== 'normal' && (
        <MIcon name={icon} size={25} color={pColor} />
      )}
      <Text
        className={`flex-wrap font-semibold text-base text-center ml-2`}
        style={{color: pColor}}>
        {toast.message}
      </Text>
    </View>
  );
};

export default CustomToast;
