import {View, Text, Dimensions, ImageBackground} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FONTS} from '../../utils/constants/fonts';

const {width, height} = Dimensions.get('window');

const Testimonial = ({data}) => {
  const {darkMode, bgColor, textColors, bgSecondaryColor, colorYlMain} =
    useSelector(state => state.appTheme);

  // console.log('data here is', data);
  {
    /* {
    id: 1,
    name: 'Savita Kolte',
    review:
      'Excellent course for anyone who wants to learn or improve on handwriting. The course is very interesting and my son really enjoyed learning.',
    image:
      'https://www.younglabs.in/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FAEdFTp4UUHXUK1FvZz2x5ao31IUUo9PfnlzL5VNipJNT%3Ds120-c-c0x00000000-cc-rp-mo-br100&w=128&q=75',
  }, */
  }

  return (
    <View
      className="h-[200px] rounded-md items-center border-gray-100 overflow-hidden"
      style={{
        width: width - 110,
        backgroundColor: darkMode ? bgSecondaryColor : bgColor,
        borderWidth: darkMode ? 0 : 1,
      }}>
      <View
        className="w-[100%] p-2  flex-row border-gray-200 px-3"
        style={{backgroundColor: colorYlMain, borderWidth: darkMode ? 0 : 1}}>
        <View className="items-center justify-center">
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
            <ImageBackground
              source={{uri: data?.image}}
              className="w-full h-full shadow shadow-gray-400"
              style={[{resizeMode: 'contain'}]}
            />
          </View>
        </View>
        <View className="ml-2 justify-center max-w-[80%]">
          <Text
            className="text-white text-[18px] font-semibold"
            style={[{fontFamily: FONTS.headingFont}]}>
            {data.name}
          </Text>
          {/* <Text
            className="text-[11px] text-white leading-3"
            style={{fontFamily: FONTS.primaryFont}}>
            Posted on: {data.posted_on}
          </Text> */}
        </View>
      </View>
      <View className="relatibve flex-1 w-full h-full px-2">
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
                fontSize: 15,
              },
            ]}>
            {data?.review}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Testimonial;
