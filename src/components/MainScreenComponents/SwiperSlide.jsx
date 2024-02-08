import {View, Text, ImageBackground, Pressable, Dimensions} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import Animated, {
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import tw from 'twrnc';
import {FONTS} from '../../utils/constants/fonts';

const {width, height} = Dimensions.get('window');

const SwiperSlide = ({item, navigation}) => {
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const marginBottom = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animate = () => {
    marginBottom.value = withDelay(500, withSpring(20));
    opacity.value = withDelay(500, withSpring(1));
  };
  animate();

  return (
    <View
      style={[tw`h-full flex justify-center  items-center`, {width: width}]}>
      <View style={[tw`rounded-md h-[100%] w-[95%]`, , {overflow: 'hidden'}]}>
        <ImageBackground
          source={{
            uri: 'https://img.freepik.com/free-photo/playful-boy-holding-stack-books_23-2148414547.jpg?w=740&t=st=1703674788~exp=1703675388~hmac=24445b95541fba0512cfcb562557440de28ed52ef02e516f9a050a1d2871cc21',
          }}
          style={[
            tw`w-[100%] rounded h-full justify-center items-center`,
            {flex: 1},
          ]}
          resizeMode="cover">
          <LinearGradient
            colors={['#00000014', '#000000db']}
            className="w-full"
            start={{x: 0.5, y: 0.1}}>
            <View
              style={[
                tw`w-full h-full justify-end items-start p-2
              `,
              ]}>
              <Animated.View
                style={{marginBottom: marginBottom, opacity: opacity}}>
                <Text
                  className="text-[30px] text-white font-semibold"
                  style={{fontFamily: FONTS.headingFont}}>
                  {item.title}
                </Text>
                <Text
                  className="text-base text-gray-300"
                  style={{fontFamily: FONTS.primaryFont}}>
                  {item.subheading}
                </Text>
                <View className="flex-row mt-3 justify-center flex-wrap">
                  
                  <Pressable
                    className="flex-row rounded-full py-2 px-3 justify-center items-center border"
                    style={{borderColor: textColors.textYlMain}}
                    onPress={() =>
                      navigation.navigate('CourseDetailScreen', {
                        courseData: item,
                        subScreenToShow: 'courseDetails',
                      })
                    }>
                    {/* <MIcon name="whatsapp" size={30} color="white" /> */}
                    <Text
                      className="text-[14px] font-semibold"
                      style={{
                        color: textColors.textYlMain,
                        fontFamily: FONTS.primaryFont,
                      }}>
                      Course Details
                    </Text>
                  </Pressable>
                  <Pressable
                    className="ml-2 flex-row rounded-full py-2 px-3 justify-center items-center border"
                    style={{borderColor: textColors.textYlMain}}
                    onPress={() =>
                      navigation.navigate('CourseDetailScreen', {
                        courseData: item,
                        subScreenToShow: 'bookFreeClass',
                      })
                    }>
                    {/* <MIcon name="whatsapp" size={30} color="white" /> */}
                    <Text
                      className="text-[14px] font-semibold"
                      style={{
                        color: textColors.textYlMain,
                        fontFamily: FONTS.primaryFont,
                      }}>
                      Book Demo
                    </Text>
                  </Pressable>
                  <Pressable
                    className="ml-2 flex-row rounded-full py-2 px-3 justify-center items-center border"
                    style={{borderColor: textColors.textYlMain}}
                    onPress={() =>
                      navigation.navigate('CourseDetailScreen', {
                        courseData: item,
                        subScreenToShow: 'payAndEnroll',
                      })
                    }>
                    {/* <MIcon name="whatsapp" size={30} color="white" /> */}
                    <Text
                      className="text-[14px] font-semibold"
                      style={{
                        color: textColors.textYlMain,
                        fontFamily: FONTS.primaryFont,
                      }}>
                      Pay and Enroll
                    </Text>
                  </Pressable>

                </View>
              </Animated.View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </View>
  );
};

export default SwiperSlide;
