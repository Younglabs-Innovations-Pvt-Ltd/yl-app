import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FONTS} from '../../utils/constants/fonts';

const {width, height} = Dimensions.get('window');

const Testimonial = ({data}) => {
  const {darkMode, bgColor, textColors, bgSecondaryColor, colorYlMain} =
    useSelector(state => state.appTheme);

  // console.log('data here is', data);
  return (
    <View
      className="h-[200px] rounded-md ml-2 items-center border-gray-100 overflow-hidden"
      style={{
        width: width - 130,
        backgroundColor: darkMode ? bgSecondaryColor : bgColor,
        borderWidth:darkMode ? 0 : 1
      }}>
      <View
        className="w-[100%] p-2  flex-row border-gray-200 px-3"
        style={{backgroundColor: colorYlMain , borderWidth: darkMode? 0 : 1}}>
        <View className="items-center justify-center">
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
            <MIcon name="account" size={35} color={colorYlMain} />
          </View>
        </View>
        <View className="ml-2 justify-center max-w-[80%]">
          <Text
            className="text-white text-[18px] font-semibold"
            style={[{fontFamily: FONTS.headingFont}]}>
            {data.name}
          </Text>
          <Text
            className="text-[11px] text-white leading-3"
            style={{fontFamily: FONTS.primaryFont}}>
            Posted on: {data.posted_on}
          </Text>
        </View>
      </View>
      <View className="relatibve flex-1 w-full h-full px-2">
        {/* <View className="absolute top-0 left-2 bg-gray-30">
            <MIcon
              name="format-quote-open-outline"
              size={40}
              color={darkMode ? '#e9dddd7a' : '#2522225c'}
            />
          </View> */}
        <View className="absolute bottom-0 right-2 bg-gray-30">
          <MIcon
            name="format-quote-close-outline"
            size={40}
            color={darkMode ? '#e9dddd7a' : '#2522225c'}
          />
        </View>

        <View className="w-full p-2 text-start white" style={{}}>
          <Text
            style={[
              FONTS.primary,
              {
                color: textColors.textSecondary,
                fontSize:15
              },
            ]}>
            {data?.comment}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Testimonial;
